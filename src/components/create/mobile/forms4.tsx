"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { isValidEmail, isValidUrl } from "../validate";
import { Counter, FieldError, Fld, Slide, TrackingPill, textArea, textInput } from "./ui";
import { IntlNumberFld, TextFld, mobileNumberOk, trimmed } from "./fields";
import type { Check, FormState, Values } from "./fields";

/**
 * Batch 4 of the mobile forms: create_mobile_google_maps / _email /
 * _google_review / _sms.html (Monday 5646620665), on the established pieces.
 */

/* ---- Validation ------------------------------------------------------------ */

export function checksForBatch4(type: string, values: Values): Check[] {
  switch (type) {
    case "location":
      return [
        {
          id: "gmQ",
          key: "gmReq",
          msg: trimmed(values.address) && values.addressPicked === "1" ? null : "Please select a location from the suggestions.",
        },
      ];
    case "email":
      return [{ id: "emTo", msg: isValidEmail(trimmed(values.to)) ? null : "Please enter a valid email address." }];
    case "review": {
      const v = trimmed(values.reviewUrl);
      return [{ id: "rvUrl", msg: v && v !== "https://" && isValidUrl(v) ? null : "Please enter a valid review link." }];
    }
    case "sms":
      return [
        {
          id: "smsNum",
          msg: mobileNumberOk(values.phone, values.phoneCountry)
            ? null
            : "Please enter a valid mobile number (without the country code).",
        },
      ];
    default:
      return [];
  }
}

/* ---- Google Maps ----------------------------------------------------------- */

const pinGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/** A suggestion row: a place's name and the line under it. */
export type Place = { name: string; address: string; placeId?: string };

const TYPED = "Use this address";

/** What was typed, offered as the place to use when Google has nothing. */
const typed = (q: string): Place[] => (q.trim() ? [{ name: q.trim(), address: TYPED }] : []);

/**
 * Suggestions from Google Places (JB, 2026-10-21), through /api/places so
 * the key stays server-side. Waits for three characters and a 250ms pause in
 * typing; one session token per search, dropped once a place is picked, so
 * Google bills the whole search as the single Details call that ends it.
 *
 * Falls back to offering what was typed when Places is not configured, is
 * down, or finds nothing — the picker never dead-ends.
 */
function usePlaceSuggestions(q: string, active: boolean) {
  const [found, setFound] = useState<{ q: string; list: Place[] } | null>(null);
  const token = useRef<string | null>(null);

  useEffect(() => {
    const t = q.trim();
    if (!active || t.length < 3) return;
    const timer = setTimeout(async () => {
      token.current ??= crypto.randomUUID();
      try {
        const res = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "autocomplete", input: t, sessionToken: token.current }),
        });
        const data = res.ok ? ((await res.json()) as { suggestions: Place[] }) : null;
        setFound({ q: t, list: data?.suggestions ?? [] });
      } catch {
        setFound({ q: t, list: [] });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q, active]);

  const t = q.trim();
  // Google's list for this exact text if it has one; otherwise the typed
  // fallback — shown at once, so short or unmatched input is never stuck.
  const list = found && found.q === t && found.list.length ? found.list : typed(q);

  /** Ends the session: the Details call is what Google bills it as. */
  const confirm = (placeId: string) => {
    const sessionToken = token.current;
    token.current = null;
    if (!sessionToken) return;
    void fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "details", placeId, sessionToken }),
    }).catch(() => {});
  };

  return { list, confirm };
}

/** "Name, rest of the address" → the map card's two lines. */
export function splitPlace(text: string): Place {
  const t = text.trim();
  const i = t.indexOf(",");
  return i > 0 ? { name: t.slice(0, i).trim(), address: t.slice(i + 1).trim() } : { name: t, address: "" };
}

