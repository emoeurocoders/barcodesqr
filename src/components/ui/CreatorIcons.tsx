import type { SVGProps } from "react";

/**
 * Two glyphs copied verbatim from the live creator.
 *
 * The creator draws them from an older lucide than the one this app depends
 * on, and lucide has since redrawn both — `contact`'s shoulders moved a unit,
 * and `calendar-days` gained its dotted grid. Neither upgrading nor
 * downgrading `lucide-react` closes the gap without changing every other icon
 * in the app, so these two are copied instead, which is what the fidelity
 * contract asks for when a stand-in does not match.
 *
 * If the creator's lucide is ever bumped to match ours, delete this file and
 * go back to the library icons.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ContactIcon({
  className = "h-6 w-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M16 2v2" />
      <path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <path d="M8 2v2" />
      <circle cx="12" cy="11" r="3" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
    </svg>
  );
}

export function CalendarDaysIcon({
  className = "h-6 w-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
