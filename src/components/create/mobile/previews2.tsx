"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cropStyle, fileSrc, parseStoredFile } from "../storedValues";
import { BarCaret, BarText, PreviewCard, RowLink, Sample, hrefOf, qrGlyph } from "./previews";
import { usePageMode } from "./pageMode";
import { GALLERY_SHOW, WA_DEFAULT, galleryOf } from "./forms2";

/**
 * The collapsible previews for batch 2 (app link / PDF / image / WhatsApp),
 * from the same files. Sizes are their `.pvwCmp` ems (8.11px at 390).
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

/** Their `.phn`, widened where a preview sets `max-width: 100%`. */
function Phone({ className = "", children }: { className?: string; children: ReactNode }) {
  // As a hosted page the phone IS the screen: no frame.
  if (usePageMode()) return <div className={`relative min-h-[var(--qh)] overflow-hidden bg-white ${className}`}>{children}</div>;
  return (
    <div
      className={`relative mx-auto mt-[4.1px] overflow-hidden rounded-[17.8px] border border-mc-pv-line bg-white shadow-mc-phone ${className}`}
    >
      {children}
    </div>
  );
}

/* ---- App Link -------------------------------------------------------------- */

/**
 * As a hosted page this is what a desktop browser sees: a phone is sent
 * straight to its store by /q/<slug> and never renders it. Each store button
 * links to its listing; one without a link is left out.
 */
export function AppLinkPreview({ values, open, onToggle }: Props) {
  const page = usePageMode();
  const ring = "absolute block rounded-full border-mc-app-ring";
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          {/* Their `.ico2`: both store marks on a grey pill. */}
          <span className="flex shrink-0 items-center gap-[4.9px] rounded-[10.5px] bg-mc-well px-[5.3px] py-[4.5px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/create/appstore.svg" alt="App Store" className="block h-[26.8px] w-[26.8px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/create/googleplay.svg" alt="Google Play" className="block h-[26.8px] w-[26.8px]" />
          </span>
          <BarText open={open} title="Your App Link Preview" base="See how your QR code looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="max-w-[243.4px] pb-[16.2px]">
        <i className={`${ring} -top-[36.5px] -left-[36.5px] h-[105.5px] w-[105.5px] border-[16.2px]`} />
        <i className={`${ring} -top-[20.3px] -right-[36.5px] h-[97.3px] w-[97.3px] border-[17.8px]`} />
        <i className={`${ring} -bottom-[48.7px] -left-[24.3px] h-[121.7px] w-[121.7px] border-[17.8px]`} />
        <i className={`${ring} -right-[32.4px] -bottom-[28.4px] h-[97.3px] w-[97.3px] border-[14.6px]`} />
        <div className="relative mx-auto mt-[24.3px] flex h-[51.9px] w-[51.9px] items-center justify-center rounded-[13px] bg-white text-primary-dark shadow-mc-app-icon [&>svg]:block [&>svg]:h-[26px] [&>svg]:w-[26px]">
          {qrGlyph}
        </div>
        <div className="relative mx-[13px] mt-[16.2px] rounded-[13px] bg-white p-[13px] shadow-mc-app-card">
          <i className="mx-auto block h-[4.9px] w-[38%] rounded-full bg-mc-app-bar" />
          <i className="mx-auto mt-[6.5px] block h-[4.9px] w-[60%] rounded-full bg-mc-app-bar-2" />
          {[
            {
              href: hrefOf(values.iosUrl ?? ""),
              s1: "Download on the",
              s2: "App Store",
              icon: (
                <svg {...svgProps}>
                  <path d="M12 15V3" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="m7 10 5 5 5-5" />
                </svg>
              ),
            },
            {
              href: hrefOf(values.androidUrl ?? ""),
              s1: "Get it on",
              s2: "Google Play",
              icon: (
                <svg {...svgProps} fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              ),
            },
          ].filter((st) => !page || st.href).map((st, i) => (
            <RowLink
              href={page ? st.href : undefined}
              key={st.s2}
              className={`flex items-center justify-center gap-[7.3px] rounded-full bg-mc-app-store px-[11.4px] py-[6.5px] [&>svg]:block [&>svg]:h-[14.6px] [&>svg]:w-[14.6px] [&>svg]:shrink-0 [&>svg]:text-ink ${
                i ? "mt-[8.9px]" : "mt-[13px]"
              }`}
            >
              {st.icon}
              <span className="text-left">
                <span className="block text-[6.9px] leading-[normal] text-prose">{st.s1}</span>
                <span className="mt-[1px] block text-[10.14px] leading-[normal] font-semibold text-ink">{st.s2}</span>
              </span>
            </RowLink>
          ))}
        </div>
      </Phone>
      <Sample>This is a preview of your app download page.</Sample>
    </PreviewCard>
  );
}

