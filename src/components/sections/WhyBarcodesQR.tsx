import { Sparkle, SquarePen, TrendingUp, Palette, ShieldLock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Benefit = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const benefits: Benefit[] = [
  {
    icon: SquarePen,
    title: "Edit anytime",
    body: "Change the destination after printing without replacing the QR code.",
  },
  {
    icon: TrendingUp,
    title: "Track every scan",
    body: "See scans, locations, devices and performance over time.",
  },
  {
    icon: Palette,
    title: "Customize your brand",
    body: "Add logos, colors, shapes and frames that match your style.",
  },
  {
    icon: ShieldLock,
    title: "Secure & reliable",
    body: "Use password protection, permissions and dependable QR hosting.",
  },
];

/**
 * The mobile list. It differs from `benefits` above in the THIRD entry only,
 * and not because the designer changed it for mobile: main.html and
 * main_mobile.html both say "Organize everything", and both have said so since
 * before this sync — the desktop port has simply been carrying the wrong copy,
 * along with a heading that should read "…after creating your QR code".
 *
 * Those two strings are left wrong on desktop deliberately, because this branch
 * is under instruction not to move desktop by a pixel, and fixing them reflows
 * it. They are written up in the handover as a pre-existing defect with a
 * one-line fix; when that is taken, this array collapses back into `benefits`
 * and the `md:hidden`/`hidden md:block` split below goes with it.
 *
 * The four accents are mobile-only either way — desktop tints every tile
 * `primary`, the mobile file gives each its own.
 */
const mobileBenefits = [
  { ...benefits[0], fg: "#1f6fe5", bg: "#e9f2ff" },
  { ...benefits[1], fg: "#079b63", bg: "#e4f8ef" },
  {
    icon: Palette,
    title: "Organize everything",
    body: "Manage QR codes, folders and campaigns from one dashboard.",
    fg: "#782be4",
    bg: "#f1e9ff",
  },
  { ...benefits[3], fg: "#078fa9", bg: "#e5f8fb" },
];

export function WhyBarcodesQR() {
  return (
    <section id="features" className="md:order-1 scroll-mt-[84px] md:scroll-mt-20 bg-white">
      <div className="container-home py-16 md:pb-20 md:pt-10">
        <div className="grid items-center gap-x-12 gap-y-0 md:gap-y-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            {/* Their `.bdg` is `display: none` on mobile. */}
            <span className="hidden items-center gap-2 rounded-full bg-[#e9f0fb] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary md:inline-flex">
              <Sparkle className="h-3.5 w-3.5" aria-hidden="true" />
              Why BarcodesQR
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              <span className="mx-auto -mt-5 block max-w-[9.2em] text-center text-[7.9vw] leading-[1.08] tracking-[-0.035em] md:hidden">
                Everything you need after creating your QR code
              </span>
              <span className="hidden md:inline">
                Everything you need after the QR code is&nbsp;created
              </span>
            </h2>

            {/* Two sub-lines, and this pair IS the designer's doing: main.html
                keeps the long "Create dynamic QR codes…" line, main_mobile.html
                replaces it with a shorter one. */}
            <p className="mx-auto mt-[0.85em] max-w-[17em] text-center text-[4.1vw] leading-[1.55] text-muted md:hidden">
              Edit, track and manage your QR codes from one simple dashboard.
            </p>
            <p className="mt-4 hidden max-w-md text-lg leading-relaxed text-muted md:block">
              Create dynamic QR codes, update them anytime, and track
              performance with tools built for{" "}
              <span className="whitespace-nowrap">real-world use.</span>
            </p>

            {/* Mobile: a 2×2 grid of stacked cards, each with its own accent. */}
            <ul className="mt-[4.6875vw] grid grid-cols-2 gap-[3.1vw] text-left md:hidden">
              {mobileBenefits.map(({ icon: Icon, title, body, fg, bg }) => (
                <li
                  key={title}
                  className="flex flex-col items-start rounded-[1.85em] border border-hero-card-line bg-white p-[1.97em] text-[2.1vw] leading-[normal] shadow-[0_2px_4px_rgba(14,19,17,0.04)]"
                >
                  <span
                    className="flex h-[5.4em] w-[5.4em] shrink-0 items-center justify-center rounded-full"
                    style={{ color: fg, background: bg }}
                  >
                    <Icon className="h-[2.83em] w-[2.83em]" />
                  </span>
                  <div className="mt-[1.5em]">
                    <h3 className="text-[1.72em] font-bold text-ink">
                      {title}
                    </h3>
                    <p className="mt-[0.5em] text-[1.48em] leading-[1.45] text-muted">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="mt-8 hidden space-y-3 md:block">
              {benefits.map(({ icon: Icon, title, body }) => (
                <li
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-shadow duration-200 hover:shadow-soft"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e9f0fb] text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard preview. The designer ships a separate, taller crop for
              mobile — not the desktop image rescaled. */}
          <div className="relative mt-[3.4375vw] md:mt-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/why-mobile.jpg"
              alt="BarcodesQR dashboard overview"
              className="w-full rounded-[3.125vw] border border-hero-divider shadow-[0_2px_6px_rgba(14,19,17,0.08)] md:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/why-dashboard.jpg"
              alt="BarcodesQR dashboard overview"
              className="hidden w-full rounded-2xl border border-line/70 shadow-card md:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
