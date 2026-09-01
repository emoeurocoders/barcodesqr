/**
 * Help Center icons the designer draws differently from the `lucide-react` we
 * ship.
 *
 * They author with Lucide, but against an older release: `search`, `download`,
 * `pencil`, `lightbulb` and `sparkles` all have different path data in v1.31
 * than in their file. The fidelity contract lets a Lucide component stand in
 * only when the rendered glyph MATCHES, so those five are copied verbatim here
 * and everything that did match byte-for-byte is imported from `lucide-react`
 * at the point of use.
 *
 * Verified by comparing every `<svg>` in help.html / help_category.html /
 * help_article.html against lucide-react's own `__iconNode` definitions, shape
 * by shape — not by eye.
 *
 * Attributes are camelCased because React silently renders nothing for
 * `stroke-width` or `viewBox` spelled lowercase.
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

/** Their search glyph: the tail is `-4.3-4.3`, Lucide v1.31 draws `-4.34-4.34`. */
export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/** "Popular Articles" heading — a lightbulb. */
export function LightbulbIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

/** "How to create your first QR code" — sparkles. */
export function SparklesIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

/** "How to download and test your QR code" — the older polyline download. */
export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

/** "Can I edit a QR code after creating it?" — a pencil. */
export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

/** "Browse Help Topics" heading — an open book. */
export function BookOpenIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

/** "Getting Started" topic — a rocket. */
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

/** "Troubleshooting" topic — a wrench. */
export function WrenchIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** "Still Need Help?" — a message bubble. */
export function MessageIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  );
}

/** "Plans & Billing" topic — their wallet, which v1.31 draws differently. */
export function WalletIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

/**
 * The QR-and-dots column standing to the left of the hero heading. Genuinely
 * custom artwork, not an icon — copied path for path.
 */
export function HeroArtLeft({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 150"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path fillRule="evenodd" d="M0 0h28v28H0zM5 5h18v18H5z" />
      <rect x="9" y="9" width="10" height="10" />
      <path fillRule="evenodd" d="M68 0h28v28H68zM73 5h18v18H73z" />
      <rect x="77" y="9" width="10" height="10" />
      <path fillRule="evenodd" d="M0 68h28v28H0zM5 73h18v18H5z" />
      <rect x="9" y="77" width="10" height="10" />
      <rect x="36" y="0" width="8" height="8" />
      <rect x="52" y="4" width="8" height="8" />
      <rect x="36" y="20" width="8" height="8" />
      <rect x="60" y="20" width="8" height="8" />
      <rect x="44" y="32" width="8" height="8" />
      <rect x="56" y="36" width="8" height="8" />
      <rect x="80" y="36" width="8" height="8" />
      <rect x="36" y="48" width="8" height="8" />
      <rect x="68" y="48" width="8" height="8" />
      <rect x="88" y="52" width="8" height="8" />
      <rect x="48" y="60" width="8" height="8" />
      <rect x="60" y="68" width="8" height="8" />
      <rect x="80" y="64" width="8" height="8" />
      <rect x="36" y="80" width="8" height="8" />
      <rect x="52" y="88" width="8" height="8" />
      <rect x="72" y="84" width="8" height="8" />
      <rect x="88" y="88" width="8" height="8" />
      <circle cx="4" cy="118" r="3" />
      <circle cx="18" cy="118" r="3" />
      <circle cx="32" cy="118" r="3" />
      <circle cx="46" cy="118" r="3" />
      <circle cx="60" cy="118" r="3" />
      <circle cx="4" cy="132" r="3" />
      <circle cx="18" cy="132" r="3" />
      <circle cx="32" cy="132" r="3" />
      <circle cx="46" cy="132" r="3" />
      <circle cx="60" cy="132" r="3" />
      <circle cx="4" cy="146" r="3" />
      <circle cx="18" cy="146" r="3" />
      <circle cx="32" cy="146" r="3" />
      <circle cx="46" cy="146" r="3" />
      <circle cx="60" cy="146" r="3" />
    </svg>
  );
}

/**
 * The QR-and-shapes cluster on the right of the hero. Decorative, single
 * colour, driven by `currentColor` exactly as theirs is.
 */
