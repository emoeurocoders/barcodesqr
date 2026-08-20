import { RefreshCw, Clock, SquarePen, ShieldLock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const benefits: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: RefreshCw,
    title: "Dynamic QR Codes",
    desc: "Update content anytime",
  },
  {
    icon: Clock,
    title: "Track Scans",
    desc: "See real-time scan analytics",
  },
  {
    icon: SquarePen,
    title: "Update Content",
    desc: "Edit your QR code destination",
  },
  {
    icon: ShieldLock,
    title: "Secure & Reliable",
    desc: "Enterprise-grade security",
  },
];

export function PreviewPanel() {
  return (
    <aside className="h-fit shrink-0 rounded-2xl border border-line/80 bg-white p-6 text-center lg:sticky lg:top-24 lg:w-[330px]">
      <div className="mx-auto grid w-fit place-items-center rounded-2xl border border-line/60 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/create/qr-illustration.svg"
          alt=""
          aria-hidden="true"
          className="h-28 w-28"
        />
      </div>

      <h2 className="mt-5 flex items-center justify-center gap-1.5 text-base font-bold text-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/create/sparkle.svg"
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
        />
        Create your perfect QR code
      </h2>
      <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted">
        Choose a type to see your personalized, dynamic QR code come to life.
      </p>

      <ul className="mt-6 space-y-4 rounded-xl border border-line/60 bg-bg-alt/40 p-4 text-left">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[13px] font-bold text-ink">
                {title}
              </span>
              <span className="mt-0.5 block text-xs text-muted">{desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
