"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  QrCode,
  LayoutGrid,
  ChartColumn,
  Download,
  Earth,
  TrendingUp,
  Globe,
  FileText,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { MiniQr } from "@/components/ui/MiniQr";
import { Button } from "@/components/ui/Button";

const words = ["Branded", "Dynamic", "Secure", "Editable"];

/**
 * The mobile hero's glyphs, traced from main_mobile.html rather than matched to
 * `lucide-react`. Several of them (the PDF page, the vCard) are drawn from a
 * newer lucide than this project carries, so the installed component renders a
 * visibly different glyph at the same size — the icon rule says copy theirs
 * when that is true. Attributes are camelCased for React; lowercase
 * `strokeWidth` renders nothing and does it silently.
 */
function Glyph({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowRightGlyph({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Glyph>
  );
}

/** Their `.ben` strip, under the mobile CTA. */
const benefits = [
  {
    label: "Edit anytime",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </Glyph>
    ),
  },
  {
    label: "Track scans",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M20 20H2" />
      </Glyph>
    ),
  },
  {
    label: "Print with confidence",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </Glyph>
    ),
  },
];

/**
 * Their `.crd` tiles. The two colours per tile are inline styles in the mockup,
 * so they stay per-item data here rather than becoming `@theme` tokens — the
 * same call Showcase already makes for its `accent`. Note PDF and Video
 * deliberately share one pair; that is the designer's file, not a slip here.
 *
 * Every tile is `href="#"` in the mockup. This port has no per-type route — the
 * showcase's own CTA goes to a bare /create — so all four do the same.
 */
const heroTypes = [
  {
    label: "Website",
    blurb: "Link to any URL",
    href: "/create",
    fg: "#782be4",
    bg: "#f1e9ff",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </Glyph>
    ),
  },
  {
    label: "PDF",
    blurb: "Share a PDF file",
    href: "/create",
    fg: "#c92348",
    bg: "#fdecef",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </Glyph>
    ),
  },
  {
    label: "vCard",
    blurb: "Share contact details",
    href: "/create",
    fg: "#079b63",
    bg: "#e4f8ef",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6 16c.6-1.7 1.6-2.5 3-2.5s2.4.8 3 2.5" />
        <path d="M15 11h3" />
        <path d="M15 15h3" />
      </Glyph>
    ),
  },
  {
    label: "Video",
    blurb: "Link to a video",
    href: "/create",
    fg: "#c92348",
    bg: "#fdecef",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </Glyph>
    ),
  },
];

const codes = [
  { name: "My QR Code", meta: "barcodesqr.com", type: "URL", scans: "1.4K" },
  { name: "Promo video", meta: "launch.mp4", type: "Video", scans: "880" },
  { name: "Contact card", meta: "John Doe", type: "vCard", scans: "2.3K" },
  { name: "Menu PDF", meta: "menu.pdf", type: "PDF", scans: "98" },
  { name: "Event image", meta: "poster.png", type: "Image", scans: "640" },
];

const geo = [
  { label: "USA", pct: "34%", color: "#11b1a7" },
  { label: "Spain", pct: "21%", color: "#2563eb" },
  { label: "Japan", pct: "12%", color: "#f59e0b" },
];

const byType = [
  { icon: Globe, label: "Website", value: "1.4K" },
  { icon: FileText, label: "PDF", value: "680" },
  { icon: ImageIcon, label: "Image", value: "340" },
];

const devices = [
  { icon: Smartphone, pct: 51, color: "#11b1a7" },
  { icon: Monitor, pct: 36, color: "#2563eb" },
  { icon: Tablet, pct: 13, color: "#94a3b8" },
];

/** Decorative corner dots that frame the rotating word. */
const cornerDots = [
  "-left-1 -top-1",
  "-top-1 left-1/2 -translate-x-1/2",
  "-right-1 -top-1",
  "-left-1 top-1/2 -translate-y-1/2",
  "-right-1 top-1/2 -translate-y-1/2",
  "-bottom-1 -left-1",
  "-bottom-1 left-1/2 -translate-x-1/2",
  "-bottom-1 -right-1",
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
      return () => clearTimeout(swap);
    }, 2600);
    return () => clearInterval(cycle);
  }, []);

  return (
    <span
      aria-hidden="true"
      className="relative mx-1 inline-block whitespace-nowrap rounded-md bg-[#eef1f3] px-2 align-baseline ring-1 ring-brand/30"
    >
      <span
        className="inline-block transition-all duration-300 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
        }}
      >
        {words[index]}
      </span>
      {cornerDots.map((pos) => (
        <span
          key={pos}
          className={`absolute h-2.5 w-2.5 rounded-[2px] bg-brand-dark ring-1 ring-white ${pos}`}
        />
      ))}
    </span>
  );
}