/* ---- PDF ------------------------------------------------------------------- */

export function PdfPreview({ values, open, onToggle }: Props) {
  const hosted = usePageMode();
  const stored = parseStoredFile(values.file ?? "");
  const url = fileSrc(stored);
  const pages = Number((stored as { pages?: number } | null)?.pages) || 1;
  const [page, setPage] = useState(1);
  const cur = Math.min(page, pages);

  const nav =
    "flex h-[24.3px] w-[24.3px] items-center justify-center rounded-full border border-mc-acc-line bg-white text-body shadow-mc-nav [&>svg]:block [&>svg]:h-[11.4px] [&>svg]:w-[11.4px]";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <span className="block h-[35.7px] w-[35.7px] shrink-0 overflow-hidden rounded-[8.1px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/create/pdf.svg" alt="" className="block h-full w-full object-cover" />
          </span>
          <BarText open={open} title="Your PDF Preview" base="Tap to view your document" />
          <BarCaret open={open} />
        </>
      }
    >
      {/* Their `.pvwPdf` is the one phone card at full width. */}
      <Phone className="max-w-full px-[11.4px] pt-[13px] pb-[12.2px]">
        <div className="mx-auto max-w-[227.1px]">
          {url ? (
            // Their embed. Phones' built-in viewers mostly ignore `#page`
            // and some show nothing inline — hence the link inside it.
            <object
              key={`${url}-${cur}`}
              type="application/pdf"
              data={`${url}#toolbar=0&navpanes=0&page=${cur}`}
              className="block aspect-[3/4] w-full rounded-[8.9px] border border-mc-acc-line shadow-mc-doc"
            >
              <a href={url} target="_blank" rel="noreferrer" className="flex aspect-[3/4] items-center justify-center text-[10.14px] font-semibold text-primary">
                Open the PDF
              </a>
            </object>
          ) : (
            <div className="flex aspect-[3/4] flex-col items-center justify-center gap-[8.1px] rounded-[8.9px] border-2 border-dashed border-mc-pdf-line bg-mc-row p-[12.2px] shadow-mc-doc">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/create/pdf.svg" alt="" className="block h-[34.1px] w-[34.1px] rounded-[8.1px]" />
              <span className="text-center text-[9.73px] leading-[14.6px] font-medium text-muted">
                Upload a PDF to preview your document here
              </span>
            </div>
          )}
        </div>
        <div className="mt-[11.4px] flex items-center justify-center gap-[13px]">
          <a href="#" aria-label="Previous page" className={nav} onClick={(e) => { e.preventDefault(); if (url) setPage(Math.max(1, cur - 1)); }}>
            <svg {...svgProps}><path d="m15 18-6-6 6-6" /></svg>
          </a>
          <span className="min-w-[40.6px] text-center text-[10.14px] leading-[normal] font-semibold text-ink">
            {url ? `${cur} / ${pages}` : "– / –"}
          </span>
          <a href="#" aria-label="Next page" className={nav} onClick={(e) => { e.preventDefault(); if (url) setPage(Math.min(pages, cur + 1)); }}>
            <svg {...svgProps}><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </Phone>
      {/* Phones' built-in viewers often show a PDF poorly inline, or not at
          all; the page needs a sure way in. Unmocked. */}
      {hosted && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="mx-[11.4px] mb-[12.2px] flex items-center justify-center rounded-full bg-primary px-[11.4px] py-[9.7px] text-[11.36px] leading-[normal] font-semibold text-white"
        >
          Open PDF
        </a>
      )}
      <Sample>Your uploaded document appears here. No sample is shown as your file.</Sample>
    </PreviewCard>
  );
}