export function MapsForm({ s }: { s: FormState }) {
  const q = s.values.address ?? "";
  const picked = s.values.addressPicked === "1" && !!q.trim();
  const [listOpen, setListOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const err = s.errors.gmReq;
  const places = usePlaceSuggestions(q, !picked);
  const list = picked ? [] : places.list;

  // Their script closes the list on any tap outside the search and list.
  useEffect(() => {
    if (!listOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setListOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [listOpen]);

  const pick = (p: Place) => {
    s.patch((cur) => ({
      ...cur,
      address: p.address && p.address !== TYPED ? `${p.name}, ${p.address}` : p.name,
      addressPicked: "1",
      // Google's id for the exact place, so the code opens that listing —
      // not whatever a text search for the address finds first.
      placeId: p.placeId ?? "",
    }));
    if (p.placeId) places.confirm(p.placeId);
    setListOpen(false);
  };

  return (
    <div ref={wrap}>
      <Fld
        id="gmQ"
        label="Enter a location or address"
        required
        tip={{ label: "About your location", text: "The place that opens in Google Maps when scanned." }}
      >
        {/* Their `.srchWrp`. */}
        <span className="relative block">
          <span className="pointer-events-none absolute top-0 left-0 z-[2] flex h-[43.7px] w-[24.3px] items-center justify-center text-faint [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            id="gmQ"
            value={q}
            placeholder="Search for an address or business"
            autoComplete="off"
            aria-invalid={!!err}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={listOpen && list.length > 0}
            aria-controls="gmSug"
            onFocus={() => setListOpen(true)}
            onChange={(e) => {
              setListOpen(true);
              s.patch((cur) => ({ ...cur, address: e.target.value, addressPicked: "", placeId: "" }));
            }}
            className={`${textInput(!!err)} pr-[44.8px] pl-[46.4px]`}
          />
          {picked && (
            <a
              href="#"
              aria-label="Clear location"
              onClick={(e) => {
                e.preventDefault();
                s.patch((cur) => ({ ...cur, address: "", addressPicked: "", placeId: "" }));
              }}
              className="absolute top-0 right-0 z-[2] flex h-[43.7px] w-[23.5px] items-center justify-center text-faint [&>svg]:block [&>svg]:h-[11.4px] [&>svg]:w-[11.4px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </a>
          )}
        </span>
      </Fld>
      {/* Their `.okSel`. */}
      {picked && (
        <div className="mt-[6.5px] flex items-center gap-[4.1px] text-mc-ok [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="text-[10.55px] leading-[normal] font-semibold">Location selected</span>
        </div>
      )}
      {/* Their `.sugLst`. */}
      {listOpen && list.length > 0 && (
        <ul id="gmSug" role="listbox" className="mt-[8.1px] overflow-hidden rounded-[9.7px] border border-mc-acc-line bg-white shadow-mc-sug">
          {list.map((p, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              tabIndex={0}
              onClick={() => pick(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  pick(p);
                }
              }}
              className="flex cursor-pointer items-center px-[9.7px] py-[8.1px] hover:bg-mc-tile [&+&]:border-t [&+&]:border-mc-sug-line"
            >
              <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-mc-sug-pin text-ink [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]">
                {pinGlyph}
              </span>
              <span className="min-w-0 flex-1 pl-[8.1px]">
                <span className="block truncate text-[10.95px] leading-[normal] font-semibold text-ink">{p.name}</span>
                <span className="mt-[1.5px] block truncate text-[9.73px] leading-[normal] text-muted">{p.address}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-[3px] text-[10.14px] leading-[normal] text-muted">
        Start typing to see suggestions. Select a location to confirm.
      </p>
      {err && <FieldError>{err}</FieldError>}
    </div>
  );
}

/* ---- Email ----------------------------------------------------------------- */

export function EmailForm({ s }: { s: FormState }) {
  return (
    <>
      <TextFld
        s={s}
        id="emTo"
        k="to"
        type="email"
        label="To"
        placeholder="email@example.com"
        required
        tip={{ label: "About the recipient", text: "The address that receives the email when scanned." }}
      />
      <TextFld
        s={s}
        id="emSubj"
        k="subject"
        label="Subject"
        placeholder="e.g. Product Inquiry"
        max={80}
        tip={{ label: "About the subject", text: "A preset subject line. Optional; the scanner can change it." }}
      />
      <TipTextArea
        s={s}
        id="emBody"
        k="body"
        label="Body"
        placeholder="Write your message…"
        max={500}
        tip={{ label: "About the message", text: "A pre-written message. Optional; the scanner can edit it." }}
      />
    </>
  );
}

/** A textarea with an ⓘ, which TextAreaFld does not take. */
function TipTextArea({
  s,
  id,
  k,
  label,
  placeholder,
  max,
  tip,
}: {
  s: FormState;
  id: string;
  k: string;
  label: string;
  placeholder: string;
  max: number;
  tip: { label: string; text: string };
}) {
  const value = s.values[k] ?? "";
  return (
    <Fld id={id} label={label} tip={tip} counter={<Counter value={value} max={max} />}>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        maxLength={max}
        onChange={(e) => s.set(k, e.target.value)}
        className={`${textArea(false)} resize-y`}
      />
    </Fld>
  );
}

/* ---- Google Review --------------------------------------------------------- */

export function ReviewForm({ s }: { s: FormState }) {
  const [help, setHelp] = useState(false);
  return (
    <>
      <TrackingPill />
      <TextFld
        s={s}
        id="rvUrl"
        k="reviewUrl"
        label="Enter your Google review link"
        placeholder="https://"
        required
        url
        tip={{ label: "About your review link", text: "Paste the review link from your Google Business Profile." }}
      />
      {/* Their `.hlpLnk` + `.hlpBox`. */}
      <a
        href="#"
        aria-expanded={help}
        onClick={(e) => {
          e.preventDefault();
          setHelp(!help);
        }}
        className="mt-[7.3px] inline-flex items-center gap-[5.3px] text-[10.55px] leading-[normal] font-semibold text-primary [&>svg]:block [&>svg]:h-[12.7px] [&>svg]:w-[12.7px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        Where do I find my review link?
      </a>
      <Slide open={help} duration="duration-[200ms]">
        <div className="mt-[7.3px] rounded-[9.7px] border border-mc-card-line bg-mc-tile px-[9.7px] py-[8.9px]">
          <HelpLine>
            <b>1.</b> Sign in to your <b>Google Business Profile</b> (business.google.com) with the account that manages your business.
          </HelpLine>
          <HelpLine>
            <b>2.</b> Open your profile and tap <b>Ask for reviews</b> (or <b>Share profile</b>).
          </HelpLine>
          <HelpLine>
            <b>3.</b> Copy the short review link (it looks like <b>g.page/r/…</b>) and paste it above.
          </HelpLine>
        </div>
      </Slide>
    </>
  );
}

function HelpLine({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10.55px] leading-[16.9px] text-prose [&+&]:mt-[6.3px] [&_b]:text-ink">{children}</p>
  );
}

/* ---- SMS ------------------------------------------------------------------- */

export function SmsForm({ s }: { s: FormState }) {
  return (
    <>
      <IntlNumberFld
        s={s}
        ccId="smsCc"
        numId="smsNum"
        label="Phone number"
        tip={{ label: "About the phone number", text: "The number people text after scanning." }}
      />
      <TipTextArea
        s={s}
        id="smsMsg"
        k="message"
        label="Pre-filled SMS"
        placeholder="Type your message here…"
        max={160}
        tip={{ label: "About the pre-filled SMS", text: "Pre-filled message text. The scanner can edit it before sending." }}
      />
    </>
  );
}
