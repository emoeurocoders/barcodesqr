"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { dialCodes } from "../fieldSchema";
import { fileSrc, parseStoredFile } from "../storedValues";
import { BarCaret, BarText, PreviewCard, Sample } from "./previews";
import { payProviders } from "./forms5";

/**
 * The previews for batch 5 (phone / plain text / payment / audio), from the
 * same files. Sizes are their computed values at 390, measured with the
 * preview open: `.pvwCmp` is 8.112px to the em, and each `.phn` sets its own.
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

/** Their `.bar > .ico`: a glyph on a tinted disc. */
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

/**
 * Their `.phn`, whose radius and top margin are ems of the phone's own font
 * size — so a preview that enlarges the type (`.pvwTel`, 1.25em) also gets a
 * rounder frame. Passed in rather than guessed.
 */
function Phone({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={`relative mx-auto overflow-hidden border border-mc-pv-line shadow-mc-phone ${className}`}>
      {children}
    </div>
  );
}

/* ---- Phone ----------------------------------------------------------------- */

const phoneGlyph = (
  <svg {...svgProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const keys: [string, string][] = [
  ["1", " "], ["2", "ABC"], ["3", "DEF"],
  ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
  ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"],
  ["*", " "], ["0", "+"], ["#", " "],
];

export function PhonePreview({ values, open, onToggle }: Props) {
  const n = (values.phone ?? "").trim();
  const code = (values.phoneCountry ?? dialCodes[0].value).split("-")[0];
  const number = n ? `${code} ${n}` : "+1 555 555 0123";
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="#e7f6ec" color="#16a34a">{phoneGlyph}</BarIcon>
          <BarText open={open} title="Your Phone Preview" base="See how your phone number will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="mt-[5.07px] rounded-[22.31px] bg-white px-[16.22px] py-[20.28px] text-center">
        <span className="mx-auto flex h-[46.64px] w-[46.64px] items-center justify-center rounded-full bg-[#22c55e] text-white [&>svg]:block [&>svg]:h-[21.28px] [&>svg]:w-[21.28px]">
          {phoneGlyph}
        </span>
        <p className="mt-[6.16px] text-[13.69px] leading-[19.16px] text-ink">Call</p>
        <div className="mt-[3.55px] text-[17.75px] leading-[23.07px] font-bold break-words text-ink">{number}</div>
        <div className="mt-[14.2px] grid grid-cols-[repeat(3,48.67px)] justify-center gap-x-[17.75px] gap-y-[9.63px]">
          {keys.map(([d, l]) => (
            <span key={d} className="flex h-[48.67px] w-[48.67px] flex-col items-center justify-center rounded-full bg-[#f3f4f6]">
              <span className="block text-[17.24px] leading-[17.24px] font-medium text-ink">{d}</span>
              <span className="mt-[2.84px] block text-[8.11px] leading-[8.11px] font-semibold tracking-[0.97px] text-muted">{l}</span>
            </span>
          ))}
        </div>
        <span className="mx-auto mt-[16.33px] flex h-[53.63px] w-[53.63px] items-center justify-center rounded-full bg-[#22c55e] text-white [&>svg]:block [&>svg]:h-[24.48px] [&>svg]:w-[24.48px]">
          {phoneGlyph}
        </span>
        <p className="mt-[6.16px] text-[13.69px] leading-[19.16px] text-ink">Call</p>
      </Phone>
      <Sample>This is a preview of the dialer. Scanning opens it without placing a call.</Sample>
    </PreviewCard>
  );
}

/* ---- Plain Text ------------------------------------------------------------ */

const noteGlyph = (
  <svg {...svgProps}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

const SAMPLE_NOTE =
  "Welcome to the workshop! 👋\n\nWi-Fi: CozyCornerWiFi\nSchedule: kickoff at 9:30, demos after lunch.\nParking: the garage on 5th St — first hour is free.\n\nQuestions? Find anyone in a teal lanyard.";

export function PlainTextPreview({ values, open, onToggle }: Props) {
  const title = (values.title ?? "").trim() || "Note";
  const body = (values.text ?? "").trim() || SAMPLE_NOTE;
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="#e9f0fb" color="#2563eb">{noteGlyph}</BarIcon>
          <BarText open={open} title="Your Text Preview" base="See how your message will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="mt-[4.06px] rounded-[17.85px] bg-[#f3f6fa] p-[11.36px]">
        <div className="overflow-hidden rounded-[9.73px] bg-white text-left shadow-[0_10px_24px_-18px_rgba(14,19,17,0.35)]">
          <div className="flex items-center gap-[7.3px] border-b border-[#eef1f6] px-[10.55px] py-[8.92px]">
            <i className="flex h-[24.33px] w-[24.33px] shrink-0 items-center justify-center rounded-[6.49px] bg-[#d9f0f7] text-[#0e7490] not-italic [&>svg]:block [&>svg]:h-[12.16px] [&>svg]:w-[12.16px]">
              {noteGlyph}
            </i>
            <span className="min-w-0 grow truncate text-[11.76px] leading-[15.29px] font-bold text-ink">{title}</span>
            <i className="block shrink-0 text-[#9aa3b2] not-italic [&>svg]:block [&>svg]:h-[12.97px] [&>svg]:w-[12.97px]">
              <svg {...svgProps}>
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
              </svg>
            </i>
          </div>
          <div className="p-[10.55px]">
            <p className="text-[8.52px] leading-[11.92px] font-semibold tracking-[0.51px] text-[#9aa3b2] uppercase">Today · 9:12 AM</p>
            {/* Line breaks kept, as typed (JB). */}
            <div className="mt-[8.21px] text-[10.95px] leading-[16.97px] break-words whitespace-pre-wrap text-ink">{body}</div>
            <a
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await navigator.clipboard.writeText(body);
                } catch {
                  /* clipboard blocked — still confirm, as their fallback does */
                }
                setCopied(true);
              }}
              className="mt-[13.14px] flex items-center justify-center gap-[6.57px] rounded-[10.95px] bg-[#111827] px-[10.95px] py-[9.31px] text-[10.95px] leading-[normal] font-semibold text-white [&>svg]:block [&>svg]:h-[13.14px] [&>svg]:w-[13.14px]"
            >
              <svg {...svgProps}>
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <span>{copied ? "Copied!" : "Copy text"}</span>
            </a>
          </div>
        </div>
      </Phone>
      <Sample>Example note. Your message replaces this as you type.</Sample>
    </PreviewCard>
  );
}

