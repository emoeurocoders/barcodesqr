"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

import { allTypes } from "@/components/create/qrTypes";
import type { Ranked, Stats } from "@/lib/stats";
import { MenuButton } from "./MembersShell";

/**
 * member_stats.html, on real scans (JB, 2026-11-18). Range and filter are
 * the page's URL (?days=, ?qr=), so a refresh or a shared link shows the
 * same view. Their Chart.js line chart is drawn here as SVG: two series,
 * the same colours, grid, ticks and legend.
 */

const BLUE = "#2563eb";
const TEAL = "#11b1a7";

const sv17 = {
  width: 17,
  height: 17,
  viewBox: "0 0 17 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
} as const;
const st17 = (color: string) =>
  ({
    stroke: color,
    strokeWidth: 1.41667,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }) as const;

const typeLabel = (t: string) =>
  allTypes.find((x) => x.value === t)?.label ?? t;

/* ---- Bar --------------------------------------------------------------------- */

const calendar = (
  <svg {...sv17} className="mr-[9px] h-[17px] w-[17px] shrink-0">
    <path
      d="M13.4583 2.83333H3.54167C2.75926 2.83333 2.125 3.4676 2.125 4.25V14.1667C2.125 14.9491 2.75926 15.5833 3.54167 15.5833H13.4583C14.2407 15.5833 14.875 14.9491 14.875 14.1667V4.25C14.875 3.4676 14.2407 2.83333 13.4583 2.83333Z"
      {...st17("#6B7280")}
    />
    <path d="M2.125 7.08333H14.875" {...st17("#6B7280")} />
    <path d="M5.66667 1.41667V4.25" {...st17("#6B7280")} />
    <path d="M11.3333 1.41667V4.25" {...st17("#6B7280")} />
  </svg>
);
const funnel = (
  <svg {...sv17} className="mr-[9px] h-[17px] w-[17px] shrink-0">
    <path d="M2.125 4.25H14.875" {...st17("#6B7280")} />
    <path d="M4.25 8.5H12.75" {...st17("#6B7280")} />
    <path d="M6.375 12.75H10.625" {...st17("#6B7280")} />
  </svg>
);
const chevron = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ml-[11px] h-[15px] w-[15px] shrink-0"
  >
    <path
      d="M3.75 5.625L7.5 9.375L11.25 5.625"
      stroke="#6B7280"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Their `.sel`, as a real <select> laid over it so keyboards and phones work. */
function Sel({
  icon,
  value,
  label,
  onChange,
  children,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="relative flex h-[46px] cursor-pointer items-center rounded-[10px] border border-[#d1d5db] bg-white px-[11px]">
      {icon}
      <span className="text-[14.5px] font-medium whitespace-nowrap text-[#374151]">
        {label}
      </span>
      {chevron}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {children}
      </select>
    </label>
  );
}

/* ---- Chart ------------------------------------------------------------------- */

const short = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

