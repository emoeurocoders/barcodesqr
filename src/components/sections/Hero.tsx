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
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-bg">
      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-20">
        {/* Copy */}
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-sm font-medium text-body shadow-soft">
            <span aria-hidden="true">🏆</span>
            #1 QR Code Generator
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Generate
            <span className="sr-only">custom</span>
            <RotatingWord />
            <br />
            QR Codes
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg text-muted md:mx-0">
            Dynamic &amp; customizable QR codes with analytics that you can edit
            even after printing!
          </p>

          <div className="mt-8">
            <Link href="/create">
              <Button size="lg" className="px-8">
                Create QR Code
              </Button>
            </Link>
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

          {/* Mobile fallback */}
          <div
            className="relative mx-auto mt-2 w-full max-w-sm md:hidden"
            aria-hidden="true"
          >
            <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
              <p className="text-sm font-semibold text-ink">My QR Codes</p>
              <div className="mt-3 space-y-3">
                {codes.slice(0, 3).map((code, i) => (
                  <div key={code.name} className="flex items-center gap-3">
                    <span
                      className="grid shrink-0 place-items-center rounded bg-white p-1 ring-1 ring-line"
                      style={{ width: 36, height: 36 }}
                    >
                      <MiniQr index={i} size={30} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink">
                        {code.name}
                      </p>
                      <p className="truncate text-[10px] text-muted">
                        {code.meta}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                      {code.scans}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
