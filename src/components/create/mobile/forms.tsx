"use client";

import { useState } from "react";
import { parseLinks } from "../storedValues";
import type { StoredLink } from "../storedValues";
import { errorCopy, isValidEmail, isValidUrl, linkIssues } from "../validate";
import { UploadError, uploadLinkLogo } from "../uploadFile";
import {
  Acc,
  Fld,
  Label,
  Sep,
  TrackingPill,
  outlineBtn,
  textInput,
} from "./ui";
import { socialByKey, socials } from "./socials";

import {
  PhoneFld,
  TextAreaFld,
  TextFld,
  Upload,
  imageGlyph,
  schemaField,
  shareGlyph,
  trashGlyph,
  trimmed,
  urlHandlers,
  urlOk,
} from "./fields";
import type { Check, FormState, Values } from "./fields";
import { checksForBatch2 } from "./forms2";

export type { Check, FormState };
/**
 * The bodies of create_mobile_website / _vcard / _multilink.html.
 *
 * Every control writes to the same value keys the desktop form uses
 * (`firstName`, `links`, `facebook`…), so the encoder, the previews and the
 * validation all keep working, and nothing typed is lost if the window is
 * resized across the breakpoint. Ids are the designer's (`vcFirst`, `mlTitle`)
 * because Next's "first missing field" focus goes by id.
 */


/* ---- Validation ------------------------------------------------------------ */

/**
 * One thing Next checks. In the order the visitor meets them, so the first
 * failure is the one Next scrolls to.
 */


/** The designer's `data-req` fields, plus anything filled in malformed. */
export function checksFor(type: string, values: Values): Check[] {
  switch (type) {
    case "website":
      return [
        {
          id: "siteUrl",
          msg: urlOk(trimmed(values.url)) ? null : "Please enter a valid website URL.",
        },
      ];

    case "vcard": {
      const site = trimmed(values.website);
      const email = trimmed(values.email);
      return [
        { id: "vcFirst", acc: "personal", msg: trimmed(values.firstName) ? null : "Please enter your first name." },
        { id: "vcLast", acc: "personal", msg: trimmed(values.lastName) ? null : "Please enter your last name." },
        // Optional, but a malformed one would go into the card as written.
        { id: "vcWebsite", acc: "company", msg: !site || site === "https://" || isValidUrl(site) ? null : errorCopy.url },
        { id: "vcEmail", acc: "company", msg: !email || isValidEmail(email) ? null : errorCopy.email },
      ];
    }

    case "multilink": {
      // The shared rule (validate.ts `linkIssues`, same as desktop): a title
      // and at least one complete link. Empty spare rows are ignored; a
      // half-filled row is flagged where it is missing. With every row empty,
      // the first row is flagged so there is somewhere to start.
      const rows = linkRows(values);
      const { rows: issues, none } = linkIssues(rows);
      const allEmpty = none && issues.every((r) => !r.name && !r.url);
      return [
        { id: "mlTitle", msg: trimmed(values.title) ? null : "Please enter a title." },
        ...issues.flatMap((r, i): Check[] => {
          const flagEmpty = allEmpty && i === 0;
          return [
            { id: `lnkNme${i}`, acc: "links", msg: r.name || flagEmpty ? "Please enter a link name." : null },
            { id: `lnkUrl${i}`, acc: "links", msg: r.url || flagEmpty ? "Please enter a valid link URL." : null },
          ];
        }),
      ];
    }

    default:
      return checksForBatch2(type, values);
  }
}

/** The types create_mobile_*.html has designed and we have ported so far. */
export const mobileTypes = new Set([
  "website",
  "vcard",
  "multilink",
  "applink",
  "pdf",
  "image",
  "whatsapp",
  "social",
  "menu",
  "wifi",
  "video",
  "location",
  "email",
  "review",
  "sms",
  "phone",
  "text",
  "payment",
  "mp3",
]);


/* ---- Social platforms ------------------------------------------------------ */

const closeGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/**
 * Their `.socGrd` + `.socFlds`: tap a platform to switch it on and get its
 * field (focused, so the keyboard comes up); tap it again, or the ×, to switch
 * it off, which also clears what was typed for it.
 */
