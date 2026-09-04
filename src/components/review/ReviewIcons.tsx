/**
 * Icons for the review modal that `lucide-react` v1.31 draws differently.
 *
 * A caution learned here: the designer's files are NOT on one Lucide version.
 * This modal's `download` and `smartphone` match our package byte for byte,
 * while the Help Center's `download` does not — so "we already ported that
 * glyph" is never a safe assumption. Every icon below was compared shape by
 * shape against lucide's own `__iconNode` definitions, and only the ones that
 * differ live here; `check` and `smartphone` matched and are imported from the
 * package at the point of use.
 *
 * `chart-column-increasing` and `download` hold lucide's exact paths but in a
 * different ORDER. Visually identical, so lucide would have been legitimate —
 * copying theirs keeps the skeleton diff free of noise that would otherwise
 * need re-explaining on every run.
 * The close X is not here either — PaywallShell already draws the identical
 * 18x18 glyph.
 *
 * Attributes are camelCased — React renders `stroke-width` spelled lowercase
 * as nothing at all.
 */

type IconProps = { className?: string };

const stroke = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * The rating star. Drawn at strokeWidth 1.8, not 2, and filled with
 * `currentColor` once selected — the designer does that in CSS, so the shape
 * here stays unfilled and the component that uses it decides.
 */
export function StarIcon({ className }: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

/** "Easy to use" */
export function RocketIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

/** "Fast setup" */
export function ZapIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

/** "Clean design" — sparkles with the extra small twinkle the help pages lack. */
export function SparklesIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

/** "QR customization" */
export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </svg>
  );
}

/** "Helpful support" */
export function HeadphonesIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

/** "Analytics" — lucide's four paths, in the designer's order. */
export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M13 17V9" />
      <path d="M18 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

/** "Download quality" — lucide's three paths, in the designer's order. */
export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}
