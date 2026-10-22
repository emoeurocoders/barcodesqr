"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { eventTimes, splitWhen } from "../encodeQr";
import { cropStyle, fileSrc, parseStoredFile } from "../storedValues";
import { localTimeZone, minutesInZone } from "@/lib/zoned";
import { BarCaret, BarText, PreviewCard, Sample } from "./previews";
import { eventEndOk } from "./forms6";

/**
 * The previews for batch 6 (event / coupon / feedback / business), from the
 * same files. Sizes are their computed values at 390, measured with the
 * preview open (`.pvwCmp` is 8.112px to the em).
 */

type Values = Record<string, string>;
type Props = { values: Values; open: boolean; onToggle: () => void };

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const t = (v?: string) => (v ?? "").trim();

function BarIcon({ tint, color, children }: { tint: string; color: string; children: ReactNode }) {
  return (
    <i
      className="flex h-[35.7px] w-[35.7px] shrink-0 items-center justify-center rounded-full not-italic [&>svg]:block [&>svg]:h-[17.8px] [&>svg]:w-[17.8px]"
      style={{ background: tint, color }}
    >
      {children}
    </i>
  );
}

function Phone({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={`relative mx-auto mt-[4.06px] overflow-hidden rounded-[17.85px] border border-mc-pv-line shadow-mc-phone ${className}`}>
      {children}
    </div>
  );
}

/** "Copy code" → "Copied!" for 1.4s, as their script does. */
function useCopied() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(id);
  }, [copied]);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked — still confirm, as their fallback does */
    }
    setCopied(true);
  };
  return { copied, copy };
}

/** Their `crFmtTime`: "18:00" → "6 PM", "18:30" → "6:30 PM". */
const hm = (v: string) => {
  const [h, m] = v.split(":");
  const n = parseInt(h, 10);
  return `${n % 12 || 12}${m !== "00" ? `:${m}` : ""} ${n >= 12 ? "PM" : "AM"}`;
};

/* ---- Event ----------------------------------------------------------------- */

const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
/** Their event-row time: always with minutes ("6:00 PM"). */
const hmm = (v: string) => {
  const [h, m] = v.split(":");
  const n = parseInt(h, 10);
  return `${n % 12 || 12}:${m} ${n >= 12 ? "PM" : "AM"}`;
};

const calGlyph = (
  <svg {...svgProps}>
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
  </svg>
);

/**
 * "Add to Calendar" downloads the same event the QR code carries, as an
 * .ics file — once a start date and time are in and the end is valid.
 * Before that it does nothing, as theirs does.
 */
