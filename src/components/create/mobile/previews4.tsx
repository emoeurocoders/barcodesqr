"use client";

import type { ReactNode } from "react";
import { dialCodes } from "../fieldSchema";
import { isValidUrl } from "../validate";
import { designerTypeIcons } from "../designerTypeIcons";
import { BarCaret, BarText, PreviewCard, Sample, ScanNote } from "./previews";
import { splitPlace } from "./forms4";
import { useDesktop } from "./pageMode";

/**
 * The previews for batch 4 (Google Maps / email / Google Review / SMS), from
 * the same files. Sizes are their `.pvwCmp` ems (8.11px at 390). All four
 * phone cards run full width in their files (no `phnSlim`).
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

function Phone({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`relative mx-auto mt-[4.1px] overflow-hidden rounded-[17.8px] border border-mc-pv-line shadow-mc-phone ${className}`}>
      {children}
    </div>
  );
}

/** Their `.bar > .ico`: a glyph on a tinted disc. */
function BarIcon({ tint, children }: { tint: string; children: ReactNode }) {
  return (
    <i className="flex h-[35.7px] w-[35.7px] shrink-0 items-center justify-center rounded-full not-italic [&>svg]:block [&>svg]:h-[17.8px] [&>svg]:w-[17.8px]" style={{ background: tint }}>
      {children}
    </i>
  );
}

/* ---- Google Maps ----------------------------------------------------------- */

const SAMPLE_PLACE = { name: "Empire State Building", address: "20 W 34th St, New York, NY 10001" };