function niceMax(v: number) {
  if (v <= 10) return 10;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

/**
 * Laid out on Chart.js's measured geometry in the mockup (main.js options,
 * rendered at 1440): plot inset 37px left, 23px right, 15px top, 226.5px
 * tall; gridlines start 26px left of the plot (Chart.js tick marks); y
 * labels right-aligned 20px in; an x label on every third day.
 */
const PL = 37;
const PR = 23;
const PT = 15;
const PH = 226.5;
const at = (f: number) => `calc(${PL}px + (100% - ${PL + PR}px) * ${f})`;

/**
 * Which days get a date label, by the chart's own width (JB, 2026-11-19):
 * desktop keeps the mockup's every third day of 30 (11 labels); tablet
 * shows 6–8 and phones 3–5. Labels are evenly spaced — a fixed step, first
 * day to last where the range divides, otherwise counted back from today —
 * and never closer than a label's width. Every point and line is still
 * drawn; only labels are dropped.
 */
const MIN_GAP = 56; // "Nov 18" at 12px is ~38px wide, plus air
function labelled(n: number, width: number): number[] {
  const [lo, hi] = width >= 900 ? [9, 11] : width >= 560 ? [6, 8] : [3, 5];
  const last = n - 1;
  if (last < 1) return [0];
  const per = (width - PL - PR) / last; // px between neighbouring days
  for (let m = Math.min(hi, n); m >= Math.min(lo, n); m--) {
    if (m > 1 && last % (m - 1) === 0 && per * (last / (m - 1)) >= MIN_GAP) {
      return Array.from({ length: m }, (_, k) => (k * last) / (m - 1));
    }
  }
  let step = Math.max(1, Math.ceil(last / (hi - 1)));
  while (per * step < MIN_GAP && step < last) step++;
  const out: number[] = [];
  for (let i = last; i >= 0; i -= step) out.unshift(i);
  return out;
}

function Chart({ series }: { series: Stats["series"] }) {
  const box = useRef<HTMLDivElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  // A tap pins the day's numbers until the next tap elsewhere (touch has
  // no hover); a mouse shows them while it is over the chart.
  const [pinned, setPinned] = useState(false);
  // Measured, not guessed from the viewport: no labels until it is known,
  // so a phone never paints the desktop set first.
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!pinned) return;
    const away = (e: PointerEvent) => {
      if (!plot.current?.contains(e.target as Node)) {
        setPinned(false);
        setHover(null);
      }
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [pinned]);
  const max = niceMax(Math.max(0, ...series.map((d) => d.scans)));
  const step = max / 5;
  const last = Math.max(1, series.length - 1);
  const fx = (i: number) => i / last;
  const fy = (v: number) => 1 - v / max;
  const shown = new Set(width === null ? [] : labelled(series.length, width));
  const line = (k: "scans" | "uniques") =>
    series
      .map(
        (d, i) =>
          `${i ? "L" : "M"}${(fx(i) * 1000).toFixed(2)},${(fy(d[k]) * 100).toFixed(3)}`,
      )
      .join(" ");
  const pick = (clientX: number) => {
    const r = plot.current?.getBoundingClientRect();
    if (!r) return;
    setHover(
      Math.max(
        0,
        Math.min(
          series.length - 1,
          Math.round(((clientX - r.left) / r.width) * last),
        ),
      ),
    );
  };
  return (
    <div
      ref={box}
      className="relative mt-[16px] h-[310px] text-[12px] leading-[12px] text-[#9ca3af]"
    >
      {Array.from({ length: 6 }, (_, k) => (
        <div key={k}>
          <i
            className="absolute left-[11px] h-px bg-[#e2e6ec]"
            style={{ right: PR, top: PT + PH * (1 - k / 5) - 0.5 }}
          />
          <span
            className="absolute left-0 w-[21px] -translate-y-1/2 text-right"
            style={{ top: PT + PH * (1 - k / 5) }}
          >
            {Math.round(k * step)}
          </span>
        </div>
      ))}
      {series.map((d, i) =>
        shown.has(i) ? (
          <span
            key={d.day}
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: at(fx(i)), top: PT + PH + 12.5 }}
          >
            {short(d.day)}
          </span>
        ) : null,
      )}
      <div
        ref={plot}
        className="absolute outline-none focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563eb]"
        style={{ left: PL, right: PR, top: PT, height: PH }}
        tabIndex={0}
        aria-label="Scans per day. Use the arrow keys to read each day."
        onPointerDown={(e) => {
          pick(e.clientX);
          if (e.pointerType !== "mouse") setPinned(true);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") pick(e.clientX);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse" && !pinned) setHover(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const d = e.key === "ArrowRight" ? 1 : -1;
            setHover((h) =>
              Math.max(
                0,
                Math.min(
                  series.length - 1,
                  h === null ? (d > 0 ? 0 : series.length - 1) : h + d,
                ),
              ),
            );
          } else if (e.key === "Escape") setHover(null);
        }}
        onBlur={() => {
          if (!pinned) setHover(null);
        }}
      >
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <path
            d={line("uniques")}
            fill="none"
            stroke={TEAL}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={line("scans")}
            fill="none"
            stroke={BLUE}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {hover !== null && (
          <>
            {(["uniques", "scans"] as const).map((k) => (
              <i
                key={k}
                className="absolute h-[6px] w-[6px] -translate-1/2 rounded-full"
                style={{
                  left: `${fx(hover) * 100}%`,
                  top: `${fy(series[hover][k]) * 100}%`,
                  background: k === "scans" ? BLUE : TEAL,
                }}
              />
            ))}
            <div
              role="status"
              className="pointer-events-none absolute top-[6px] z-10 rounded-[6px] bg-[rgba(0,0,0,0.8)] p-[6px] text-[12px] leading-[normal] whitespace-nowrap text-white"
              style={{
                left: `${fx(hover) * 100}%`,
                transform:
                  hover > series.length / 2
                    ? "translateX(calc(-100% - 10px))"
                    : "translateX(10px)",
              }}
            >
              <b className="mb-[6px] block font-bold">
                {short(series[hover].day)}
              </b>
              {(["scans", "uniques"] as const).map((k) => (
                <span key={k} className="mt-[2px] flex items-center gap-[4px]">
                  <i
                    className="h-[12px] w-[12px] border border-white"
                    style={{ background: k === "scans" ? BLUE : TEAL }}
                  />
                  {k === "scans" ? "Total Scans" : "Unique Scans"}:{" "}
                  {series[hover][k]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="absolute inset-x-0 top-[284px] flex justify-center gap-[12px] text-[13px] leading-[16px] text-[#6b7280]">
        {[
          ["Total Scans", BLUE],
          ["Unique Scans", TEAL],
        ].map(([l, c]) => (
          <span key={l} className="flex items-center gap-[3px]">
            <i
              className="h-[2px] w-[19px] translate-y-[1.5px]"
              style={{ background: c }}
            />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** In the chart's place, same height, for a code we cannot count. Unmocked. */
function Unavailable() {
  return (
    <div className="mt-[16px] flex h-[310px] flex-col items-center justify-center rounded-[12px] bg-[#f8fafc] px-[24px] text-center">
      <p className="text-[15px] font-semibold text-[#374151]">
        Tracking unavailable
      </p>
      <p className="mt-[6px] max-w-[420px] text-[13.5px] leading-[1.45] text-[#6b7280]">
        This QR code opens its content directly, without passing through
        BarcodesQR, so its scans can’t be counted.
      </p>
    </div>
  );
}

const UNIQUE_TIP =
  "Unique Scans are an estimate of the different devices that scanned each QR code on each day — not distinct people across the whole period. The same phone scanning on two different days counts twice.";

/**
 * "What does Unique mean" (JB, 2026-11-19). Unmocked: their info-note
 * glyph (lucide Info, as the creator's notes use) beside the label; opens on
 * hover, focus or tap, closes on Esc or a tap elsewhere. The bubble spans
 * the card, so it never runs off a phone screen.
 */
function UniqueInfo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <span
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="What are unique scans?"
        aria-expanded={open}
        aria-describedby={open ? "unique-tip" : undefined}
        // Opens, never toggles: a phone's tap fires mouseenter and focus
        // (both open) before this click, which would otherwise shut it.
        // Closing is Esc, a tap elsewhere, blur or the mouse leaving.
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="ml-[5px] inline-flex h-[14px] w-[14px] items-center justify-center align-[-2px] leading-none text-[#9ca3af] hover:text-[#6b7280]"
      >
        <Info className="h-[14px] w-[14px]" strokeWidth={2} />
      </button>
      {open && (
        <span
          id="unique-tip"
          role="tooltip"
          className="absolute inset-x-[12px] top-[calc(100%+6px)] z-20 rounded-[8px] bg-[rgba(14,19,17,0.92)] px-[12px] py-[10px] text-[12.5px] leading-[1.45] font-normal whitespace-normal text-white shadow-[0_6px_20px_rgba(14,19,17,0.18)]"
        >
          {UNIQUE_TIP}
        </span>
      )}
    </span>
  );
}

/* ---- Panels ------------------------------------------------------------------ */

const rowBg = ["bg-[#eff4ff]", "bg-[#f8effd]", "bg-[#fff2e9]"];
const rowFg = ["#2563EB", "#9333EA", "#EA580C"];
const devBg = ["bg-[#eff4ff]", "bg-[#e6f7f5]", "bg-[#f8effd]"];
const devFg = ["#2563EB", "#0D8A82", "#9333EA"];

const deviceIcon = (label: string, color: string) =>
  label === "Desktop" ? (
    <svg {...sv17}>
      <path
        d="M14.1667 2.83333H2.83333C2.05093 2.83333 1.41667 3.4676 1.41667 4.25V10.625C1.41667 11.4074 2.05093 12.0417 2.83333 12.0417H14.1667C14.9491 12.0417 15.5833 11.4074 15.5833 10.625V4.25C15.5833 3.4676 14.9491 2.83333 14.1667 2.83333Z"
        {...st17(color)}
      />
      <path d="M5.66667 14.875H11.3333" {...st17(color)} />
      <path d="M8.5 12.0417V14.875" {...st17(color)} />
    </svg>
  ) : label === "Tablet" ? (
    <svg {...sv17}>
      <path
        d="M12.3958 1.41667H4.60417C3.62616 1.41667 2.83333 2.2095 2.83333 3.1875V13.8125C2.83333 14.7905 3.62616 15.5833 4.60417 15.5833H12.3958C13.3738 15.5833 14.1667 14.7905 14.1667 13.8125V3.1875C14.1667 2.2095 13.3738 1.41667 12.3958 1.41667Z"
        {...st17(color)}
      />
      <path d="M7.79167 13.1042H9.20833" {...st17(color)} />
    </svg>
  ) : (
    <svg {...sv17}>
      <path
        d="M10.9792 1.41667H6.02083C5.04283 1.41667 4.25 2.2095 4.25 3.1875V13.8125C4.25 14.7905 5.04283 15.5833 6.02083 15.5833H10.9792C11.9572 15.5833 12.75 14.7905 12.75 13.8125V3.1875C12.75 2.2095 11.9572 1.41667 10.9792 1.41667Z"
        {...st17(color)}
      />
      <path d="M7.79167 13.1042H9.20833" {...st17(color)} />
    </svg>
  );
const pinIcon = (color: string) => (
  <svg {...sv17}>
    <path
      d="M8.5 15.5833C8.5 15.5833 14.1667 11.3333 14.1667 7.08333C14.1667 5.58044 13.5696 4.1391 12.5069 3.0764C11.4442 2.01369 10.0029 1.41667 8.5 1.41667C6.99711 1.41667 5.55577 2.01369 4.49306 3.0764C3.43036 4.1391 2.83333 5.58044 2.83333 7.08333C2.83333 11.3333 8.5 15.5833 8.5 15.5833Z"
      {...st17(color)}
    />
    <path
      d="M8.5 9.20833C9.6736 9.20833 10.625 8.25694 10.625 7.08333C10.625 5.90973 9.6736 4.95833 8.5 4.95833C7.3264 4.95833 6.375 5.90973 6.375 7.08333C6.375 8.25694 7.3264 9.20833 8.5 9.20833Z"
      {...st17(color)}
    />
  </svg>
);
const globeIcon = (color: string) => (
  <svg {...sv17}>
    <circle cx="8.5" cy="8.5" r="6.375" {...st17(color)} />
    <path d="M2.125 8.5H14.875" {...st17(color)} />
    <path
      d="M8.5 2.125C10.0938 3.87 11 6.14 11 8.5C11 10.86 10.0938 13.13 8.5 14.875C6.90625 13.13 6 10.86 6 8.5C6 6.14 6.90625 3.87 8.5 2.125Z"
      {...st17(color)}
    />
  </svg>
);
const linkIcon = (color: string) => (
  <svg {...sv17}>
    <path
      d="M7.08333 9.20833C7.38754 9.61504 7.77565 9.95155 8.22137 10.195C8.66709 10.4385 9.1599 10.5831 9.66657 10.6194C10.1732 10.6556 10.6818 10.5826 11.1577 10.4052C11.6336 10.2277 12.0658 9.95 12.425 9.59083L14.55 7.46583C15.1951 6.79789 15.5521 5.90328 15.544 4.97475C15.5359 4.04622 15.1635 3.15799 14.5069 2.5014C13.8503 1.84481 12.9621 1.47237 12.0335 1.46431C11.105 1.45624 10.2104 1.81318 9.54249 2.45833L8.32416 3.66958"
      {...st17(color)}
    />
    <path
      d="M9.91667 7.79167C9.61246 7.38496 9.22435 7.04845 8.77863 6.80498C8.33291 6.56151 7.8401 6.41687 7.33343 6.38059C6.82676 6.3443 6.31822 6.41741 5.84232 6.59484C5.36642 6.77228 4.93424 7.05001 4.575 7.40917L2.45 9.53417C1.80485 10.2021 1.44791 11.0967 1.45598 12.0253C1.46404 12.9538 1.83648 13.842 2.49307 14.4986C3.14966 15.1552 4.03789 15.5276 4.96642 15.5357C5.89495 15.5438 6.78956 15.1868 7.4575 14.5417L8.66875 13.3304"
      {...st17(color)}
    />
  </svg>
);

/** The designer's round flags (member_stats.html), clip ids made unique per row. */
const designerFlags: Record<string, (id: string) => ReactNode> = {
  GB: (id) => (
    <>
      <clipPath id={id}>
        <circle cx="15" cy="15" r="15" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="30" height="30" fill="#012169" />
        <path d="M0 0L30 30M30 0L0 30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0 0L30 30M30 0L0 30" stroke="#C8102E" strokeWidth="2.4" />
        <path d="M15 0V30M0 15H30" stroke="#ffffff" strokeWidth="10" />
        <path d="M15 0V30M0 15H30" stroke="#C8102E" strokeWidth="6" />
      </g>
    </>
  ),
  US: (id) => (
    <>
      <clipPath id={id}>
        <circle cx="15" cy="15" r="15" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="30" height="30" fill="#ffffff" />
        <path
          d="M0 1.15H30M0 5.77H30M0 10.38H30M0 15H30M0 19.62H30M0 24.23H30M0 28.85H30"
          stroke="#B22234"
          strokeWidth="2.31"
        />
        <rect width="14" height="16.15" fill="#3C3B6E" />
      </g>
    </>
  ),
  TH: (id) => (
    <>
      <clipPath id={id}>
        <circle cx="15" cy="15" r="15" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="30" height="30" fill="#ffffff" />
        <rect width="30" height="5" fill="#A51931" />
        <rect width="30" height="10" y="10" fill="#2D2A4A" />
        <rect width="30" height="5" y="25" fill="#A51931" />
      </g>
    </>
  ),
};

/**
 * Round flag in their 30px `.ico.flg` circle: the designer's SVG where they
 * drew one, otherwise the emoji flag (font-flags) — unmocked, flagged in
 * LAUNCH.md — and a globe for an unknown country.
 */
const flag = (code: string) => {
  const own = designerFlags[code];
  if (own)
    return (
      <span className="flex h-[30px] w-[30px] shrink-0">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {own(`flag${code}`)}
        </svg>
      </span>
    );
  return code.length === 2 ? (
    <span
      className="font-flags flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1f3f5] text-[34px] leading-none"
      aria-hidden="true"
    >
      {String.fromCodePoint(
        ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
      )}
    </span>
  ) : (
    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f3f5]">
      {globeIcon("#6B7280")}
    </span>
  );
};

/** QR Name / QR Type row glyphs: the three member_stats.html draws. */
const qrGlyph = (type: string, color: string) =>
  type === "social" ? (
    <svg {...sv17}>
      <path
        d="M11.3333 2.125H5.66667C3.71066 2.125 2.125 3.71066 2.125 5.66667V11.3333C2.125 13.2893 3.71066 14.875 5.66667 14.875H11.3333C13.2893 14.875 14.875 13.2893 14.875 11.3333V5.66667C14.875 3.71066 13.2893 2.125 11.3333 2.125Z"
        {...st17(color)}
      />
      <path
        d="M8.5 11.3333C10.0648 11.3333 11.3333 10.0648 11.3333 8.5C11.3333 6.93519 10.0648 5.66667 8.5 5.66667C6.93519 5.66667 5.66667 6.93519 5.66667 8.5C5.66667 10.0648 6.93519 11.3333 8.5 11.3333Z"
        {...st17(color)}
      />
      <path
        d="M12.1833 5.59583C12.6137 5.59583 12.9625 5.24699 12.9625 4.81667C12.9625 4.38634 12.6137 4.0375 12.1833 4.0375C11.753 4.0375 11.4042 4.38634 11.4042 4.81667C11.4042 5.24699 11.753 5.59583 12.1833 5.59583Z"
        fill={color}
      />
    </svg>
  ) : type === "location" ? (
    pinIcon(color)
  ) : (
    <svg {...sv17}>
      <path
        d="M6.02083 2.125H3.1875C2.6007 2.125 2.125 2.6007 2.125 3.1875V6.02083C2.125 6.60764 2.6007 7.08333 3.1875 7.08333H6.02083C6.60764 7.08333 7.08333 6.60764 7.08333 6.02083V3.1875C7.08333 2.6007 6.60764 2.125 6.02083 2.125Z"
        {...st17(color)}
      />
      <path
        d="M13.8125 2.125H10.9792C10.3924 2.125 9.91667 2.6007 9.91667 3.1875V6.02083C9.91667 6.60764 10.3924 7.08333 10.9792 7.08333H13.8125C14.3993 7.08333 14.875 6.60764 14.875 6.02083V3.1875C14.875 2.6007 14.3993 2.125 13.8125 2.125Z"
        {...st17(color)}
      />
      <path
        d="M6.02083 9.91667H3.1875C2.6007 9.91667 2.125 10.3924 2.125 10.9792V13.8125C2.125 14.3993 2.6007 14.875 3.1875 14.875H6.02083C6.60764 14.875 7.08333 14.3993 7.08333 13.8125V10.9792C7.08333 10.3924 6.60764 9.91667 6.02083 9.91667Z"
        {...st17(color)}
      />
      <path
        d="M13.8125 9.91667H10.9792C10.3924 9.91667 9.91667 10.3924 9.91667 10.9792V13.8125C9.91667 14.3993 10.3924 14.875 10.9792 14.875H13.8125C14.3993 14.875 14.875 14.3993 14.875 13.8125V10.9792C14.875 10.3924 14.3993 9.91667 13.8125 9.91667Z"
        {...st17(color)}
      />
    </svg>
  );

type Tab = {
  label: string;
  rows: Ranked[];
  all: string;
  icon: (r: Ranked, i: number) => ReactNode;
};

function Panel({
  tabs,
  start = 0,
  empty = "No scans yet.",
}: {
  tabs: Tab[];
  start?: number;
  empty?: string;
}) {
  const [cur, setCur] = useState(start);
  const [open, setOpen] = useState(false);
  const t = tabs[cur];
  const rows = open ? t.rows : t.rows.slice(0, 3);
  return (
    <div className="flex min-w-0 flex-[1_0_0] flex-col rounded-[16px] border border-[#dae0e8] bg-white px-[16px] pt-[15px] pb-[14px] shadow-[0_1px_1px_rgba(14,19,17,0.04)] [&+&]:ml-[16px] max-[1120px]:[&+&]:mt-[16px] max-[1120px]:[&+&]:ml-0">
      <ul className="flex border-b border-[#dae0e8]">
        {tabs.map((x, i) => (
          <li key={x.label} className="[&+&]:ml-[20px]">
            <a
              href="#"
              aria-current={i === cur ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setCur(i);
                setOpen(false);
              }}
              className={`block pb-[11px] text-[13.5px] whitespace-nowrap ${i === cur ? "-mb-px border-b-2 border-[#2563eb] font-semibold text-[#2563eb]" : "font-medium text-[#6b7280]"}`}
            >
              {x.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="mt-[3px]">
        {rows.length === 0 && (
          <li className="py-[9px] text-[14px] text-[#6b7280]">{empty}</li>
        )}
        {rows.map((r, i) => (
          <li
            key={r.key || r.label}
            className="flex items-center py-[9px] [&+&]:border-t [&+&]:border-[#e2e6ec]"
          >
            {t.icon(r, i)}
            <p className="min-w-0 flex-[1_0_0] truncate px-[0.79em] text-[14px] text-[#374151] max-[576px]:font-medium">
              {r.label}
            </p>
            <span className="shrink-0 rounded-[7px] bg-[#f1f3f5] px-[0.62em] py-[0.31em] text-[13px] font-semibold text-[#4b5563]">
              {r.count}
            </span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="mt-auto flex items-center pt-[14px] text-[13.5px] font-semibold text-[#2563eb]"
      >
        {open && t.rows.length > 3 ? "Show top 3" : t.all}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-[0.37em] h-[1.04em] w-[1.04em] shrink-0 ${open ? "-rotate-90" : ""}`}
        >
          <path
            d="M5.25 10.5L8.75 7L5.25 3.5"
            stroke="currentColor"
            strokeWidth="1.16667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

const box = (bg: string, children: ReactNode) => (
  <span
    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] [&>svg]:h-[17px] [&>svg]:w-[17px] ${bg}`}
  >
    {children}
  </span>
);

/* ---- Page -------------------------------------------------------------------- */

export function StatsView({
  s,
  ranges,
  codes,
  qr,
}: {
  s: Stats;
  ranges: number[];
  codes: { id: string; name: string; tracked: boolean }[];
  qr: string;
}) {
  // JB, 2026-11-19: a code whose content is in the image (WiFi, Phone, a
  // Website saved before 2026-11-18…) is never scanned through us, so its
  // statistics say "Tracking unavailable" rather than a zero that reads as
  // "nobody scanned it". Same for an account with only such codes.
  const untracked = qr
    ? !codes.find((c) => c.id === qr)?.tracked
    : codes.length > 0 && !codes.some((c) => c.tracked);
  const router = useRouter();
  const go = (days: number, q: string) =>
    router.push(
      `/statistics?days=${days}${q ? `&qr=${encodeURIComponent(q)}` : ""}`,
    );
  const exportHref = `/api/stats/export?days=${s.days}${qr ? `&qr=${encodeURIComponent(qr)}` : ""}`;
  const qrIcon = (r: Ranked, i: number) =>
    box(rowBg[i % 3], qrGlyph(r.sub ?? "", rowFg[i % 3]));

  const cards = useMemo(
    () => [
      {
        n: s.codes,
        label: "Total QR codes",
        bg: "bg-[#eff4ff]",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 3H4.5C3.67157 3 3 3.67157 3 4.5V8.5C3 9.32843 3.67157 10 4.5 10H8.5C9.32843 10 10 9.32843 10 8.5V4.5C10 3.67157 9.32843 3 8.5 3Z"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.5 3H15.5C14.6716 3 14 3.67157 14 4.5V8.5C14 9.32843 14.6716 10 15.5 10H19.5C20.3284 10 21 9.32843 21 8.5V4.5C21 3.67157 20.3284 3 19.5 3Z"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 14H4.5C3.67157 14 3 14.6716 3 15.5V19.5C3 20.3284 3.67157 21 4.5 21H8.5C9.32843 21 10 20.3284 10 19.5V15.5C10 14.6716 9.32843 14 8.5 14Z"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.5 14H15.5C14.6716 14 14 14.6716 14 15.5V19.5C14 20.3284 14.6716 21 15.5 21H19.5C20.3284 21 21 20.3284 21 19.5V15.5C21 14.6716 20.3284 14 19.5 14Z"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        n: s.scans,
        label: "Total Scans",
        bg: "bg-[#e6f7f5]",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7"
              stroke="#11B1A7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7"
              stroke="#11B1A7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17"
              stroke="#11B1A7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17"
              stroke="#11B1A7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 12H17"
              stroke="#11B1A7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        n: s.uniques,
        label: "Unique Scans",
        bg: "bg-[#f3eefc]",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
              stroke="#9333EA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 21V20C4 17.8783 4.84285 15.8434 6.34315 14.3431C7.84344 12.8429 9.87827 12 12 12C14.1217 12 16.1566 12.8429 17.6569 14.3431C19.1571 15.8434 20 17.8783 20 20V21"
              stroke="#9333EA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
    [s],
  );
  return (
    <>
      <div className="flex min-h-[46px] flex-wrap items-center">
        <MenuButton />
        <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-black max-[576px]:text-[24px]">
          Statistics
        </h1>
      </div>
      <div className="mt-[16px] flex items-center max-[768px]:flex-wrap">
        <Sel
          icon={calendar}
          value={String(s.days)}
          label={`Last ${s.days} days`}
          onChange={(v) => go(Number(v), qr)}
        >
          {ranges.map((d) => (
            <option key={d} value={d}>
              Last {d} days
            </option>
          ))}
        </Sel>
        <div className="ml-[8px]">
          <Sel
            icon={funnel}
            value={qr}
            label={
              qr ? (codes.find((c) => c.id === qr)?.name ?? "Filter") : "Filter"
            }
            onChange={(v) => go(s.days, v)}
          >
            <option value="">All QR codes</option>
            {codes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tracked ? c.name : `${c.name} (Tracking unavailable)`}
              </option>
            ))}
          </Sel>
        </div>
        <a
          href={exportHref}
          className="ml-auto flex items-center text-[14.5px] font-medium text-[#374151] max-[768px]:mt-[12px] max-[768px]:mr-0 max-[768px]:ml-auto [&>svg]:ml-[0.48em] [&>svg]:h-[1.17em] [&>svg]:w-[1.17em] [&>svg]:shrink-0"
        >
          Export data
          <svg {...sv17}>
            <path
              d="M14.875 10.625V13.4583C14.875 13.8341 14.7257 14.1944 14.4601 14.4601C14.1944 14.7257 13.8341 14.875 13.4583 14.875H3.54167C3.16594 14.875 2.80561 14.7257 2.53993 14.4601C2.27426 14.1944 2.125 13.8341 2.125 13.4583V10.625"
              stroke="currentColor"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.95833 5.66667L8.5 2.125L12.0417 5.66667"
              stroke="currentColor"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 2.125V10.625"
              stroke="currentColor"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
      <div className="mt-[15px] w-full rounded-[16px] border border-[#dae0e8] bg-white p-[16px] shadow-[0_1px_1px_rgba(14,19,17,0.04)]">
        <div className="flex max-[768px]:flex-col">
          {cards.map((c) => (
            <div
              key={c.label}
              className="relative flex min-w-0 flex-[1_0_0] items-center rounded-[14px] border border-[#dae0e8] px-[16px] py-[15px] text-[10px] [&+&]:ml-[16px] max-[768px]:[&+&]:mt-[12px] max-[768px]:[&+&]:ml-0"
            >
              <div
                className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[13px] [&>svg]:h-[24px] [&>svg]:w-[24px] ${c.bg}`}
              >
                {c.icon}
              </div>
              <div className="min-w-0 pl-[11px]">
                {untracked && c.label !== "Total QR codes" ? (
                  <p
                    className="text-[30px] leading-[1.05em] font-extrabold tracking-[-0.02em] text-[#9ca3af]"
                    title="Tracking unavailable"
                  >
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Tracking unavailable</span>
                  </p>
                ) : (
                  <p className="text-[30px] leading-[1.05em] font-extrabold tracking-[-0.02em] text-[#0e1311]">
                    {c.n.toLocaleString("en-US")}
                  </p>
                )}
                <p className="mt-[0.28em] text-[14px] whitespace-nowrap text-[#6b7280] max-[576px]:font-medium">
                  {c.label}
                  {c.label === "Unique Scans" && <UniqueInfo />}
                </p>
              </div>
            </div>
          ))}
        </div>
        {untracked ? <Unavailable /> : <Chart series={s.series} />}
      </div>
      <div className="mt-[15px] flex items-stretch max-[1120px]:flex-col">
        <Panel
          empty={untracked ? "Tracking unavailable" : undefined}
          tabs={[
            {
              label: "QR Name",
              rows: s.byCode,
              all: "View all QR codes",
              icon: qrIcon,
            },
            {
              label: "QR Type",
              rows: s.byType.map((r) => ({
                ...r,
                label: typeLabel(r.key),
                sub: undefined,
              })),
              all: "View all types",
              icon: (r, i) => qrIcon({ ...r, sub: r.key }, i),
            },
            {
              label: "Destination URLs",
              rows: s.byUrl,
              all: "View all URLs",
              icon: (_r, i) => box(rowBg[i % 3], linkIcon(rowFg[i % 3])),
            },
          ]}
        />
        <Panel
          empty={untracked ? "Tracking unavailable" : undefined}
          start={1}
          tabs={[
            {
              label: "Cities",
              rows: s.byCity,
              all: "View all cities",
              icon: (_r, i) => box(rowBg[i % 3], pinIcon(rowFg[i % 3])),
            },
            {
              label: "Countries",
              rows: s.byCountry,
              all: "View all countries",
              icon: (r) => flag(r.key),
            },
            {
              label: "Continents",
              rows: s.byContinent,
              all: "View all continents",
              icon: (_r, i) => box(rowBg[i % 3], globeIcon(rowFg[i % 3])),
            },
          ]}
        />
        <Panel
          empty={untracked ? "Tracking unavailable" : undefined}
          tabs={[
            {
              label: "Devices",
              rows: s.byDevice,
              all: "View all devices",
              icon: (r, i) =>
                box(devBg[i % 3], deviceIcon(r.label, devFg[i % 3])),
            },
            {
              label: "Browsers",
              rows: s.byBrowser,
              all: "View all browsers",
              icon: (_r, i) => box(devBg[i % 3], globeIcon(devFg[i % 3])),
            },
            {
              label: "OS",
              rows: s.byOs,
              all: "View all OS",
              icon: (r, i) =>
                box(
                  devBg[i % 3],
                  deviceIcon(
                    r.label === "Windows" ||
                      r.label === "macOS" ||
                      r.label === "Linux" ||
                      r.label === "ChromeOS"
                      ? "Desktop"
                      : "Mobile",
                    devFg[i % 3],
                  ),
                ),
            },
          ]}
        />
      </div>
    </>
  );
}