/* ---- Payment --------------------------------------------------------------- */

export function PaymentPreview({ values, open, onToggle }: Props) {
  const key = values.provider ?? "";
  const p = payProviders[key];
  const link = (values.paymentLink ?? "").trim();
  const live = /^https:\/\/[^\s]+\.[^\s]{2,}/i.test(link);
  // Their script writes "Secure Checkout" for no/other provider. JB: no
  // unverified security claims — so the file's own static line stands in.
  const heading = p && key !== "other" ? `Checkout on ${p.n}` : "Checkout on your provider’s page";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="rgba(124, 58, 237, 0.08)" color="#7C3AED">
            <svg {...svgProps}>
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" x2="22" y1="10" y2="10"></line>
            </svg>
          </BarIcon>
          <BarText open={open} title="Your Payment Preview" base="See where customers will pay" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="mt-[4.06px] rounded-[17.85px] bg-[#f6f8fb] px-[11.36px] py-[12.17px]">
        <div className="flex items-start text-left">
          <div className="min-w-0 flex-[1_0_0]">
            <div className="flex items-center gap-[4.87px]">
              <span
                className="flex h-[21.41px] w-[21.41px] shrink-0 items-center justify-center rounded-[5.84px] text-[9.73px] leading-[normal] font-extrabold text-white"
                style={{ background: p ? p.c : "#9aa3b2" }}
              >
                {p ? p.n.charAt(0) : "?"}
              </span>
              <span className="text-[10.95px] leading-[normal] font-semibold text-prose">
                Provider: <span>{p ? p.n : "—"}</span>
              </span>
            </div>
            <h5 className="mt-[13.06px] text-[18.66px] leading-[normal] font-bold tracking-[-0.19px] text-ink">{heading}</h5>
            <p className="mt-[4.79px] max-w-[179.48px] text-[11.97px] leading-[18.55px] text-muted">
              You’ll complete payment on your provider’s website.
            </p>
            <a
              href={live ? link : "#"}
              target="_blank"
              rel="noopener"
              onClick={(e) => {
                if (!live) e.preventDefault();
              }}
              className="mt-[12.05px] inline-flex items-center gap-[6.57px] rounded-[9.86px] bg-primary px-[13.14px] py-[8.76px] text-[10.95px] leading-[normal] font-semibold text-white [&>svg]:block [&>svg]:h-[12.03px] [&>svg]:w-[12.03px]"
            >
              Continue to Payment
              <svg {...svgProps}>
                <path d="M15 3h6v6"></path>
                <path d="M10 14 21 3"></path>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              </svg>
            </a>
          </div>
          <div className="w-[128.97px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/create/payment.svg" alt="" className="block w-full" />
          </div>
        </div>
      </Phone>
      <Sample>Example preview. The button opens your payment link once added.</Sample>
    </PreviewCard>
  );
}

/* ---- Audio ----------------------------------------------------------------- */

