"use client";

import { encodeQr } from "../encodeQr";
import { errorCopy } from "../validate";
import { useEffect, useState } from "react";
import { fileSrc, parseStoredFile } from "../storedValues";
import { useFileUpload } from "../useFileUpload";
import { Counter, Fld, FieldError, Label, TrackingPill, textArea, textInput } from "./ui";
import {
  IntlNumberFld,
  TextFld,
  mobileNumberOk,
  schemaField,
  trimmed,
  uploadGlyph,
  urlHandlers,
  urlOk, dropFiles } from "./fields";
import type { Check, FormState, Values } from "./fields";
import { infoGlyph } from "./forms2";
import { sizeTxt } from "./forms3";

/**
 * Batch 5 of the mobile forms: create_mobile_phone / _plaintext / _payment /
 * _audio.html (Monday 5650333076), on the established pieces.
 */

/**
 * The most Plain Text can put in a code and still have it draw. Q-level
 * codes hold 1,663 bytes and our 1024px download decodes at every length up
 * to that — but the paywall's 165px preview runs out of pixels per module
 * past about 1,150 bytes (blank at 1,590), and a code that dense scans badly
 * once printed anyway. Measured 2026-10-21; 1,100 leaves a margin. The field
 * takes 1,000 characters (JB, 2026-10-22; the file says 2,000), and the byte
 * check still catches emoji and accents, which take 2–4 bytes each.
 */
export const QR_TEXT_MAX_BYTES = 1100;

const httpsOk = (v: string) => /^https:\/\//i.test(v) && urlOk(v);

/* ---- Validation ------------------------------------------------------------ */

export function checksForBatch5(type: string, values: Values): Check[] {
  switch (type) {
    case "phone":
      return [
        {
          id: "telNum",
          msg: mobileNumberOk(values.phone, values.phoneCountry)
            ? null
            : "Please enter a valid phone number (without the country code).",
        },
      ];
    case "text": {
      const text = trimmed(values.text);
      const bytes = new TextEncoder().encode(encodeQr("text", values)).length;
      return [
        {
          id: "txMsg",
          msg: !text
            ? "Please enter your text."
            : bytes > QR_TEXT_MAX_BYTES
              ? errorCopy.tooLong
              : null,
        },
      ];
    }
    case "payment":
      return [
        { id: "paySel", msg: trimmed(values.provider) ? null : "Please select a payment provider." },
        { id: "payLink", msg: httpsOk(trimmed(values.paymentLink)) ? null : "Please enter a valid https:// payment link." },
        // 2026-10-29: a link on another provider's site is refused — PayPal
        // picked, a Stripe link pasted. Providers with no known hosts pass.
        { id: "payLink", key: "payMis", msg: providerMatches(values) ? null : "This link does not match the selected provider." },
      ];
    case "mp3":
      return [{ id: "auUpl", msg: parseStoredFile(values.file) ? null : "Please upload an audio file." }];
    default:
      return [];
  }
}

/* ---- Phone ----------------------------------------------------------------- */

/**
 * The WhatsApp/SMS country picker and number (JB: reuse it), with the file's
 * own placeholder and the hint under the number. A scan opens the dialer
 * with the number filled in — `tel:` never places the call by itself.
 */
export function PhoneForm({ s }: { s: FormState }) {
  return (
    <IntlNumberFld
      s={s}
      ccId="telCc"
      numId="telNum"
      label="Phone number"
      placeholder="555 555 0123"
      hint="Enter a valid phone number, including area code."
      tip={{ label: "About the phone number", text: "The number people call after scanning." }}
    />
  );
}

/* ---- Plain Text ------------------------------------------------------------ */

export function PlainTextForm({ s }: { s: FormState }) {
  const value = s.values.text ?? "";
  const err = s.errors.txMsg;
  return (
    <>
      <Fld id="txMsg" label="Text" required error={err} counter={<Counter value={value} max={1000} />}>
        <textarea
          id="txMsg"
          name="txMsg"
          value={value}
          placeholder="Enter your message here…"
          maxLength={1000}
          aria-invalid={!!err}
          onChange={(e) => s.set("text", e.target.value)}
          className={`${textArea(!!err)} resize-y`}
        />
      </Fld>
      <TextFld
        s={s}
        id="txTitle"
        k="title"
        label="Title (optional)"
        placeholder="e.g. Workshop Information"
        max={40}
        counter
      />
    </>
  );
}

/* ---- Payment --------------------------------------------------------------- */

