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

export function WhyBarcodesQR() {
  return (
    <section id="features" className="scroll-mt-20 bg-white">
      <div className="container-page pb-16 pt-10 md:pb-20 md:pt-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f0fb] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle className="h-3.5 w-3.5" aria-hidden="true" />
              Why BarcodesQR
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Everything you need after the QR code is&nbsp;created
            </h2>

            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              Create dynamic QR codes, update them anytime, and track
              performance with tools built for{" "}
              <span className="whitespace-nowrap">real-world use.</span>
            </p>

            <ul className="mt-8 space-y-3">
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

          {/* Dashboard preview */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/why-dashboard.jpg"
              alt="BarcodesQR dashboard overview"
              className="w-full rounded-2xl border border-line/70 shadow-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
