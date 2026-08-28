import type { SVGProps } from "react";

/**
 * The icons `terms.html` draws inline, copied path for path.
 *
 * lucide has an equivalent for every one of them, but it has quietly redrawn
 * several icons since this mockup was made — `contact`, `zap` and
 * `headphones` all needed forking elsewhere in this repo for exactly that
 * reason. Copying is cheaper than checking each one on every upgrade.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type Props = SVGProps<SVGSVGElement>;

/** Beside "Last Updated". */
export function CalendarIcon(props: Props) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

/** The "Questions?" card. */
export function MailIcon(props: Props) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/** Bullet for the two-column ticked lists. */
export function CheckCircleIcon(props: Props) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** The blue "Important:" callouts. */
export function InfoIcon(props: Props) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/** The table-of-contents toggle on narrow screens. */
export function ChevronDownIcon(props: Props) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