function CodeRow({
  code,
  index,
  size,
}: {
  code: (typeof codes)[number];
  index: number;
  size: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid shrink-0 place-items-center rounded bg-white p-1 ring-1 ring-line"
        style={{ width: size, height: size }}
      >
        <MiniQr index={index} size={size - 6} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-ink">{code.name}</p>
        <p className="truncate text-[10px] text-muted">{code.meta}</p>
      </div>
      <span className="rounded-full bg-bg-alt px-2 py-0.5 text-[10px] font-medium text-muted">
        {code.type}
      </span>
      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
        {code.scans}
      </span>
      <Download className="h-3.5 w-3.5 text-faint" />
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative scroll-mt-[84px] overflow-hidden bg-gradient-to-b from-white to-hero-fade md:scroll-mt-20 md:to-bg">
      <div className="container-home grid items-center gap-x-12 gap-y-0 pb-[57px] pt-[10.8vw] md:grid-cols-2 md:py-20">
        {/* Copy */}
        <div className="flex flex-col items-center text-center md:block md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hero-badge-line bg-white px-[1.2em] py-[0.5em] text-[3.6vw] font-bold text-hero-badge-ink shadow-[0_2px_4px_rgba(37,99,235,0.06)] md:border-line md:px-3 md:py-1 md:text-sm md:font-medium md:text-body md:shadow-soft">
            <span aria-hidden="true">🏆</span>
            #1 QR Code Generator
          </span>

          {/*
            Two headings, one per breakpoint, because the designer writes this
            line differently on each: main.html marks "Branded" as a chip and
            leaves "QR Codes" in ink, main_mobile.html drops the chip entirely
            and puts "QR Codes" in `.genC1` blue. Their stylesheet also carries
            a `.mobHome … .ln1 .mrk` rule that would flatten the chip, but the
            markup they shipped has no `.mrk` on this page — the rendered file
            is what is reproduced here, and the stale rule is in the handover.

            Only one is ever displayed, so neither is announced twice.
          */}
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            <span className="mx-auto -mt-5 block max-w-[9em] pt-[0.42em] text-[10.2vw] tracking-[-0.055em] md:hidden">
              Generate Branded <span className="text-primary">QR Codes</span>
            </span>
            <span className="hidden md:inline">
              Generate
              <span className="sr-only">custom</span>
              <RotatingWord />
              <br />
              QR Codes
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg text-muted md:mx-0">
            <span className="mx-auto -mt-6 block max-w-[22.5em] pt-[1em] text-[4.6vw] leading-[1.55] text-prose md:hidden">
              Dynamic &amp; customizable QR codes with analytics that you can
              edit even after printing!
            </span>
            <span className="hidden md:inline">
              Dynamic &amp; customizable QR codes with analytics that you can
              edit even after printing!
            </span>
          </p>

          {/* Full-bleed on mobile, with the arrow their file carries; the
              desktop button keeps its own width and label. */}
          <div className="mt-[33px] w-full md:mt-8 md:w-auto">
            <Link
              href="/create"
              className="flex w-full items-center justify-center gap-[0.7em] rounded-btn bg-primary px-[28.6px] py-[14.95px] text-[13px] font-medium leading-none text-on-accent transition-colors hover:bg-primary-press md:hidden"
            >
              Create Your QR Code
              <ArrowRightGlyph className="h-[1.3em] w-[1.3em]" />
            </Link>
            <Link href="/create" className="hidden md:inline-block">
              <Button size="lg" className="px-8">
                Create QR Code
              </Button>
            </Link>
          </div>

          {/* `.ben` — mobile only; main.html has no equivalent. */}
          <ul className="mt-[28px] flex w-full text-[2.1vw] leading-[normal] md:hidden">
            {benefits.map(({ label, Icon }, i) => (
              <li
                key={label}
                className={`flex min-w-0 flex-1 flex-col items-center px-[0.85em] ${
                  i > 0 ? "border-l border-hero-divider" : ""
                }`}
              >
                <span className="flex h-[4.68em] w-[4.68em] shrink-0 items-center justify-center rounded-full bg-hero-tile text-brand-dark">
                  <Icon className="h-[2.34em] w-[2.34em]" />
                </span>
                <p className="mt-[0.68em] max-w-[5.6em] text-center text-[1.48em] font-semibold leading-[1.25] text-prose">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* `.crd` — mobile only, and a sibling of the copy column in their
            file rather than part of it. */}
        <div className="mt-[37px] w-full rounded-[2.2em] border border-hero-divider bg-white p-[2.7em] text-left text-[2.1vw] leading-[normal] shadow-[0_1px_2px_rgba(14,19,17,0.04)] md:hidden">
          <div className="flex items-start">
            <span className="flex h-[1.92em] w-[1.92em] shrink-0 items-center justify-center rounded-full bg-hero-num-tile text-[2.95em] font-extrabold text-primary">
              1
            </span>
            <div className="min-w-0 pl-[1.7em]">
              <h2 className="max-w-[10em] text-[2.83em] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink">
                Choose your QR&nbsp;code type
              </h2>
              <p className="mt-[0.42em] text-[1.72em] leading-[1.5] text-muted">
                Choose what you want to share, then create your QR code.
              </p>
            </div>
          </div>

          <div className="mt-[2.46em] grid grid-cols-2 gap-[1.35em]">
            {heroTypes.map(({ label, blurb, href, fg, bg, Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center rounded-[1.6em] border border-hero-card-line px-[1.2em] py-[1.48em]"
              >
                <span
                  className="flex h-[5.17em] w-[5.17em] shrink-0 items-center justify-center rounded-full"
                  style={{ color: fg, background: bg }}
                >
                  <Icon className="h-[2.7em] w-[2.7em]" />
                </span>
                <span className="min-w-0 flex-1 pl-[1.1em] pr-[0.4em]">
                  <b className="block text-[1.72em] font-bold text-ink">
                    {label}
                  </b>
                  <small className="mt-[0.36em] block max-w-[6.8em] text-[1.35em] leading-[1.3] text-muted">
                    {blurb}
                  </small>
                </span>
                <span className="w-[1.97em] shrink-0 text-muted">
                  <ArrowRightGlyph className="block h-auto w-full" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div
            className="relative hidden h-[460px] w-full md:block"
            aria-hidden="true"
          >
            {/* Mock dashboard */}
            <div className="absolute left-6 top-24 z-0 origin-top-left rotate-[1deg]">
              <div className="flex w-[560px] overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                <div className="w-44 shrink-0 border-r border-line bg-bg-alt/40 p-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Logo className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold tracking-tight text-ink">
                      BarcodesQR
                    </span>
                  </span>
                  <nav className="mt-5 space-y-1 text-xs">
                    <span className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted">
                      <QrCode className="h-3.5 w-3.5" /> Create QR
                    </span>
                    <span className="flex items-center gap-2 rounded-lg bg-brand-soft px-2.5 py-1.5 font-semibold text-brand">
                      <LayoutGrid className="h-3.5 w-3.5" /> My QR Codes
                    </span>
                    <span className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted">
                      <ChartColumn className="h-3.5 w-3.5" /> Statistics
                    </span>
                  </nav>
                </div>
                <div className="min-w-0 flex-1 p-4">
                  <p className="text-sm font-semibold text-ink">My QR Codes</p>
                  <div className="mt-3 space-y-2.5">
                    {codes.map((code, i) => (
                      <CodeRow key={code.name} code={code} index={i} size={30} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: scans by geo */}
            <div className="absolute -left-6 -top-2 z-20 rotate-[-2deg]">
              <div className="w-44 rounded-2xl border border-line bg-white p-3 shadow-pop">
                <p className="flex items-center gap-1 text-[11px] font-medium text-muted">
                  <Earth className="h-3 w-3 text-brand" /> Scans by geo
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="4"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#11b1a7"
                        strokeWidth="4"
                        strokeDasharray="34 66"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="4"
                        strokeDasharray="21 79"
                        strokeDashoffset="-34"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        strokeDasharray="12 88"
                        strokeDashoffset="-55"
                      />
                    </svg>
                    <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-ink">
                      2.5K
                    </span>
                  </div>
                  <div className="space-y-0.5 text-[10px] font-medium">
                    {geo.map((g) => (
                      <p key={g.label} className="flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: g.color }}
                        />
                        <span className="text-body">{g.label}</span>
                        <span className="ml-auto font-semibold text-ink">
                          {g.pct}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: unique scans */}
            <div className="absolute -left-1 top-60 z-30">
              <div className="w-40 rounded-2xl border border-line bg-white px-4 py-3 shadow-pop">
                <p className="text-xl font-bold text-ink">1.8K</p>
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <QrCode className="h-3 w-3" /> Unique Scans
                </p>
                <p
                  className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold"
                  style={{ color: "#16a34a" }}
                >
                  <TrendingUp className="h-3 w-3" /> +18%
                </p>
              </div>
            </div>

            {/* Floating: scans by QR type */}
            <div className="absolute -left-4 bottom-0 z-30 rotate-[-1deg]">
              <div className="w-52 rounded-2xl border border-line bg-white p-4 shadow-pop">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                  <LayoutGrid className="h-3 w-3 text-brand" /> Scans by QR type
                </p>
                <div className="mt-2.5 space-y-2">
                  {byType.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Icon className="h-4 w-4 text-brand" />
                      <span className="text-body">{label}</span>
                      <span className="ml-auto font-semibold text-ink">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating: last 7 days sparkline */}
            <div className="absolute right-0 -top-3 z-20 rotate-[2deg]">
              <div className="w-56 rounded-2xl border border-line bg-white p-3 shadow-pop">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-medium text-muted">
                    Last 7 days
                  </p>
                  <p
                    className="flex items-center gap-1 text-[10px] font-semibold"
                    style={{ color: "#16a34a" }}
                  >
                    <TrendingUp className="h-3 w-3" /> +24%
                  </p>
                </div>
                <svg viewBox="0 0 220 80" className="mt-1 w-full" aria-hidden="true">
                  <defs>
                    <linearGradient
                      id="heroArtFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#11b1a7"
                        stopOpacity="0.28"
                      />
                      <stop offset="100%" stopColor="#11b1a7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 60 C20 56 30 40 50 44 C70 48 80 62 100 58 C120 54 130 30 150 26 C170 22 185 30 220 12 L220 80 L0 80 Z"
                    fill="url(#heroArtFill)"
                  />
                  <path
                    d="M0 60 C20 56 30 40 50 44 C70 48 80 62 100 58 C120 54 130 30 150 26 C170 22 185 30 220 12"
                    fill="none"
                    stroke="#11b1a7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="150"
                    cy="26"
                    r="3.5"
                    fill="#fff"
                    stroke="#11b1a7"
                    strokeWidth="2"
                  />
                </svg>
                <div className="mt-1 flex justify-between text-[9px] text-faint">
                  <span>Jan 1</span>
                  <span>Jan 3</span>
                  <span>Jan 5</span>
                  <span>Jan 7</span>
                </div>
              </div>
            </div>

            {/* Floating: scans by device */}
            <div className="absolute -right-4 bottom-2 z-30 rotate-[-1deg]">
              <div className="w-52 rounded-2xl border border-line bg-white p-4 shadow-pop">
                <p className="text-[11px] font-medium text-muted">
                  Scans by device
                </p>
                <div className="mt-2.5 space-y-2.5">
                  {devices.map(({ icon: Icon, pct, color }) => (
                    <div key={pct} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-muted" />
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-alt">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                      <span className="w-8 text-right text-[11px] font-semibold text-ink">
                        {pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*
            A cut-down "My QR Codes" card used to stand here on mobile, because
            the full dashboard mock-up cannot fit at 390 and the hero would
            otherwise have had no visual at all. main_mobile.html now answers
            that question itself — with the `.crd` type-picker above — so the
            stand-in is gone rather than stacked underneath it.
          */}
        </div>
      </div>
    </section>
  );
}