/* ---- Image gallery --------------------------------------------------------- */

const sampleGallery = [
  "/previews/sunset-hearts.jpg",
  "/previews/cafe.jpg",
  "/previews/food.jpg",
  "/previews/team.jpg",
  "/previews/portrait.jpg",
  "/previews/video-thumb.jpg",
];

export function ImagePreview({ values, open, onToggle }: Props) {
  const page = usePageMode();
  // Desktop's Image form keeps one picture under `file`, no gallery.
  const gallery = galleryOf(values);
  const single = parseStoredFile(values.file ?? "");
  const files = gallery.length ? gallery : single ? [single] : [];
  const mine = files.map((f) => f.url ?? f.dataUrl ?? "");
  const list = mine.length ? mine : sampleGallery;
  /** The uploaded picture's framing; samples stay centred. */
  const fit = (j: number): React.CSSProperties =>
    files[j] ? cropStyle(files[j]) : { objectFit: "cover" };
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const show = (e: Event) => setIdx((e as CustomEvent<number>).detail);
    window.addEventListener(GALLERY_SHOW, show);
    return () => window.removeEventListener(GALLERY_SHOW, show);
  }, []);
  const i = idx < list.length ? idx : 0;
  const title = (values.title ?? "").trim() || (page ? "" : "Summer Memories");
  const touchX = useRef<number | null>(null);
  const step = (by: number) => setIdx((i + by + list.length) % list.length);

  const nav =
    "absolute top-1/2 flex h-[21.9px] w-[21.9px] -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-body shadow-mc-gal-nav [&>svg]:block [&>svg]:h-[11.4px] [&>svg]:w-[11.4px]";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <span className="block h-[35.7px] w-[35.7px] shrink-0 overflow-hidden rounded-[8.1px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={list[0]} alt="" className="block h-full w-full" style={fit(0)} />
          </span>
          <BarText open={open} title="Your Image Preview" base="See how your gallery looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="max-w-[243.4px] pb-[13px]">
        <div
          className="relative mx-[8.1px] mt-[8.1px] h-[113.6px] overflow-hidden rounded-[9.7px]"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={list[i]} alt="" className="block h-full w-full" style={fit(i)} />
          {list.length > 1 && (
            <>
              <a href="#" aria-label="Previous image" className={`${nav} left-[6.5px]`} onClick={(e) => { e.preventDefault(); step(-1); }}>
                <svg {...svgProps}><path d="m15 18-6-6 6-6" /></svg>
              </a>
              <a href="#" aria-label="Next image" className={`${nav} right-[6.5px]`} onClick={(e) => { e.preventDefault(); step(1); }}>
                <svg {...svgProps}><path d="m9 18 6-6-6-6" /></svg>
              </a>
            </>
          )}
          <span className="absolute bottom-[7.3px] left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-[8.1px] py-[2.1px] text-[8.52px] leading-[normal] font-semibold whitespace-nowrap text-white">
            {i + 1} / {list.length}
          </span>
        </div>
        {title && (
          <h5 className="mx-[13.1px] mt-[12.5px] text-left text-[11.36px] leading-[normal] font-bold tracking-[-0.11px] text-ink">
            {title}
          </h5>
        )}
        <div className="flex gap-[5.7px] px-[13px] pt-[8.9px]">
          {list.slice(0, 5).map((src, j) => (
            <span
              key={j}
              onClick={() => setIdx(j)}
              className={`block h-[29.2px] w-[29.2px] shrink-0 cursor-pointer overflow-hidden rounded-[7.3px] border-2 ${
                j === i ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="block h-full w-full" style={fit(j)} />
            </span>
          ))}
          {list.length > 5 && (
            <span className="flex h-[29.2px] w-[29.2px] shrink-0 items-center justify-center rounded-[7.3px] border-2 border-transparent bg-mc-well">
              <span className="text-[8.92px] leading-[normal] font-bold text-prose">+{list.length - 5}</span>
            </span>
          )}
        </div>
      </Phone>
      <Sample>Example preview. Your uploaded images replace this gallery.</Sample>
    </PreviewCard>
  );
}

/* ---- WhatsApp -------------------------------------------------------------- */

export function WhatsAppPreview({ values, open, onToggle }: Props) {
  const message = (values.message ?? "").trim() || WA_DEFAULT;
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <i className="flex h-[35.7px] w-[35.7px] shrink-0 items-center justify-center rounded-full bg-mc-wa-brand not-italic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/create/soc/whatsapp.svg" alt="" className="block h-[19.5px] w-[19.5px]" />
          </i>
          <BarText open={open} title="Your WhatsApp Preview" base="See how your chat opens" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="max-w-[243.4px] bg-mc-wa-bg">
        <div className="flex items-center bg-mc-wa-head px-[9.7px] py-[8.1px]">
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-mc-wa-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/create/soc/whatsapp.svg" alt="" className="block h-[15.4px] w-[15.4px]" />
          </span>
          <span className="min-w-0 flex-1 pr-[8.1px] pl-[6.5px] text-left">
            <span className="block truncate text-[10.14px] leading-[normal] font-bold text-white">Cafe Bella</span>
            <span className="mt-[0.8px] block text-[8.11px] leading-[normal] text-white/85">online</span>
          </span>
          <span className="flex shrink-0 items-center gap-[9.7px] text-white [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]">
            <svg {...svgProps}>
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
            <svg {...svgProps}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <svg {...svgProps}>
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="min-h-[73px] px-[10.5px] pt-[12.2px] pb-[8.9px] text-left">
          <div className="inline-block max-w-[88%] rounded-[8.1px] rounded-tl-[2.4px] bg-mc-wa-bubble px-[8.1px] pt-[6.9px] pb-[4.1px] shadow-mc-bubble">
            <p className="text-[9.33px] leading-[14px] break-words text-mc-wa-ink">{message}</p>
            <span className="mt-[2.7px] flex items-center justify-end gap-[2.7px] text-[7.71px] leading-[normal] text-mc-wa-time [&>svg]:block [&>svg]:h-[9.6px] [&>svg]:w-[9.6px] [&>svg]:text-mc-wa-tick">
              10:24
              <svg {...svgProps}>
                <path d="M2 12.5 7 17.5 17.5 7" />
                <path d="m11.5 15.5 2 2L22 9" />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[5.7px] px-[9.7px] pb-[12.2px]">
          <span className="flex shrink-0 text-mc-wa-icon [&>svg]:block [&>svg]:h-[13.8px] [&>svg]:w-[13.8px]">
            <svg {...svgProps}>
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-[5.7px] rounded-full bg-white px-[8.9px] py-[6.1px] [&>svg]:block [&>svg]:h-[11px] [&>svg]:w-[11px] [&>svg]:shrink-0 [&>svg]:text-mc-wa-icon">
            <span className="flex-1 text-left text-[8.92px] leading-[normal] text-mc-wa-hint">Message</span>
            <svg {...svgProps}>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" x2="9.01" y1="9" y2="9" />
              <line x1="15" x2="15.01" y1="9" y2="9" />
            </svg>
            <svg {...svgProps}>
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </span>
          <span className="flex h-[25.1px] w-[25.1px] shrink-0 items-center justify-center rounded-full bg-mc-wa-send text-white [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]">
            <svg {...svgProps} fill="currentColor" strokeWidth="1">
              <path d="M6 4.5 20 12 6 19.5 7.8 12z" />
            </svg>
          </span>
        </div>
      </Phone>
      <Sample>Example preview. Your number and message replace this as you type.</Sample>
    </PreviewCard>
  );
}