function downloadIcs(values: Values) {
  const { start, end } = eventTimes(values);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BarcodesQR//Event//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@barcodesqr.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "")}`,
    `SUMMARY:${t(values.eventTitle)}`,
    `DTSTART:${start}`,
    ...(end ? [`DTEND:${end}`] : []),
    ...(t(values.location) ? [`LOCATION:${t(values.location)}`] : []),
    ...(t(values.description) ? [`DESCRIPTION:${t(values.description).replace(/\n/g, "\\n")}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${t(values.eventTitle).replace(/[^\w\- ]+/g, "").trim() || "event"}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function EventPreview({ values, open, onToggle }: Props) {
  const s = splitWhen(values.startsAt);
  const e = splitWhen(values.endsAt);
  const d = new Date(`${s.date || "2024-06-09"}T12:00:00`);
  const valid = !isNaN(d.getTime());
  const title = t(values.eventTitle) || "Summer Networking Mixer";
  const loc = t(values.location);
  const desc = t(values.description);
  // Their rule: sample rows show only while nothing at all is typed.
  const any = !!(t(values.eventTitle) || s.date || s.time || loc || desc);
  const time = s.time ? hmm(s.time) + (e.time ? ` – ${hmm(e.time)}` : "") : "6:00 PM – 9:00 PM";
  const canAdd = !!(t(values.eventTitle) && s.date && s.time && eventEndOk(values));

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="#dff0f4" color="#0e7490">{calGlyph}</BarIcon>
          <BarText open={open} title="Your Event Preview" base="See how your event will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-[#f3f6fa] p-[11.36px]">
        <div className="overflow-hidden rounded-[9.73px] bg-white text-left shadow-[0_10px_24px_-18px_rgba(14,19,17,0.35)]">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/previews/sunset-hearts.jpg" alt="" className="block h-[97.34px] w-full object-cover" />
            <span className="absolute bottom-[8.92px] left-[9.73px] rounded-[7.3px] bg-white px-[8.92px] py-[5.68px] text-center shadow-[0_8px_18px_-10px_rgba(14,19,17,0.4)]">
              <span className="block text-[7.71px] leading-[normal] font-bold tracking-[0.62px] text-[#0e7490]">{valid ? MON[d.getMonth()] : "JUN"}</span>
              <span className="block text-[14.6px] leading-[16.79px] font-extrabold text-ink">{valid ? String(d.getDate()).padStart(2, "0") : "09"}</span>
              <span className="block text-[7.3px] leading-[normal] font-semibold tracking-[0.58px] text-[#9aa3b2]">{valid ? DOW[d.getDay()] : "SUN"}</span>
            </span>
          </div>
          <div className="p-[11.36px]">
            <h5 className="text-[13.79px] leading-[17.93px] font-extrabold break-words text-ink">{title}</h5>
            <div className="mt-[8.92px] flex items-center gap-[7.3px]">
              <i className="flex h-[23.52px] w-[23.52px] shrink-0 items-center justify-center rounded-full bg-[#e0f0f4] text-[#0e7490] not-italic [&>svg]:block [&>svg]:h-[11.34px] [&>svg]:w-[11.34px]">
                <svg {...svgProps}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </i>
              <div className="min-w-0">
                <span className="block text-[10.55px] leading-[14.76px] font-semibold text-ink">{time}</span>
              </div>
            </div>
            {(loc || !any) && (
              <div className="mt-[8.92px] flex items-center gap-[7.3px]">
                <i className="flex h-[23.52px] w-[23.52px] shrink-0 items-center justify-center rounded-full bg-[#e0f0f4] text-[#0e7490] not-italic [&>svg]:block [&>svg]:h-[11.34px] [&>svg]:w-[11.34px]">
                  <svg {...svgProps}>
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </i>
                <div className="min-w-0">
                  <span className="block text-[10.55px] leading-[14.76px] font-semibold break-words text-ink">{loc || "The Skyline Rooftop"}</span>
                  {!loc && <span className="block text-[9.33px] leading-[13.06px] text-muted">123 Main St, New York, NY 10001</span>}
                </div>
              </div>
            )}
            {(desc || !any) && (
              <p className="mt-[11.15px] text-[10.14px] leading-[15.72px] break-words whitespace-pre-line text-prose">
                {desc ||
                  "Join us for an evening of great conversations, new connections, and summer vibes. Enjoy refreshments, meet industry professionals, and be part of our growing community!"}
              </p>
            )}
            <a
              href="#"
              aria-disabled={!canAdd || undefined}
              onClick={(ev) => {
                ev.preventDefault();
                if (canAdd) downloadIcs({ ...values, timezone: values.timezone || localTimeZone() });
              }}
              className="mt-[14.76px] flex items-center justify-center gap-[7.95px] rounded-full bg-[#0e7490] px-[11.36px] py-[9.65px] text-[11.36px] leading-[normal] font-semibold text-white [&>svg]:block [&>svg]:h-[13.63px] [&>svg]:w-[13.63px]"
            >
              {calGlyph}
              <span>Add to Calendar</span>
            </a>
          </div>
        </div>
      </Phone>
      <Sample>Example event. Your details replace it as you type.</Sample>
    </PreviewCard>
  );
}

/* ---- Coupon ---------------------------------------------------------------- */

const copyGlyph = (
  <svg {...svgProps}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  </svg>
);

export function CouponPreview({ values, open, onToggle }: Props) {
  const { copied, copy } = useCopied();
  // "Expired" is judged against when the preview opened — close enough.
  const [now] = useState(() => Date.now());
  const title = t(values.title) || "Weekend Special";
  const disc = t(values.discount) || "20% OFF";
  const exp = t(values.expiry);
  // Code and expiry are optional. Once anything is typed, the samples for
  // them go — a coupon with no code must not show "SAVE20" to copy (the
  // file's own Event and Business previews drop samples the same way).
  const any = !!(t(values.title) || t(values.discount) || t(values.code) || exp || t(values.terms));
  const code = t(values.code) || (any ? "" : "SAVE20");
  const terms = t(values.terms) || (any ? "" : "One per customer. Cannot be combined with other offers.");
  const expDate = exp ? new Date(`${exp}T23:59:59`) : null;
  const expired = !!expDate && expDate.getTime() < now;
  const expText = expDate
    ? `${expired ? "Expired" : "Expires"} ${expDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : any
      ? ""
      : "Expires Dec 31, 2026";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="rgba(239, 68, 68, 0.08)" color="#EF4444">
            <svg {...svgProps}>
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
              <path d="M13 5v2"></path>
              <path d="M13 17v2"></path>
              <path d="M13 11v2"></path>
            </svg>
          </BarIcon>
          <BarText open={open} title="Your Coupon Preview" base="See how your offer will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-white p-[12.98px]">
        <div className="flex items-center justify-center gap-[5.27px] text-[10.55px] leading-[normal] font-bold tracking-[0.84px] text-brand-dark uppercase [&>svg]:block [&>svg]:h-[13.7px] [&>svg]:w-[13.7px]">
          <svg {...svgProps}>
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </svg>
          Exclusive coupon
        </div>
        <div className="mt-[10.55px] overflow-hidden rounded-[11.36px] border border-[#e5e8ee] text-left">
          <div
            className="relative bg-cover bg-center bg-no-repeat px-[12.98px] pt-[24.34px] pb-[22.71px] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(14,19,17,0.55)_0%,rgba(14,19,17,0.2)_60%,rgba(14,19,17,0.45)_100%)] after:content-['']"
            style={{ backgroundImage: "url(/previews/cafe.jpg)" }}
          >
            <div className="relative z-[1]">
              <div className="text-[9.33px] leading-[normal] font-bold tracking-[1.12px] text-white/85 uppercase">The Matcha Den</div>
              <div className="mt-[4.62px] text-[15.41px] leading-[normal] font-bold break-words text-white">{title}</div>
              <div className="mt-[4.99px] text-[33.26px] leading-[normal] font-extrabold tracking-[-0.33px] break-words text-white [text-shadow:0_1px_3px_rgba(14,19,17,0.35)]">
                {disc}
              </div>
            </div>
          </div>
          <div className="px-[11.36px] pt-[12.17px] pb-[12.98px]">
            {code && (
              <>
                <div className="text-[9.33px] leading-[normal] font-bold tracking-[0.93px] text-faint uppercase">Promo code</div>
                <div className="mt-[6.49px] flex items-center justify-between gap-[6.49px] rounded-[8.11px] border-2 border-dashed border-[#cdd5df] bg-[#fbfcfd] px-[10.55px] py-[8.11px] [&>svg]:block [&>svg]:h-[13.78px] [&>svg]:w-[13.78px] [&>svg]:shrink-0 [&>svg]:text-muted">
                  <span className="min-w-0 truncate text-[14.6px] leading-[normal] font-extrabold tracking-[1.17px] text-ink">{code}</span>
                  {copyGlyph}
                </div>
              </>
            )}
            {expText && (
              <div
                className={`mt-[12.05px] flex items-center gap-[5.48px] text-[10.95px] leading-[normal] [&>svg]:block [&>svg]:h-[14.23px] [&>svg]:w-[14.23px] [&>svg]:shrink-0 ${
                  expired ? "font-semibold text-[#dc2626]" : "text-prose"
                }`}
              >
                <svg {...svgProps}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <span>{expText}</span>
              </div>
            )}
            {code && (
              <button
                type="button"
                onClick={() => copy(code)}
                className="mt-[12.17px] flex w-full cursor-pointer items-center justify-center gap-[7.3px] rounded-[12.17px] border-0 bg-[#14532d] p-[10.95px] text-[12.17px] leading-[normal] font-semibold text-white [&>svg]:block [&>svg]:h-[15.2px] [&>svg]:w-[15.2px]"
              >
                {copyGlyph}
                <span>{copied ? "Copied!" : "Copy code"}</span>
              </button>
            )}
            {terms && (
              <p className="mt-[9.73px] text-center text-[9.73px] leading-[14.6px] break-words text-faint">{terms}</p>
            )}
          </div>
        </div>
      </Phone>
      <Sample>Example preview. Your details replace it as you type.</Sample>
    </PreviewCard>
  );
}

/* ---- Feedback -------------------------------------------------------------- */

/**
 * Deliberately neutral: no stars, no made-up ratings (JB). The business name
 * is the file's sample — its caption says so — and the button opens the
 * customer's own link once it is a valid https:// address.
 */
export function FeedbackPreview({ values, open, onToggle }: Props) {
  const url = t(values.url);
  const live = /^https:\/\/[^\s]+\.[^\s]{2,}/i.test(url);
  const deco =
    "before:absolute before:top-[28%] before:left-[-15.41px] before:h-[2px] before:w-[8.92px] before:rotate-[35deg] before:rounded-[2px] before:bg-[#9fcbaf] before:content-[''] after:absolute after:top-[28%] after:right-[-15.41px] after:h-[2px] after:w-[8.92px] after:-rotate-[35deg] after:rounded-[2px] after:bg-[#9fcbaf] after:content-['']";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="#e9f0fb" color="#2563eb">
            <svg {...svgProps}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M8 10h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M16 10h.01"></path>
            </svg>
          </BarIcon>
          <BarText open={open} title="Your Feedback Preview" base="See how customers can share feedback" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-[#f3f6fa] p-[11.36px]">
        <div className="rounded-[9.73px] bg-[#e8f3ec] bg-[radial-gradient(circle_at_12%_88%,#d9ecdf_0_36.5px,transparent_37.3px),radial-gradient(circle_at_90%_14%,#d9ecdf_0_40.56px,transparent_41.37px)] px-[12.98px] py-[16.22px] text-center">
          <i className={`relative mx-auto flex h-[45.42px] w-[45.42px] items-center justify-center rounded-full bg-white text-[#3f7d4e] not-italic shadow-[0_10px_22px_-14px_rgba(14,19,17,0.35)] [&>svg]:block [&>svg]:h-[20.27px] [&>svg]:w-[20.27px] ${deco}`}>
            <svg {...svgProps}>
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
          </i>
          <p className="mt-[9.49px] text-[10.55px] leading-[14.76px] font-bold text-[#2f5e3d]">Harbor &amp; Sage Co.</p>
          <h5 className="mt-[5.68px] text-[14.2px] leading-[18.45px] font-extrabold text-ink">We’d love your feedback!</h5>
          <p className="mx-auto mt-[6.33px] max-w-[210.91px] text-[10.55px] leading-[15.82px] text-prose">
            Tell us about your experience. Your feedback helps us improve.
          </p>
          <a
            href={live ? url : "#"}
            target="_blank"
            rel="noopener"
            onClick={(e) => {
              if (!live) e.preventDefault();
            }}
            className="mx-auto mt-[13.63px] flex max-w-[170.34px] items-center justify-center gap-[6.81px] rounded-full bg-primary px-[11.36px] py-[9.09px] text-[11.36px] leading-[normal] font-semibold text-white [&>svg]:block [&>svg]:h-[12.48px] [&>svg]:w-[12.48px]"
          >
            <span>Share Your Feedback</span>
            <svg {...svgProps} strokeWidth="2.4">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
          <p className="mt-[8.4px] flex items-center justify-center gap-[4.66px] text-[9.33px] leading-[13.06px] text-muted [&>svg]:block [&>svg]:h-[10.25px] [&>svg]:w-[10.25px] [&>svg]:shrink-0">
            <svg {...svgProps}>
              <path d="M15 3h6v6"></path>
              <path d="M10 14 21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
            Opens your feedback form
          </p>
        </div>
      </Phone>
      <Sample>Example preview. Harbor &amp; Sage Co. is sample content; the button uses your link.</Sample>
    </PreviewCard>
  );
}

/* ---- Business Page --------------------------------------------------------- */

const chevron = (
  <svg {...svgProps}>
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

const bizRows: { key: string; t1: string; sample: string; tint: string; color: string; icon: ReactNode }[] = [
  {
    key: "phone",
    t1: "Call",
    sample: "+1 555 014 2890",
    tint: "#e9f0fb",
    color: "#2563eb",
    icon: (
      <svg {...svgProps}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
  },
  {
    key: "email",
    t1: "Email",
    sample: "hello@harborsage.com",
    tint: "#e4f8ef",
    color: "#0d8a82",
    icon: (
      <svg {...svgProps}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
    ),
  },
  {
    key: "website",
    t1: "Website",
    sample: "harborsage.com",
    tint: "#f1e9ff",
    color: "#7C3AED",
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
        <path d="M2 12h20"></path>
      </svg>
    ),
  },
  {
    key: "address",
    t1: "Directions",
    sample: "123 Harbor St, Portside",
    tint: "#fdecef",
    color: "#EA4335",
    icon: (
      <svg {...svgProps}>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  },
];

/**
 * Open / Closed is worked out in the business's own zone — saved with the
 * code, or the creator's while editing — and shown only when both hours are
 * set (JB). Without them, the file's sample line appears only while the
 * whole preview is still the sample; once anything real is typed it goes,
 * rather than claim the business is open.
 */
function useHours(values: Values, anyTyped: boolean) {
  const op = t(values.opensAt);
  const cl = t(values.closesAt);
  // Re-read the clock each minute while the preview is up.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  if (/^\d{2}:\d{2}$/.test(op) && /^\d{2}:\d{2}$/.test(cl)) {
    const tz = values.timezone || localTimeZone();
    const nm = tz ? minutesInZone(now, tz) : null;
    if (nm === null) return null;
    const om = +op.slice(0, 2) * 60 + +op.slice(3);
    const cm = +cl.slice(0, 2) * 60 + +cl.slice(3);
    const isOpen = om <= cm ? nm >= om && nm < cm : nm >= om || nm < cm;
    return { isOpen, text: isOpen ? `Closes ${hm(cl)}` : `Opens ${hm(op)}` };
  }
  return anyTyped ? null : { isOpen: true, text: "Closes 3 PM" };
}

export function BusinessPreview({ values, open, onToggle }: Props & { selectedSocials?: string[] }) {
  const coverFile = parseStoredFile(values.cover ?? "");
  const cover = fileSrc(coverFile) ?? "/previews/team.jpg";
  const coverStyle = coverFile ? cropStyle(coverFile) : { objectFit: "cover" as const };
  const logoFile = parseStoredFile(values.logo ?? "");
  const logo = fileSrc(logoFile);
  const name = t(values.title) || "Harbor & Sage Co.";
  const desc = t(values.description) || "Specialty coffee & all-day brunch in the heart of town.";
  const filled = (k: string) => {
    const v = t(values[k]);
    return v === "https://" ? "" : v;
  };
  const anyContact = bizRows.some((r) => filled(r.key));
  const anyTyped = anyContact || !!(t(values.title) || t(values.description) || t(values.opensAt) || t(values.closesAt));
  const hours = useHours(values, anyTyped);

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <span className="block h-[35.7px] w-[35.7px] shrink-0 overflow-hidden rounded-[8.11px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="block h-full w-full" style={coverStyle} />
          </span>
          <BarText open={open} title="Your Business Page Preview" base="See how your business page will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-white">
        <div className="relative h-[190.63px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="block h-full w-full" style={coverStyle} />
          <span className="absolute top-[8.11px] right-[8.11px] flex h-[29.2px] w-[29.2px] items-center justify-center rounded-full bg-white/88 text-muted shadow-mc-chip [&>svg]:block [&>svg]:w-[53%]">
            <svg {...svgProps}>
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
            </svg>
          </span>
        </div>
        <div className="relative mx-auto -mt-[27.58px] flex h-[55.16px] w-[55.16px] items-center justify-center overflow-hidden rounded-full bg-brand-dark text-white shadow-[0_0_0_3.24px_#ffffff,0_8px_18px_-10px_rgba(14,19,17,0.35)] [&>svg]:block [&>svg]:h-[25.14px] [&>svg]:w-[25.14px]">
          <svg {...svgProps}>
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M12 6h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M8 14h.01"></path>
          </svg>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="absolute top-0 left-0 h-full w-full" style={cropStyle(logoFile)} />
          )}
        </div>
        <h5 className="mt-[8.25px] px-[15px] text-center text-[15px] leading-[normal] font-bold tracking-[-0.15px] break-words text-[#1f2937]">{name}</h5>
        <p className="mt-[4.22px] px-[15.82px] text-center text-[10.55px] leading-[15.82px] break-words text-muted">{desc}</p>
        <div className="px-[12.17px] pt-[11.36px]">
          {bizRows.map((r) => {
            const v = filled(r.key);
            if (anyContact && !v) return null;
            return (
              <div
                key={r.key}
                className="flex items-center rounded-[11.36px] border border-[#eef1f4] bg-[#f5f7f9] px-[9.73px] py-[8.92px] [&+&]:mt-[7.3px]"
              >
                <span
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full [&>svg]:block [&>svg]:h-[14.59px] [&>svg]:w-[14.59px]"
                  style={{ background: r.tint, color: r.color }}
                >
                  {r.icon}
                </span>
                <span className="min-w-0 flex-[1_0_0] px-[6.49px] text-left">
                  <span className="block text-[11.36px] leading-[normal] font-bold text-ink">{r.t1}</span>
                  <span className="mt-[1.52px] block truncate text-[10.14px] leading-[normal] text-muted">
                    {v ? v.replace(/^https?:\/\//i, "") : r.sample}
                  </span>
                </span>
                <span className="shrink-0 text-faint [&>svg]:block [&>svg]:h-[13.78px] [&>svg]:w-[13.78px]">{chevron}</span>
              </div>
            );
          })}
        </div>
        {hours ? (
          <div className="mx-[15.33px] mt-[14.24px] mb-[18.62px] flex items-center justify-center gap-[5.48px] rounded-full bg-[#f1f3f6] p-[8.76px] text-[10.95px] leading-[normal] font-semibold text-prose [&>svg]:block [&>svg]:h-[14.78px] [&>svg]:w-[14.78px]">
            <svg {...svgProps}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span>
              <b className={`font-bold ${hours.isOpen ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{hours.isOpen ? "Open" : "Closed"}</b> · {hours.text}
            </span>
          </div>
        ) : (
          <div className="h-[18.62px]" />
        )}
      </Phone>
      <Sample>Example preview. Your details replace it as you type.</Sample>
    </PreviewCard>
  );
}