const noteMusic = (
  <svg {...svgProps}>
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const clock = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/**
 * Plays the uploaded file for real (their script does the same with a local
 * object URL; ours is the uploaded copy, so it survives Back/Next). Never
 * autoplays: nothing sounds until Play is pressed (JB).
 */
export function AudioPreview({ values, open, onToggle }: Props) {
  const stored = parseStoredFile(values.file ?? "");
  const src = fileSrc(stored);
  const fileName = stored?.name ?? "welcome-message.mp3";
  const title = (values.title ?? "").trim() || (stored ? stored.name.replace(/\.[^.]+$/, "") : "Welcome Message");

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <BarIcon tint="#eceafd" color="#6366f1">{noteMusic}</BarIcon>
          <BarText open={open} title="Your Audio Preview" base="See how your audio will appear" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="mt-[4.06px] rounded-[17.85px] bg-[#f6f8fb] p-[11.36px]">
        {/* Keyed on the file: a new file (or none) starts a fresh player at
            0:00, as their change and remove handlers reset it. */}
        <AudioCard key={src ?? "sample"} src={src} open={open} title={title} fileName={fileName} />
      </Phone>
      <Sample>Example preview. Your audio plays here once uploaded.</Sample>
    </PreviewCard>
  );
}

function AudioCard({
  src,
  open,
  title,
  fileName,
}: {
  src: string | undefined;
  open: boolean;
  title: string;
  fileName: string;
}) {
  const el = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(0);
  const [dur, setDur] = useState(0);

  // Collapsing the preview stops the sound; unmounting (leaving the step)
  // takes the element, and the sound, with it.
  useEffect(() => {
    if (!open) el.current?.pause();
  }, [open]);

  const pct = src ? (dur ? Math.min(100, (at / dur) * 100) : 0) : 12;

  return (
        <div className="relative rounded-[9.73px] bg-white p-[11.36px] text-left shadow-[0_10px_24px_-18px_rgba(14,19,17,0.35)]">
      <i className="absolute top-[9.73px] right-[8.11px] text-[#9aa3b2] not-italic [&>svg]:block [&>svg]:h-[13.78px] [&>svg]:w-[13.78px]">
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </i>
      {/* Their `.top` also picks up the step rail's `.top` padding (3.2 /
          4.9px) — a selector collision in their CSS, reproduced. */}
      <div className="flex items-center gap-[8.92px] pt-[3.24px] pr-[14.6px] pb-[4.87px]">
        <i className="flex h-[50.28px] w-[50.28px] shrink-0 items-center justify-center rounded-[8.92px] bg-[linear-gradient(135deg,#b4bdfc_0%,#818cf8_100%)] text-white not-italic [&>svg]:block [&>svg]:h-[21.89px] [&>svg]:w-[21.89px]">
          {noteMusic}
        </i>
        <div className="min-w-0 grow">
          <h5 className="truncate text-[12.17px] leading-[16.43px] font-bold text-ink">{title}</h5>
          <p className="mt-[2.33px] truncate text-[9.33px] leading-[13.06px] text-muted">{fileName}</p>
        </div>
      </div>
      <div className="mt-[11.36px] flex items-center gap-[8.92px]">
        <a
          href="#"
          aria-label={playing ? "Pause audio" : "Play audio"}
          onClick={(e) => {
            e.preventDefault();
            const a = el.current;
            if (!a || !src) return;
            if (a.paused) void a.play();
            else a.pause();
          }}
          className="flex h-[31.63px] w-[31.63px] shrink-0 items-center justify-center rounded-full bg-primary text-white [&>svg]:block [&>svg]:h-[12.16px] [&>svg]:w-[12.16px]"
        >
          {playing ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="5" y="4" width="4.5" height="16" rx="1"></rect>
              <rect x="14.5" y="4" width="4.5" height="16" rx="1"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3"></polygon>
            </svg>
          )}
        </a>
        <div className="min-w-0 grow">
          <div className="relative h-[4.06px] rounded-full bg-[#e5e9f1]">
            <span
              className="absolute top-0 bottom-0 left-0 rounded-full bg-primary after:absolute after:top-1/2 after:right-[-4.46px] after:h-[8.92px] after:w-[8.92px] after:-translate-y-1/2 after:rounded-full after:bg-primary after:content-['']"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-[4.68px] flex justify-between text-[8.52px] leading-[8.52px] text-muted">
            <span>{clock(src ? at : 0)}</span>
            <span>{src ? clock(dur) : "0:28"}</span>
          </div>
        </div>
      </div>
      {src && (
        <audio
          ref={el}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)}
          onTimeUpdate={(e) => setAt(e.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      )}
    </div>
  );
}
