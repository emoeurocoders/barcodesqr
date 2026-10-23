"use client";

import type { ReactNode } from "react";
import { Caret, Slide } from "./ui";
import { socialByKey } from "./socials";
import { cropStyle, fileSrc, filledLinks, linkCaption, parseStoredFile } from "../storedValues";
import { dialCodes } from "../fieldSchema";
import { isValidUrl } from "../validate";
import { filledSocials, socialHref, usePageMode } from "./pageMode";

/**
 * "Your … Preview" — the collapsible card above each create_mobile_*.html
 * form (their `.pvwCmp`). Collapsed it is one bar; expanded it shows a phone
 * rendering of the page the code opens, with the designer's sample content
 * standing in for anything not typed yet.
 *
 * Their `.pvwCmp` runs at 2.08vw (8.11px at 390); every size below is that
 * em converted.
 */

type Values = Record<string, string>;

export const chevronRight = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const imageGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const qrGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </svg>
);

const shareGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

/** Their `.phn .chip`: the frosted square floated over a cover. */
export function Chip({ round, className, children }: { round?: boolean; className: string; children: ReactNode }) {
  return (
    <span
      className={`absolute flex h-[21.9px] w-[21.9px] items-center justify-center bg-white/88 shadow-mc-chip [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px] ${
        round ? "rounded-full" : "rounded-[6.5px]"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** Their `.phn`: the phone-shaped card the expanded preview draws in. */
export function Phone({ className = "", children }: { className?: string; children: ReactNode }) {
  // As a hosted page the phone IS the screen: no frame.
  if (usePageMode()) {
    return <div className={`relative min-h-[var(--qh)] max-w-[243.4px] overflow-hidden bg-white ${className}`}>{children}</div>;
  }
  return (
    <div
      className={`relative mx-auto mt-[4.1px] max-w-[243.4px] overflow-hidden rounded-[17.8px] border border-mc-pv-line bg-white shadow-mc-phone ${className}`}
    >
      {children}
    </div>
  );
}

/** Their `.smp`: the grey caption under the phone. */
export function Sample({ children }: { children: ReactNode }) {
  // Not on a hosted page.
  if (usePageMode()) return null;
  return (
    <p className="mt-[12.2px] text-center text-[10.14px] leading-[normal] text-faint">
      {children}
    </p>
  );
}

/** The bar's two subtitles: one while collapsed, "Tap to collapse" while open. */
function BarSub({ open, base, className }: { open: boolean; base: string; className: string }) {
  return <span className={`block text-muted ${className}`}>{open ? "Tap to collapse" : base}</span>;
}

/* ---- Website --------------------------------------------------------------- */

/** One skeleton line of the stand-in page. */
const Bar = ({ w, className = "" }: { w: string; className?: string }) => (
  <i className={`block h-[4.9px] rounded-full bg-mc-pv-skel ${className}`} style={{ width: w }} />
);

const ph =
  "flex items-center justify-center rounded-[8.1px] bg-mc-well text-mc-pv-ph [&>svg]:block [&>svg]:h-[16.2px] [&>svg]:w-[16.2px]";

export function WebsitePreview({
  values,
  open,
  onToggle,
}: {
  values: Values;
  open: boolean;
  onToggle: () => void;
}) {
  const url = (values.url ?? "").trim();
  // Their `.pvwSite.has`: the sample site swaps in once the address is real.
  const has = isValidUrl(url) && url !== "https://";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <i className="flex h-[35.7px] w-[35.7px] shrink-0 items-center justify-center rounded-full bg-mc-soft text-primary not-italic">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-[17.8px] w-[17.8px]">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </i>
          <BarText open={open} title="Your Website Preview" base="See how your QR code looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <div className="relative mx-auto mt-[4.1px] overflow-hidden rounded-[13px] border border-mc-pv-line bg-white shadow-mc-phone">
        <div className="bg-white px-[9.7px] pt-[9.7px]">
          <span className="flex items-center rounded-full bg-mc-well px-[10.5px] py-[6.5px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-[11.4px] w-[11.4px] shrink-0 text-prose">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="ml-[6.8px] block min-w-0 truncate text-[9.73px] leading-[normal] font-semibold text-body">
              {has ? url : "https://www.yourwebsite.com"}
            </span>
          </span>
        </div>
        {has ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/previews/site.jpg" alt="" className="mt-[9.7px] block w-full" />
        ) : (
          <div className="px-[10.5px] pt-[12.2px] pb-[13.8px]">
            <div className="flex items-center justify-between [&>svg]:block [&>svg]:h-[10.5px] [&>svg]:w-[10.5px] [&>svg]:text-faint">
              <Bar w="36%" />
              {chevronRight}
            </div>
            <div className="mt-[8.1px] flex items-start">
              <div className="relative z-[1] w-[56%] shrink-0 rounded-[11.4px] bg-white p-[7.3px] shadow-mc-row">
                <span className={`${ph} h-[73px]`}>{imageGlyph}</span>
                <div className="mt-[7.3px] flex items-center justify-between">
                  <Bar w="48%" />
                  <Bar w="26%" />
                </div>
                <Bar w="34%" className="mt-[5.7px]" />
              </div>
              <div className="ml-[6.5px] min-w-0 flex-1 rounded-[11.4px] bg-white p-[7.3px] shadow-mc-row-soft">
                <span className={`${ph} h-[73px]`}>{imageGlyph}</span>
                <Bar w="80%" className="mt-[5.7px]" />
                <Bar w="64%" className="mt-[5.7px]" />
              </div>
            </div>
            <div className="mt-[11.4px] flex items-center justify-between [&>svg]:block [&>svg]:h-[10.5px] [&>svg]:w-[10.5px] [&>svg]:text-faint">
              <Bar w="36%" />
              {chevronRight}
            </div>
            <div className="mt-[8.1px] grid grid-cols-2 gap-[7.3px]">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-[9.7px] border border-mc-pv-card-line bg-white px-[6.5px] pt-[6.5px] pb-[8.1px]">
                  <span className={`${ph} h-[43.8px]`}>{imageGlyph}</span>
                  <Bar w="90%" className="mt-[5.7px]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Sample>This is a preview of your website link.</Sample>
    </PreviewCard>
  );
}

/**
 * A preview row that is a real link on a hosted page and a plain row in the
 * creator. External links leave in a new tab; tel:/mailto: open their app.
 */
export function RowLink({ href, className, children }: { href?: string; className: string; children: ReactNode }) {
  if (!href) return <div className={className}>{children}</div>;
  const web = /^https?:/i.test(href);
  return (
    <a href={href} className={className} {...(web ? { target: "_blank", rel: "noopener" } : {})}>
      {children}
    </a>
  );
}

/* ---- vCard ----------------------------------------------------------------- */

const DEFAULT_DOTS = ["instagram", "facebook", "linkedin", "youtube"];

/**
 * The colour dots under the name: the first four platforms switched on in the
 * social picker, or the designer's four while none are.
 */
function dotColors(selected: string[]) {
  return (selected.length ? selected.slice(0, 4) : DEFAULT_DOTS).map(
    (k) => socialByKey[k]?.color ?? "#000000",
  );
}

/** A phone value as the card will dial it: the picked code, unless typed. */
function phoneOf(values: Values, k: string) {
  const n = (values[k] ?? "").trim();
  if (!n) return "";
  if (n.startsWith("+")) return n;
  const code = (values[`${k}Country`] ?? dialCodes[0].value).split("-")[0];
  return `${code} ${n}`;
}

const clean = (parts: (string | undefined)[], sep: string) =>
  parts.map((p) => (p ?? "").trim()).filter(Boolean).join(sep);

export function VCardPreview({
  values,
  selectedSocials,
  open,
  onToggle,
}: {
  values: Values;
  selectedSocials: string[];
  open: boolean;
  onToggle: () => void;
}) {
  // As a hosted page there are no samples: only what was entered.
  const page = usePageMode();
  const sample = (v: string, s: string) => v || (page ? "" : s);
  const name = sample(
    [values.firstName, values.lastName].map((s) => (s ?? "").trim()).filter(Boolean).join(" "),
    "Ava Whitfield",
  );
  const role = sample((values.jobTitle ?? "").trim(), "Senior Product Designer");
  const summary = sample(
    (values.summary ?? "").trim(),
    "Designing thoughtful, human-centered products — pairing research and craft to turn rough ideas into polished experiences.",
  );
  const stored = parseStoredFile(values.photo ?? "");
  const photo = fileSrc(stored) ?? (page ? undefined : "/previews/portrait.jpg");
  const photoStyle = stored ? cropStyle(stored) : { objectFit: "cover" as const };
  const initials = [values.firstName, values.lastName].map((s) => (s ?? "").trim().charAt(0)).join("").toUpperCase();
  // On the page the dots are the profiles themselves, as links.
  const pageSocials = page ? filledSocials(values) : [];
  const dots = page ? pageSocials.slice(0, 4).map((k) => socialByKey[k]?.color ?? "#000000") : dotColors(selectedSocials);

  // JB, 2026-10-15: the three rows keep their labels and show what was
  // entered underneath — contact: a phone, else the email; company: the
  // organisation; address: city/state, else the whole address or its link.
  // Nothing entered, nothing shown: no sample details here.
  const contact =
    phoneOf(values, "phone") ||
    phoneOf(values, "mobile") ||
    phoneOf(values, "work") ||
    (values.email ?? "").trim();
  const address =
    values.addressMode === "url"
      ? (values.addressUrl ?? "").trim()
      : clean([values.city, values.state], ", ") ||
        clean([values.street, clean([values.zip, values.country], " ")], ", ");
  const tel = phoneOf(values, "phone") || phoneOf(values, "mobile") || phoneOf(values, "work");
  const website = (values.website ?? "").trim();
  const rows = [
    {
      label: "Contact",
      detail: contact,
      href: tel ? `tel:${tel.replace(/[^\d+]/g, "")}` : (values.email ?? "").trim() ? `mailto:${(values.email ?? "").trim()}` : "",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: "Company info",
      detail: (values.organization ?? "").trim(),
      href: website && website !== "https://" ? (/^https?:\/\//i.test(website) ? website : `https://${website}`) : "",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      label: "Address",
      detail: address,
      href:
        values.addressMode === "url"
          ? address
          : address
            ? `https://maps.google.com/?q=${encodeURIComponent(clean([values.street, values.zip, values.city, values.state, values.country], ", "))}`
            : "",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      barClassName="items-stretch p-[13px]"
      bar={
        <>
          <span className="flex min-w-0 flex-1 flex-col items-start justify-center pr-[9.7px]">
            <span className="block text-[15.41px] leading-[normal] font-bold tracking-[-0.31px] text-ink">
              Your vCard Preview
            </span>
            <BarSub open={open} base="See how your information looks in real time" className="mt-[3.8px] text-[10.95px] leading-[normal]" />
            {/* Their `.xpd`. JB asked for it to say what pressing it does. */}
            <span className="mt-[13.1px] inline-flex items-center gap-[6px] rounded-full bg-mc-soft px-[12.6px] py-[7.3px] text-[10.95px] leading-[normal] font-bold text-primary [&>svg]:block [&>svg]:h-[13.1px] [&>svg]:w-[13.1px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <b className="font-black">{open ? "Collapse preview" : "Expand preview"}</b>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-[250ms] ease-out ${open ? "rotate-180" : ""}`}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </span>
          {/* Their `.mini`: a thumbnail of the card, always visible. */}
          <span className="relative block w-[102.2px] shrink-0 overflow-hidden rounded-[9.7px] border border-mc-card-line bg-white pb-[8.9px] text-center shadow-mc-mini">
            <i className="block h-[29.2px] bg-mc-pv-band" />
            {/* JB, 2026-10-15: a true circle (the mockup's oval was a bug). */}
            <span className="mx-auto -mt-[17.8px] block h-[35.7px] w-[35.7px] overflow-hidden rounded-full border-[2.4px] border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="block h-full w-full" style={photoStyle} />
            </span>
            <span className="mt-[4.7px] block truncate px-[4.7px] text-[9.33px] leading-[normal] font-bold text-mc-pv-name">
              {name}
            </span>
            <span className="mt-[1.5px] block truncate px-[3.9px] text-[7.71px] leading-[normal] text-muted">
              {role}
            </span>
            <span className="mt-[5.7px] flex justify-center gap-[4.1px]">
              {dots.map((c, i) => (
                <i key={i} className="h-[8.1px] w-[8.1px] rounded-full" style={{ background: c }} />
              ))}
            </span>
            <span className="mt-[7.3px] block px-[9.7px]">
              <i className="block h-[3.6px] rounded-full bg-mc-pv-bar" />
              <i className="mt-[4.1px] ml-[16%] block h-[3.6px] w-[68%] rounded-full bg-mc-pv-bar" />
            </span>
          </span>
        </>
      }
    >
      <Phone>
        <div className="relative h-[63.3px] overflow-hidden bg-mc-pv-band">
          <i className="absolute -top-[77.1px] -right-[40.6px] block h-[137.9px] w-[137.9px] rounded-full border-[17.8px] border-mc-pv-ring" />
          <i className="absolute -bottom-[44.6px] -left-[24.3px] block h-[73px] w-[73px] rounded-full border-[11.4px] border-mc-pv-ring/55" />
          <Chip round className="top-[8.1px] left-[8.1px] text-primary-dark">
            {qrGlyph}
          </Chip>
          {page ? (
            // Saves the contact, photo included — the reason vCard is hosted.
            <a
              href={`/q/${page.slug}/contact.vcf`}
              className="absolute top-[8.5px] right-[8.5px] flex h-[23px] items-center rounded-full bg-brand-dark px-[10.6px] text-[8.52px] leading-[normal] font-semibold text-white shadow-mc-pill"
            >
              Add contact
            </a>
          ) : (
            <span className="absolute top-[8.5px] right-[8.5px] flex h-[23px] items-center rounded-full bg-brand-dark px-[10.6px] text-[8.52px] leading-[normal] font-semibold text-white shadow-mc-pill">
              Add contact
            </span>
          )}
        </div>
        <div className="relative -mt-[13px] rounded-t-[16.2px] bg-white px-[11.4px] pb-[13.8px] text-center">
          <span className="mx-auto -mt-[31.6px] flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full border-[3.2px] border-white bg-mc-pv-band shadow-mc-photo">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="block h-full w-full" style={photoStyle} />
            ) : (
              // A page without a photo: initials (unmocked).
              <span className="text-[18px] leading-none font-bold text-white">{initials}</span>
            )}
          </span>
          <h5 className="mt-[7.1px] text-[12.98px] leading-[normal] font-bold tracking-[-0.13px] text-mc-pv-name">
            {name}
          </h5>
          {role && <p className="mt-[2.3px] text-[9.33px] leading-[normal] text-mc-pv-role">{role}</p>}
          {dots.length > 0 && (
            <div className="mt-[7.3px] flex justify-center gap-[6.5px]">
              {page
                ? pageSocials.slice(0, 4).map((k) => (
                    <a
                      key={k}
                      href={socialHref(k, values[k] ?? "") || undefined}
                      aria-label={socialByKey[k]?.name}
                      className="block h-[12.2px] w-[12.2px] rounded-full"
                      style={{ background: socialByKey[k]?.color }}
                    />
                  ))
                : dots.map((c, i) => (
                    <i key={i} className="block h-[12.2px] w-[12.2px] rounded-full" style={{ background: c }} />
                  ))}
            </div>
          )}
          {summary && (
            <p className="mx-auto mt-[7.7px] max-w-[204.4px] text-[8.52px] leading-[13.63px] text-muted">
              {summary}
            </p>
          )}
          <div className="mt-[10.5px]">
            {(page ? rows.filter((r) => r.detail) : rows).map((r, i) => (
              <RowLink key={i} href={page ? r.href : ""} className={`flex items-center rounded-[10.5px] bg-mc-pv-row px-[8.1px] py-[7.3px] ${i ? "mt-[6.5px]" : ""}`}>
                <span className="flex h-[21.1px] w-[21.1px] shrink-0 items-center justify-center rounded-[6.5px] bg-white text-ink shadow-mc-tick [&>svg]:block [&>svg]:h-[10.5px] [&>svg]:w-[10.5px]">
                  {r.icon}
                </span>
                <span className="min-w-0 flex-1 pl-[8.8px] text-left">
                  <span className="block truncate text-[9.73px] leading-[normal] font-semibold text-body">
                    {r.label}
                  </span>
                  {/* Unmocked: the entered value, wrapping so the row grows. */}
                  {r.detail && (
                    <span className="mt-[1.6px] block text-[8.52px] leading-[12px] break-words text-muted">
                      {r.detail}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-muted [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]">{chevronRight}</span>
              </RowLink>
            ))}
          </div>
        </div>
      </Phone>
      <Sample>Example preview. Your details replace it as you type.</Sample>
    </PreviewCard>
  );
}

/* ---- Multi-Link ------------------------------------------------------------ */

const sampleLinks: { label: string; icon: ReactNode }[] = [
  {
    label: "Prices",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Location",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Order now",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

/** The link glyph their script gives every row once the visitor names one. */
const linkGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const sampleSocials = ["instagram", "tiktok"];

/** Their `.lrow`: a white pill row in the phone — a link on a hosted page. */
function LinkRow({ lead, href, children }: { lead: ReactNode; href?: string; children: ReactNode }) {
  return (
    <RowLink href={href} className="flex items-center rounded-full bg-white px-[8.1px] py-[5.7px] shadow-mc-row [&+&]:mt-[6.5px]">
      {lead}
      <span className="min-w-0 flex-1 truncate px-[6.8px] text-left text-[9.73px] leading-[normal] font-semibold text-body">
        {children}
      </span>
      <span className="shrink-0 text-faint [&>svg]:block [&>svg]:h-[11.4px] [&>svg]:w-[11.4px]">{chevronRight}</span>
    </RowLink>
  );
}

/** A typed link as somewhere to go: a bare host gets https://. */
export const hrefOf = (u: string) => {
  const v = u.trim();
  if (!v || v === "https://") return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
};

const ic =
  "flex h-[18.7px] w-[18.7px] shrink-0 items-center justify-center rounded-full border border-mc-pv-ic-line text-ink [&>svg]:block [&>svg]:h-[9.3px] [&>svg]:w-[9.3px]";

export function MultiLinkPreview({
  values,
  selectedSocials,
  open,
  onToggle,
}: {
  values: Values;
  selectedSocials: string[];
  open: boolean;
  onToggle: () => void;
}) {
  const page = usePageMode();
  const title = (values.title ?? "").trim() || (page ? "" : "The Matcha Den");
  const desc =
    (values.description ?? "").trim() ||
    (page ? "" : "A cozy matcha bar pouring comforting, Japanese-inspired drinks all day long.");
  const coverFile = parseStoredFile(values.image ?? "");
  const cover = fileSrc(coverFile) ?? (page ? undefined : "/previews/cafe.jpg");
  const coverStyle = coverFile ? cropStyle(coverFile) : { objectFit: "cover" as const };
  const links = filledLinks(values.links ?? "");
  const soc = page ? filledSocials(values) : selectedSocials.length ? selectedSocials : sampleSocials;

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <span className="block h-[35.7px] w-[35.7px] shrink-0 overflow-hidden rounded-[8.1px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="block h-full w-full" style={coverStyle} />
          </span>
          <BarText open={open} title="Your Multi-Link Preview" base="See how your page looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-[linear-gradient(115deg,#ffffff_30%,var(--color-mc-pv-sheen)_50%,#ffffff_70%)] pb-[13.8px]">
        <div className="relative mx-[8.1px] mt-[8.1px] h-[81.1px] overflow-hidden rounded-[13px] bg-mc-pv-band">
          {/* No cover on a hosted page: the plain band (unmocked). */}
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="block h-full w-full" style={coverStyle} />
          )}
          <Chip className="top-[8.1px] left-[8.1px] text-primary-dark">{qrGlyph}</Chip>
          <Chip round className="top-[8.1px] right-[8.1px] text-muted">{shareGlyph}</Chip>
        </div>
        <div className="px-[12.2px] pt-[9.7px]">
          <h5 className="text-[12.98px] leading-[normal] font-bold tracking-[-0.13px] text-mc-pv-title">{title}</h5>
          {desc && <p className="mt-[4px] text-[8.92px] leading-[13.83px] text-muted">{desc}</p>}
        </div>
        <div className="px-[10.5px] pt-[9.7px]">
          {links.length
            ? links.map((l, i) => (
                <LinkRow
                  key={i}
                  href={page ? hrefOf(l.url) : undefined}
                  lead={
                    <span className={`${ic} overflow-hidden`}>
                      {l.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.logo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        linkGlyph
                      )}
                    </span>
                  }
                >
                  {linkCaption(l)}
                </LinkRow>
              ))
            : !page && sampleLinks.map((l) => (
                <LinkRow key={l.label} lead={<span className={ic}>{l.icon}</span>}>
                  {l.label}
                </LinkRow>
              ))}
        </div>
        {soc.length > 0 && (
        <>
        <div className="px-[12.2px] pt-[12.2px] text-left text-[9.73px] leading-[normal] font-bold text-ink">
          Find me on
        </div>
        <div className="px-[10.5px] pt-[7.3px]">
          {soc.map((k) => (
            <LinkRow
              key={k}
              href={page ? socialHref(k, values[k] ?? "") : undefined}
              lead={<i className="m-[3.2px] block h-[12.2px] w-[12.2px] shrink-0 rounded-full" style={{ background: socialByKey[k]?.color }} />}
            >
              {socialByKey[k]?.name}
            </LinkRow>
          ))}
        </div>
        </>
        )}
      </Phone>
      <Sample>Example preview. Your links and details replace it as you type.</Sample>
    </PreviewCard>
  );
}