export function HeroArtRight({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 240 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="205" cy="75" r="85" stroke="currentColor" strokeWidth="2" />
      <rect x="150" y="128" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="2.5" />
      <rect x="88" y="52" width="22" height="22" rx="5" stroke="currentColor" strokeWidth="2.5" />
      <rect x="196" y="30" width="26" height="26" rx="6" fill="currentColor" />
      <g fill="currentColor">
        <circle cx="8" cy="8" r="3" />
        <circle cx="24" cy="8" r="3" />
        <circle cx="40" cy="8" r="3" />
        <circle cx="56" cy="8" r="3" />
        <circle cx="8" cy="24" r="3" />
        <circle cx="24" cy="24" r="3" />
        <circle cx="40" cy="24" r="3" />
        <circle cx="56" cy="24" r="3" />
        <circle cx="8" cy="40" r="3" />
        <circle cx="24" cy="40" r="3" />
        <circle cx="40" cy="40" r="3" />
        <circle cx="56" cy="40" r="3" />
        <circle cx="8" cy="56" r="3" />
        <circle cx="24" cy="56" r="3" />
        <circle cx="40" cy="56" r="3" />
        <circle cx="56" cy="56" r="3" />
      </g>
    </svg>
  );
}

/**
 * The "Still Need Help?" vignette: a phone showing a QR, a chat bubble and an
 * envelope. Full colour and NOT `currentColor` — the designer hardcodes every
 * fill, including the brand teal, so the values are theirs verbatim.
 */
export function SupportArt({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 200 140"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30,132c-12-6-19-19-16-35"
        style={{ fill: "none", stroke: "#b7cbea", strokeLinecap: "round", strokeWidth: "2.5px" }}
      />
      <ellipse cx="14" cy="92" rx="6" ry="11" transform="translate(-36.2 13.6) rotate(-24)" style={{ fill: "#c9d8f1" }} />
      <ellipse cx="26" cy="110" rx="9" ry="5" transform="translate(-83.3 81.3) rotate(-62)" style={{ fill: "#c9d8f1" }} />
      <g>
        <rect
          x="50" y="30" width="72" height="80" rx="10" ry="10"
          transform="translate(-8.9 12.7) rotate(-8)"
          style={{ fill: "#fff", stroke: "#dbe2ec", strokeMiterlimit: 4, strokeWidth: "2px" }}
        />
        <g>
          <path d="M58.6,47.6l15.8-2.2,2.2,15.8-15.8,2.2-2.2-15.8ZM63.1,51l7.9-1.1,1.1,7.9-7.9,1.1-1.1-7.9Z" style={{ fill: "#1f2937", fillRule: "evenodd" }} />
          <path d="M90.3,43.1l15.8-2.2,2.2,15.8-15.8,2.2-2.2-15.8ZM94.8,46.5l7.9-1.1,1.1,7.9-7.9,1.1-1.1-7.9Z" style={{ fill: "#1f2937", fillRule: "evenodd" }} />
          <path d="M63.1,79.3l15.8-2.2,2.2,15.8-15.8,2.2-2.2-15.8ZM67.6,82.7l7.9-1.1,1.1,7.9-7.9,1.1-1.1-7.9Z" style={{ fill: "#1f2937", fillRule: "evenodd" }} />
          <rect x="95.1" y="74.4" width="6" height="6" transform="translate(-9.8 14.4) rotate(-8)" style={{ fill: "#1f2937" }} />
          <rect x="105.9" y="78.9" width="6" height="6" transform="translate(-10.3 16) rotate(-8)" style={{ fill: "#1f2937" }} />
          <rect x="97.1" y="88.2" width="6" height="6" transform="translate(-11.7 14.8) rotate(-8)" style={{ fill: "#1f2937" }} />
          <rect x="83.6" y="63.9" width="6" height="6" transform="translate(-8.5 12.7) rotate(-8)" style={{ fill: "#1f2937" }} />
          <rect x="70.2" y="98.1" width="6" height="6" transform="translate(-13.4 11.2) rotate(-8)" style={{ fill: "#1f2937" }} />
          <rect x="82.1" y="96.4" width="6" height="6" transform="translate(-13 12.8) rotate(-8)" style={{ fill: "#1f2937" }} />
        </g>
      </g>
      <rect x="138" y="8" width="52" height="38" rx="12" ry="12" style={{ fill: "#11b1a7" }} />
      <path d="M151,41l-5,12,14-7-9-5Z" style={{ fill: "#11b1a7" }} />
      <circle cx="153" cy="27" r="3.2" style={{ fill: "#fff" }} />
      <circle cx="164" cy="27" r="3.2" style={{ fill: "#fff" }} />
      <circle cx="175" cy="27" r="3.2" style={{ fill: "#fff" }} />
      <rect x="146" y="88" width="48" height="34" rx="6" ry="6" style={{ fill: "#fff", stroke: "#9db1d1", strokeWidth: "2.5px" }} />
      <path d="M148,92l22,15,22-15" style={{ fill: "none", stroke: "#9db1d1", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5px" }} />
    </svg>
  );
}