/** Their `crPayProv`: name, chip colour, and the hosts that identify it. */
export const payProviders: Record<string, { n: string; c: string; d: string[] }> = {
  paypal: { n: "PayPal", c: "#003087", d: ["paypal.com", "paypal.me"] },
  stripe: { n: "Stripe", c: "#635bff", d: ["stripe.com"] },
  cashapp: { n: "CashApp", c: "#00d632", d: ["cash.app"] },
  braintree: { n: "Braintree", c: "#0e1311", d: ["braintreepayments.com"] },
  square: { n: "Square", c: "#0e1311", d: ["square.link", "squareup.com"] },
  payoneer: { n: "Payoneer", c: "#ff4800", d: ["payoneer.com"] },
  venmo: { n: "Venmo", c: "#008cff", d: ["venmo.com"] },
  verifone: { n: "Verifone (2Checkout)", c: "#00a3e0", d: ["2checkout.com", "2co.com"] },
  applepay: { n: "Apple Pay", c: "#0e1311", d: [] },
  googlepay: { n: "Google Pay", c: "#4285f4", d: [] },
  adyen: { n: "Adyen", c: "#0abf53", d: ["adyen.com"] },
  klarna: { n: "Klarna", c: "#e96f8f", d: ["klarna.com"] },
  cartesbancaires: { n: "Cartes Bancaires", c: "#083969", d: [] },
  giropay: { n: "Giropay", c: "#000268", d: ["giropay.de"] },
  other: { n: "Other provider", c: "#6b7280", d: [] },
};

/**
 * Desktop's example per provider (fieldSchema `placeholderFrom`), kept on
 * mobile at JB's "do not remove desktop functionality"; anything else shows
 * the file's own example, which is also desktop's fallback.
 */
const payPlaceholders: Record<string, string> = {
  paypal: "e.g. https://paypal.me/yourname",
  cashapp: "e.g. https://cash.app/$yourname",
  venmo: "e.g. https://venmo.com/u/yourname",
  stripe: "e.g. https://buy.stripe.com/…",
};