export function MapsPreview({ values, open, onToggle }: Props) {
  const picked = values.addressPicked === "1" && (values.address ?? "").trim();
  const place = picked ? splitPlace(values.address!) : SAMPLE_PLACE;
  const query = encodeURIComponent(picked ? values.address!.trim() : "Empire State Building, New York");
  const Pin = designerTypeIcons.location;

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="rgba(234, 67, 53, 0.08)">
            <Pin className="block h-[17.8px] w-[17.8px]" />
          </BarIcon>
          <BarText open={open} title="Your Google Maps Preview" base="Tap to view your location" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-white">
        {/* Their keyless embed. Loaded only while open, so a collapsed card
            costs nothing. */}
        {open && (
          <iframe
            key={query}
            src={`https://www.google.com/maps?q=${query}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map preview"
            className="block h-[235.3px] w-full border-0"
          />
        )}
        {!open && <div className="h-[235.3px]" />}
        <div className="absolute top-[8.1px] right-[8.1px] left-[8.1px] flex items-start rounded-[9.7px] bg-white px-[8.9px] py-[8.1px] shadow-mc-map-card">
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7.3px] bg-mc-map-pin-bg text-mc-map-pin [&>svg]:block [&>svg]:h-[13.8px] [&>svg]:w-[13.8px]">
            <svg {...svgProps}>
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="min-w-0 flex-1 pl-[7.3px] text-left">
            <span className="block text-[10.55px] leading-[normal] font-bold text-ink">{place.name}</span>
            {place.address && <span className="mt-[1.4px] block text-[9.33px] leading-[normal] text-muted">{place.address}</span>}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noopener"
              className="mt-[3.9px] inline-block text-[9.73px] leading-[normal] font-semibold text-primary"
            >
              View on Google Maps ↗
            </a>
          </span>
        </div>
      </Phone>
      <Sample>Example preview. Select your location to update the map.</Sample>
      <ScanNote>Scanning opens this location in Google Maps so customers can get directions, view details, and more.</ScanNote>
    </PreviewCard>
  );
}

/* ---- Email ----------------------------------------------------------------- */

export function EmailPreview({ values, open, onToggle }: Props) {
  const to = (values.to ?? "").trim() || "email@example.com";
  const subject = (values.subject ?? "").trim() || "Product Inquiry";
  const body = (values.body ?? "").trim() || "Hi there — I just scanned your QR code and wanted to learn more about your services.";
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="var(--color-mc-soft)">
            <svg {...svgProps} className="text-primary">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </BarIcon>
          <BarText open={open} title="Your Email Preview" base="See how your email will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-mc-eml-bg p-[11.4px]">
        <div className="overflow-hidden rounded-[9.7px] border border-mc-eml-line bg-white text-left shadow-mc-mail">
          <div className="flex items-center bg-mc-eml-bar px-[8.9px] py-[7.3px]">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <i key={c} className="mr-[4.1px] block h-[7.7px] w-[7.7px] rounded-full" style={{ background: c }} />
            ))}
            <span className="ml-auto flex h-[21.9px] w-[21.9px] items-center justify-center rounded-full bg-primary text-white [&>svg]:block [&>svg]:h-[10.5px] [&>svg]:w-[10.5px]">
              <svg {...svgProps}>
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                <path d="m21.854 2.147-10.94 10.939" />
              </svg>
            </span>
          </div>
          {[
            ["To:", to],
            ["Subject:", subject],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline border-b border-mc-sug-line px-[9.7px] py-[8.1px]">
              <span className="w-[52.6px] shrink-0 text-[9.73px] leading-[normal] text-muted">{k}</span>
              <span className="min-w-0 flex-1 text-[9.73px] leading-[normal] font-semibold break-words text-ink">{v}</span>
            </div>
          ))}
          <div className="px-[9.7px] pt-[8.9px] pb-[11.4px]">
            <p className="text-[9.73px] leading-[15.6px] break-words whitespace-pre-wrap text-body">{body}</p>
          </div>
        </div>
      </Phone>
      <Sample>Example preview. Your details update as you type.</Sample>
      <ScanNote>Scanning opens an email draft with your details pre-filled. Nothing is sent automatically.</ScanNote>
    </PreviewCard>
  );
}

/* ---- Google Review --------------------------------------------------------- */

/**
 * Neutral by design (JB): no stars, no Google marks. The file's bar shows
 * Google's "G"; the 2026-08-20 rule against Google's logo stands, so the bar
 * carries our own review glyph instead.
 */
export function ReviewPreview({ values, open, onToggle }: Props) {
  const url = (values.reviewUrl ?? "").trim();
  const href = url && isValidUrl(url) ? url : undefined;
  const Review = designerTypeIcons.review;
  // create_desktop_google_review.html: larger type, more air (`.pvwRev`).
  const desk = useDesktop();
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="rgba(220, 60, 42, 0.08)">
            <Review className="block h-[17.8px] w-[17.8px]" />
          </BarIcon>
          <BarText open={open} title="Your Google Review Preview" base="See how your review prompt looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className={`bg-[linear-gradient(180deg,var(--color-mc-rev-top)_0%,#ffffff_100%)] text-center ${desk ? "px-[16.22px] pt-[22.71px] pb-[21.09px]" : "px-[13px] pt-[16.2px] pb-[14.6px]"}`}>
        <div className="mx-auto flex h-[68.1px] w-[113.6px] items-center justify-center gap-[8.1px] rounded-[50%_50%_46%_46%/60%_60%_40%_40%] bg-white shadow-mc-rev">
          <span className="flex h-[35.7px] w-[35.7px] items-center justify-center rounded-[9.7px] bg-primary text-white [&>svg]:block [&>svg]:h-[19.5px] [&>svg]:w-[19.5px]">
            <svg {...svgProps}>
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
              <path d="M2 7h20" />
              <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2z" />
            </svg>
          </span>
          <span className="flex h-[27.6px] w-[27.6px] items-center justify-center rounded-[8.1px] bg-mc-note-line text-mc-rev-ink [&>svg]:block [&>svg]:h-[14.6px] [&>svg]:w-[14.6px]">
            <svg {...svgProps}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
        </div>
        {/* Their margins are in each element's own em, so they grow with
            desktop's larger type. */}
        <h5 className={`leading-[normal] font-bold text-ink ${desk ? "mt-[17.84px] text-[16.22px] tracking-[-0.16px]" : "mt-[14.3px] text-[12.98px] tracking-[-0.13px]"}`}>Share your experience</h5>
        <p className={`leading-[normal] text-muted ${desk ? "mt-[3.98px] text-[11.36px]" : "mt-[3.4px] text-[9.73px]"}`}>Your feedback helps this business.</p>
        {/* Live once the link is valid, as their script does. */}
        <a
          href={href ?? "#"}
          target={href ? "_blank" : undefined}
          rel="noopener"
          onClick={(e) => {
            if (!href) e.preventDefault();
          }}
          className={`mx-auto flex items-center justify-center bg-primary leading-[normal] font-semibold text-white [&>svg]:block ${
            desk
              ? "mt-[13.34px] max-w-[206.86px] gap-[7.3px] rounded-[12.17px] px-[12.17px] py-[10.34px] text-[12.17px] [&>svg]:h-[13.38px] [&>svg]:w-[13.38px]"
              : "mt-[12px] max-w-[175.3px] gap-[6.6px] rounded-[10.95px] px-[10.95px] py-[9.3px] text-[10.95px] [&>svg]:h-[12px] [&>svg]:w-[12px]"
          }`}
        >
          <svg {...svgProps}>
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          </svg>
          Write a Review
        </a>
        <p className={`leading-[normal] text-faint ${desk ? "mt-[8.76px] text-[9.73px]" : "mt-[8px] text-[8.92px]"}`}>Opens Google Reviews.</p>
      </Phone>
      <Sample>Example preview. The button uses your review link once it’s added.</Sample>
    </PreviewCard>
  );
}

/* ---- SMS ------------------------------------------------------------------- */

export function SmsPreview({ values, open, onToggle }: Props) {
  const n = (values.phone ?? "").trim();
  const code = (values.phoneCountry ?? dialCodes[0].value).split("-")[0];
  const number = n ? `${code} ${n}` : "+1 555 123 4567";
  const message = (values.message ?? "").trim() || "Hi! I just scanned your QR code and I'd love to hear more — can you fill me in?";
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="var(--color-mc-soft)">
            <svg {...svgProps} className="text-primary">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </BarIcon>
          <BarText open={open} title="Your SMS Preview" base="See how your text message will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="bg-mc-eml-bg text-center">
        <div className="bg-mc-sms-head px-[11.4px] pt-[13.8px] pb-[11.4px]">
          <span className="mx-auto flex h-[38.9px] w-[38.9px] items-center justify-center rounded-full bg-mc-sms-avatar text-white [&>svg]:block [&>svg]:h-[21.1px] [&>svg]:w-[21.1px]">
            <svg {...svgProps}>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <div className="mt-[7.1px] text-[12.98px] leading-[normal] font-bold text-ink">{number}</div>
        </div>
        <p className="mt-[12.2px] text-[10.14px] leading-[normal] text-mc-sms-meta">Text Message (Draft) · Today 9:41 AM</p>
        <div className="min-h-[69px] px-[11.4px] pt-[9.7px] text-right">
          <div className="inline-block max-w-[85%] rounded-[12.2px] rounded-br-[2.8px] bg-mc-sms-green px-[9.7px] py-[8.1px] text-left">
            <p className="text-[11.36px] leading-[17px] break-words text-white">{message}</p>
          </div>
        </div>
        <div className="flex items-center gap-[6.5px] px-[11.4px] pt-[10.5px] pb-[13.8px]">
          <span className="flex h-[27.6px] w-[27.6px] shrink-0 items-center justify-center rounded-full bg-mc-sms-plus text-mc-wa-icon [&>svg]:block [&>svg]:h-[13.8px] [&>svg]:w-[13.8px]">
            <svg {...svgProps}>
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </span>
          <span className="min-w-0 flex-1 rounded-full border border-mc-sms-line bg-white px-[12.7px] py-[7.9px] text-left text-[10.55px] leading-[normal] text-mc-sms-meta">
            Text Message (Draft)
          </span>
          <span className="flex h-[27.6px] w-[27.6px] shrink-0 items-center justify-center rounded-full bg-mc-sms-green text-white [&>svg]:block [&>svg]:h-[13.8px] [&>svg]:w-[13.8px]">
            <svg {...svgProps}>
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </span>
        </div>
      </Phone>
      <Sample>This is a preview of how your message will look. It is not sent yet.</Sample>
      <ScanNote>Scanning opens a text message ready to send. Nothing is sent automatically.</ScanNote>
    </PreviewCard>
  );
}