/* ---- Shared shell ---------------------------------------------------------- */

export function BarText({ open, title, base }: { open: boolean; title: string; base: string }) {
  return (
    <span className="min-w-0 flex-1 pr-[8.1px] pl-[8.9px]">
      <span className="block text-[12.98px] leading-[normal] font-bold text-ink">{title}</span>
      <BarSub open={open} base={base} className="mt-[2.4px] text-[10.55px] leading-[normal]" />
    </span>
  );
}

export function BarCaret({ open }: { open: boolean }) {
  return (
    <i className={`flex shrink-0 text-muted not-italic transition-transform duration-[250ms] ease-out ${open ? "rotate-180" : ""}`}>
      <Caret className="block h-[14.6px] w-[14.6px]" />
    </i>
  );
}

/**
 * Their `.pvwCmp`: the whole bar is the toggle. Expanding or collapsing only
 * shows or hides — the form below is untouched, and the page does not jump,
 * because the card grows downward from where the visitor tapped.
 */
export function PreviewCard({
  open,
  onToggle,
  bar,
  barClassName = "items-center px-[13px] py-[12.2px]",
  children,
}: {
  open: boolean;
  onToggle: () => void;
  bar: ReactNode;
  barClassName?: string;
  children: ReactNode;
}) {
  // As a hosted page: the content alone.
  if (usePageMode()) return <>{children}</>;
  return (
    <div className="mt-[13px] rounded-[13px] border border-mc-line bg-white">
      <a
        href="#"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className={`flex ${barClassName}`}
      >
        {bar}
      </a>
      <Slide open={open}>
        {/* JB: a touch more room between the bar and the expanded card. */}
        <div className="px-[13px] pt-[4px] pb-[13px]">{children}</div>
      </Slide>
    </div>
  );
}