/** The link's host belongs to the picked provider, where we know its hosts. */
function providerMatches(values: Values) {
  const p = payProviders[values.provider ?? ""];
  const host = ((values.paymentLink ?? "").trim().match(/^https?:\/\/([^/?#]+)/i) ?? [])[1]?.toLowerCase();
  if (!p || values.provider === "other" || !host || !p.d.length) return true;
  return p.d.some((d) => host.includes(d));
}

/** Their script: a recognised host switches the provider to match. */
function detectProvider(link: string) {
  const host = (link.match(/^https?:\/\/([^/?#]+)/i) ?? [])[1]?.toLowerCase();
  if (!host) return null;
  for (const [k, p] of Object.entries(payProviders)) {
    if (p.d.some((d) => host.includes(d))) return k;
  }
  return null;
}

export function PaymentForm({ s }: { s: FormState }) {
  const provider = s.values.provider ?? "";
  const link = s.values.paymentLink ?? "";
  const selErr = s.errors.paySel;
  const linkErr = s.errors.payLink ?? s.errors.payMis;
  const setLink = (v: string) =>
    s.patch((cur) => {
      const found = detectProvider(v.trim());
      return { ...cur, paymentLink: v, ...(found && found !== cur.provider ? { provider: found } : null) };
    });

  return (
    <>
      <TrackingPill />
      <Fld
        id="paySel"
        label="Payment provider"
        required
        error={selErr}
        tip={{ label: "About the provider", text: "The payment service you use to collect money." }}
      >
        <select
          id="paySel"
          name="paySel"
          value={provider}
          aria-invalid={!!selErr}
          onChange={(e) => s.set("provider", e.target.value)}
          className={`${textInput(!!selErr)} cursor-pointer appearance-none pr-[12.8px] pl-[13px]`}
        >
          <option value="">Select a payment provider…</option>
          {Object.entries(payProviders).map(([k, p]) => (
            <option key={k} value={k}>
              {p.n}
            </option>
          ))}
        </select>
      </Fld>
      <Fld
        id="payLink"
        label="Payment link"
        required
        error={linkErr}
        tip={{ label: "About the payment link", text: "Paste your payment link. Payments are completed on your provider’s page." }}
      >
        <input
          type="text"
          id="payLink"
          name="payLink"
          value={link}
          placeholder={payPlaceholders[provider] ?? "e.g. https://yourdomain.com/checkout"}
          aria-invalid={!!linkErr}
          className={textInput(!!linkErr)}
          {...urlHandlers(link, setLink)}
        />
      </Fld>
      {/* Their `.nte.blu`. */}
      <div className="mt-[8.9px] flex items-start rounded-[9.7px] border border-mc-note-line bg-mc-note px-[10.5px] py-[9.7px]">
        {infoGlyph}
        <p className="pl-[8.1px] text-[10.95px] leading-[16.97px] font-medium text-prose">
          Payments are completed on your provider’s website.
        </p>
      </div>
    </>
  );
}

/* ---- Audio ----------------------------------------------------------------- */

/** "m:ss" of an audio file, read from its metadata; "" until known. */
function useDuration(src: string | undefined) {
  const [found, setFound] = useState<{ src: string; text: string } | null>(null);
  useEffect(() => {
    if (!src) return;
    const a = new Audio();
    a.preload = "metadata";
    const done = () => {
      if (!isFinite(a.duration)) return;
      const t = Math.round(a.duration);
      setFound({ src, text: `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}` });
    };
    a.addEventListener("loadedmetadata", done);
    a.src = src;
    return () => {
      a.removeEventListener("loadedmetadata", done);
      a.src = "";
    };
  }, [src]);
  return found && found.src === src ? found.text : "";
}

/** One file, 20 MB at most (the schema's limit, which the upload route enforces too). */
export function AudioForm({ s }: { s: FormState }) {
  const { take, clear, error, progress, pending, stored } = useFileUpload({
    type: "mp3",
    field: schemaField("mp3", "file"),
    value: s.values.file ?? "",
    onChange: (v) => s.set("file", v),
    messages: {
      type: "Please choose an audio file (MP3, M4A, WAV, etc.).",
      size: "That file is too large (max 20 MB).",
    },
  });
  const shown = pending ?? stored;
  const err = error ?? s.errors.auUpl;
  // Their file card adds the length once it is known: "3.2 MB · 1:04".
  const length = useDuration(stored ? fileSrc(stored) : undefined);

  return (
    <>
      <TrackingPill />
      <div className="mt-[12.2px]">
        <div>
          <Label required>Audio</Label>
        </div>
        <label
          id="auUpl"
          tabIndex={-1}
          {...dropFiles(([f]) => take(f))}
          className="relative mt-[12.2px] block cursor-pointer rounded-[9.7px] border-2 border-dashed border-mc-drop-line bg-mc-drop px-[11.4px] py-[16.2px] text-center outline-none [&>svg]:text-primary"
        >
          {uploadGlyph}
          <span className="mt-[7.9px] block text-[11.36px] leading-[normal] font-semibold text-body">
            <b className="font-semibold text-primary">{progress !== null ? `Uploading… ${progress}%` : "Upload your audio"}</b>
          </span>
          <span className="mt-[3.4px] block text-[9.73px] leading-[normal] text-faint">
            Click to upload or drag &amp; drop · Max size: 20 MB · MP3, M4A, WAV, etc.
          </span>
          <input
            type="file"
            id="auFile"
            name="auFile"
            accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.flac,.aiff"
            className="absolute top-0 left-0 h-px w-px border-0 opacity-0"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = "";
              if (file) take(file);
            }}
          />
        </label>
        {/* Their `.fileCrd`. Picking another file replaces this one. */}
        {shown && (
          <div className="mt-[9.7px] flex items-center rounded-[9.7px] border border-mc-card-line bg-mc-tile px-[8.9px] py-[8.1px]">
            <span className="block h-[29.2px] w-[29.2px] shrink-0 overflow-hidden rounded-[7.3px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/create/audio.svg" alt="" className="h-full w-full" />
            </span>
            <span className="min-w-0 flex-1 px-[7.3px]">
              <span className="block truncate text-[10.95px] leading-[normal] font-semibold text-ink">{shown.name}</span>
              <span className="mt-[1.5px] block text-[9.73px] leading-[normal] text-muted">
                {sizeTxt(shown.size)}
                {length && !pending ? ` · ${length}` : ""}
              </span>
            </span>
            <a
              href="#"
              aria-label="Remove file"
              onClick={(e) => {
                e.preventDefault();
                clear();
              }}
              className="flex h-[21.1px] w-[21.1px] shrink-0 items-center justify-center rounded-full border border-mc-acc-line bg-white text-prose [&>svg]:block [&>svg]:h-[9.7px] [&>svg]:w-[9.7px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </a>
          </div>
        )}
        {err && <FieldError>{err}</FieldError>}
      </div>
      <TextFld s={s} id="auTitle" k="title" label="Title" placeholder="e.g. My Audio Recording" max={40} counter />
    </>
  );
}