export function SocialPicker({
  s,
  idPrefix,
  order,
}: {
  s: FormState;
  idPrefix: string;
  /**
   * The platforms in a file's own order, where it differs from vCard's.
   * The first eight show; the rest wait behind "More Platforms".
   */
  order?: string[];
}) {
  const list = order
    ? order.map((k, i) => ({ ...socialByKey[k], extra: i >= 8 }))
    : socials;
  const toggle = (key: string) => {
    const on = s.socialsOn.includes(key);
    // Updater form: two taps inside one render must not overwrite each other.
    if (on) {
      s.setSocialsOn((cur) => cur.filter((k) => k !== key));
      s.set(key, "");
    } else {
      s.setSocialsOn((cur) => (cur.includes(key) ? cur : [...cur, key]));
      // After the field has rendered.
      requestAnimationFrame(() => document.getElementById(`${idPrefix}${key}`)?.focus());
    }
  };

  return (
    <>
      <ul className="mt-[11.4px] grid grid-cols-4 gap-[8.1px]">
        {list.map((p) => {
          const on = s.socialsOn.includes(p.key);
          if (p.extra && !s.moreSocials) return null;
          return (
            <li key={p.key}>
              <a
                href="#"
                role="button"
                aria-pressed={on}
                onClick={(e) => {
                  e.preventDefault();
                  toggle(p.key);
                }}
                className={`flex flex-col items-center rounded-[9.7px] border px-[3.2px] pt-[8.1px] pb-[7.3px] ${
                  on
                    ? "border-primary bg-mc-on shadow-[inset_0_0_0_1px_var(--color-primary)]"
                    : "border-mc-acc-line"
                }`}
              >
                <i
                  className="flex h-[27.6px] w-[27.6px] items-center justify-center rounded-[8.1px]"
                  style={{ background: p.color }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/create/soc/${p.key}.svg`} alt={p.name} className="block h-[15.4px] w-[15.4px]" />
                </i>
                <span className="mt-[5.4px] block max-w-full truncate text-[8.92px] leading-[normal] font-semibold text-body">
                  {p.name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href="#"
        aria-expanded={s.moreSocials}
        onClick={(e) => {
          e.preventDefault();
          s.setMoreSocials(!s.moreSocials);
        }}
        className="mt-[14.2px] flex items-center justify-center gap-[4.9px] text-[10.95px] leading-[normal] font-bold text-primary"
      >
        More Platforms
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`block h-[13.1px] w-[13.1px] transition-transform duration-[250ms] ease-out ${s.moreSocials ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
      <div>
        {list
          .filter((p) => s.socialsOn.includes(p.key))
          .map((p) => {
            const id = `${idPrefix}${p.key}`;
            const value = s.values[p.key] ?? "";
            const set = (v: string) => s.set(p.key, v);
            return (
              <div key={p.key} className="mt-[12.2px]">
                <div className="relative">
                  <div className="flex items-center">
                    <span
                      className="flex h-[19.5px] w-[19.5px] shrink-0 items-center justify-center rounded-[5.7px]"
                      style={{ background: p.color }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/create/soc/${p.key}.svg`} alt="" className="block h-[11.4px] w-[11.4px]" />
                    </span>
                    <Label htmlFor={id} className="ml-[7px]">
                      {p.name}
                    </Label>
                    <a
                      href="#"
                      aria-label={`Remove ${p.name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(p.key);
                      }}
                      className="ml-auto flex text-faint [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]"
                    >
                      {closeGlyph}
                    </a>
                  </div>
                  <input
                    type={p.tel ? "tel" : "text"}
                    id={id}
                    name={id}
                    value={value}
                    placeholder={p.placeholder}
                    className={textInput(false)}
                    {...(p.url
                      ? urlHandlers(value, set)
                      : { onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.value) })}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}





function SocialAcc({ s, idPrefix }: { s: FormState; idPrefix: string }) {
  return (
    <Acc
      icon={shareGlyph}
      title="Social media"
      desc="Add your social channels"
      open={s.isOpen("social")}
      onToggle={() => s.toggle("social")}
    >
      <SocialPicker s={s} idPrefix={idPrefix} />
    </Acc>
  );
}

/* ---- Website --------------------------------------------------------------- */

export function WebsiteForm({ s }: { s: FormState }) {
  return (
    <>
      <TrackingPill />
      <TextFld
        s={s}
        id="siteUrl"
        k="url"
        label="Enter your website"
        placeholder="https://"
        required
        url
        tip={{ label: "About your website link", text: "The link people open when they scan your code." }}
      />
    </>
  );
}

/* ---- vCard ----------------------------------------------------------------- */

export function VCardForm({ s }: { s: FormState }) {
  const mode = s.values.addressMode === "url" ? "url" : "manual";
  return (
    <>
      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 10h2" />
            <path d="M16 14h2" />
            <path d="M6.17 15a3 3 0 0 1 5.66 0" />
            <circle cx="9" cy="11" r="2" />
            <rect x="2" y="5" width="20" height="14" rx="2" />
          </svg>
        }
        title="Personal information"
        desc="Fill in your name"
        open={s.isOpen("personal")}
        onToggle={() => s.toggle("personal")}
      >
        <TrackingPill className="mt-[11.4px]" />
        <TextFld s={s} id="vcFirst" k="firstName" label="First name" placeholder="John" max={40} required counter />
        <TextFld s={s} id="vcLast" k="lastName" label="Last name" placeholder="Doe" max={40} required counter />
      </Acc>

      <Acc
        icon={imageGlyph}
        title="Profile picture"
        desc="Add a profile photo"
        open={s.isOpen("photo")}
        onToggle={() => s.toggle("photo")}
      >
        <Upload
          type="vcard"
          field={schemaField("vcard", "photo")}
          value={s.values.photo ?? ""}
          onChange={(v) => s.set("photo", v)}
          what="your photo"
          round
        />
      </Acc>

      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        }
        title="Contact details"
        desc="Phone, mobile and more"
        open={s.isOpen("contact")}
        onToggle={() => s.toggle("contact")}
      >
        <PhoneFld s={s} id="vcPhone" k="phone" label="Phone" />
        <PhoneFld s={s} id="vcMobile" k="mobile" label="Mobile" />
        <PhoneFld s={s} id="vcWork" k="work" label="Work" />
        <PhoneFld s={s} id="vcFax" k="fax" label="Fax" />
      </Acc>

      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
          </svg>
        }
        title="Company information"
        desc="Where you work"
        open={s.isOpen("company")}
        onToggle={() => s.toggle("company")}
      >
        <TextFld s={s} id="vcOrg" k="organization" label="Organization" placeholder="Acme Inc." max={40} />
        <TextFld s={s} id="vcRole" k="jobTitle" label="Job title" placeholder="Software Engineer" max={40} />
        <TextFld s={s} id="vcWebsite" k="website" label="Website" placeholder="https://example.com" max={40} url />
        <TextFld s={s} id="vcEmail" k="email" label="Email" type="email" placeholder="john.doe@example.com" max={40} />
        <TextAreaFld s={s} id="vcSummary" k="summary" label="Summary" placeholder="e.g. About my company" max={200} />
      </Acc>

      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        }
        title="Address"
        desc="Your location"
        open={s.isOpen("address")}
        onToggle={() => s.toggle("address")}
      >
        {/* Their `.seg`. */}
        <div className="mt-[12.2px] flex rounded-[8.1px] bg-mc-well p-[2.8px]">
          {(["manual", "url"] as const).map((m) => (
            <a
              key={m}
              href="#"
              role="button"
              aria-pressed={mode === m}
              onClick={(e) => {
                e.preventDefault();
                s.set("addressMode", m);
              }}
              className={`flex-1 rounded-[6.1px] py-[6.6px] text-center text-[10.95px] leading-[normal] font-semibold ${
                mode === m ? "bg-white text-ink shadow-mc-tick" : "text-muted"
              }`}
            >
              {m === "manual" ? "Manual" : "URL"}
            </a>
          ))}
        </div>
        {mode === "manual" ? (
          <div>
            <TextFld s={s} id="vcStreet" k="street" label="Street" placeholder="123 Main Street" max={40} />
            <TextFld s={s} id="vcZip" k="zip" label="ZIP" placeholder="10001" max={40} />
            <TextFld s={s} id="vcCity" k="city" label="City" placeholder="New York" max={40} />
            <TextFld s={s} id="vcState" k="state" label="State" placeholder="NY" max={40} />
            <TextFld s={s} id="vcCountry" k="country" label="Country" placeholder="United States" max={40} />
          </div>
        ) : (
          <div>
            <TextFld s={s} id="vcAdrUrl" k="addressUrl" label="Address link" placeholder="https://maps.google.com/…" url />
          </div>
        )}
      </Acc>

      <SocialAcc s={s} idPrefix="vcSoc" />
    </>
  );
}

/* ---- Multi-Link ------------------------------------------------------------ */

const emptyLink: StoredLink = { name: "", url: "" };

/** The rows as the form shows them: never fewer than one. */
export function linkRows(values: Values): StoredLink[] {
  const rows = parseLinks(values.links ?? "");
  return rows.length ? rows : [emptyLink];
}

/**
 * One row's optional logo — JB, 2026-10-15: keep desktop's per-link logos on
 * mobile. Unmocked; kept to a single line so a row is no taller until a logo
 * is actually added: the upload-box glyph as a small tile, "Add logo
 * (optional)", and once there, the thumbnail with "Remove".
 */
function LinkLogo({
  s,
  i,
  logo,
  type,
}: {
  s: FormState;
  i: number;
  logo?: string;
  type: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLogo = (url: string | undefined) =>
    // Against the latest rows: typing may have happened while uploading.
    s.update("links", (cur) =>
      JSON.stringify(
        linkRows({ links: cur }).map((l, j) => (j === i ? { ...l, logo: url } : l)),
      ),
    );

  return (
    <div className="mt-[12.2px]">
      <div className="flex items-center gap-[8.1px]">
        <label className="relative flex h-[35.7px] w-[35.7px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[8.1px] border border-dashed border-mc-input-line bg-white text-faint [&>svg]:h-[16.2px] [&>svg]:w-[16.2px]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-full w-full object-cover" />
          ) : (
            imageGlyph
          )}
          <input
            type="file"
            accept="image/*"
            aria-label={`Logo for link ${i + 1}`}
            className="absolute top-0 left-0 h-px w-px border-0 opacity-0"
            onChange={async (e) => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = "";
              if (!file) return;
              setError(null);
              setBusy(true);
              try {
                setLogo(await uploadLinkLogo(type, file));
              } catch (err) {
                setError(err instanceof UploadError ? err.message : "That logo could not be uploaded.");
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        <span className="text-[10.95px] leading-[normal] font-semibold text-body">
          {busy ? "Uploading…" : logo ? "Logo" : "Add logo (optional)"}
        </span>
        {logo && !busy && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setLogo(undefined);
            }}
            className="ml-auto flex items-center gap-[4.7px] text-[10.55px] leading-[normal] font-semibold text-mc-error [&>svg]:block [&>svg]:h-[12.7px] [&>svg]:w-[12.7px]"
          >
            {trashGlyph}
            Remove
          </a>
        )}
      </div>
      {error && (
        <small className="mt-[5.1px] block text-[10.14px] leading-[normal] text-mc-error">{error}</small>
      )}
    </div>
  );
}

const ctlBtn =
  "flex h-[24.3px] w-[24.3px] items-center justify-center rounded-[6.5px] hover:bg-mc-well [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]";

/**
 * Their `.lnkLst`: numbered rows, each a name and a URL, reorderable and
 * removable — the controls hide while there is only one row, which is how
 * "at least one link" is kept without a separate rule.
 */
export function LinkList({
  s,
  type = "multilink",
  optional = false,
}: {
  s: FormState;
  /** Whose upload limits the logos answer to. */
  type?: string;
  /** Social Media's links: nothing required, so no stars. */
  optional?: boolean;
}) {
  const rows = linkRows(s.values);
  const write = (next: StoredLink[]) => s.set("links", JSON.stringify(next));
  const update = (i: number, patch: Partial<StoredLink>) =>
    write(rows.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    write(next);
  };

  return (
    <>
      <div>
        {rows.map((row, i) => {
          const nameErr = s.errors[`lnkNme${i}`];
          const urlErr = s.errors[`lnkUrl${i}`];
          return (
            <div
              key={i}
              className="mt-[11.4px] rounded-[9.7px] border border-mc-card-line bg-mc-row px-[9.7px] pt-[1.6px] pb-[12.2px]"
            >
              <div className="mt-[9.7px] flex items-center justify-between">
                <span className="text-[11.76px] leading-[normal] font-bold text-ink">Link {i + 1}</span>
                {rows.length > 1 && (
                  <span className="flex items-center gap-[2.4px] text-muted">
                    <a href="#" aria-label="Move link up" className={ctlBtn} onClick={(e) => { e.preventDefault(); move(i, -1); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 7-7 7 7" />
                        <path d="M12 19V5" />
                      </svg>
                    </a>
                    <a href="#" aria-label="Move link down" className={ctlBtn} onClick={(e) => { e.preventDefault(); move(i, 1); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    </a>
                    <a href="#" aria-label="Remove link" className={`${ctlBtn} text-mc-error`} onClick={(e) => { e.preventDefault(); write(rows.filter((_, j) => j !== i)); }}>
                      {trashGlyph}
                    </a>
                  </span>
                )}
              </div>
              <Fld id={`lnkNme${i}`} label="Link name" required={!optional} error={nameErr}>
                <input
                  type="text"
                  id={`lnkNme${i}`}
                  value={row.name}
                  placeholder="e.g. Our Menu"
                  maxLength={40}
                  aria-invalid={!!nameErr}
                  onChange={(e) => update(i, { name: e.target.value })}
                  className={textInput(!!nameErr)}
                />
              </Fld>
              <Fld id={`lnkUrl${i}`} label="Link URL" required={!optional} error={urlErr}>
                <input
                  type="text"
                  id={`lnkUrl${i}`}
                  value={row.url}
                  placeholder="https://example.com"
                  aria-invalid={!!urlErr}
                  className={textInput(!!urlErr)}
                  {...urlHandlers(row.url, (v) => update(i, { url: v }))}
                />
              </Fld>
              <LinkLogo s={s} i={i} logo={row.logo} type={type} />
            </div>
          );
        })}
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          write([...rows, emptyLink]);
          requestAnimationFrame(() => document.getElementById(`lnkNme${rows.length}`)?.focus());
        }}
        className={`${outlineBtn} mt-[18.2px] flex h-[35.1px] w-full gap-[6.5px] [&>svg]:h-[14.3px] [&>svg]:w-[14.3px]`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Another Link
      </a>
    </>
  );
}

export function MultiLinkForm({ s }: { s: FormState }) {
  return (
    <>
      <TrackingPill />
      <TextFld
        s={s}
        id="mlTitle"
        k="title"
        label="Title"
        placeholder="e.g. My Business"
        max={40}
        required
        counter
      />

      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        }
        title="Your Links"
        desc="Add your custom links below"
        open={s.isOpen("links")}
        onToggle={() => s.toggle("links")}
      >
        <LinkList s={s} />
      </Acc>

      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        }
        title="Description"
        desc="Tell visitors about your page"
        open={s.isOpen("desc")}
        onToggle={() => s.toggle("desc")}
      >
        <TextAreaFld s={s} id="mlDesc" k="description" label="Description" placeholder="e.g. About my business" max={200} />
      </Acc>

      <Acc
        icon={imageGlyph}
        title="Cover image"
        desc="Upload a cover image"
        open={s.isOpen("cover")}
        onToggle={() => s.toggle("cover")}
      >
        <Upload
          type="multilink"
          field={schemaField("multilink", "image")}
          value={s.values.image ?? ""}
          onChange={(v) => s.set("image", v)}
          what="your cover image"
        />
      </Acc>

      <SocialAcc s={s} idPrefix="mlSoc" />
    </>
  );
}

/** Which accordion each form opens first. */
export const initiallyOpen: Record<string, string[]> = {
  website: [],
  vcard: ["personal"],
  // JB: "Your Links" open by default, so links can be typed straight away.
  multilink: ["links"],
  // create_mobile_menu.html opens "Menu Items".
  menu: ["items"],
};

export { Sep };
