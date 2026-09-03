/**
 * The six feature icons in "Why choose BarcodesQR".
 *
 * Copied path for path from the designer's main.html. These are NOT Lucide —
 * each one is a two-colour mark that hardcodes the brand blue and teal, so
 * there is no package equivalent to stand in and `currentColor` would flatten
 * them to one colour.
 *
 * Attributes are camelCased; React renders `stroke-width` spelled lowercase as
 * nothing at all.
 */

type IconProps = { className?: string };

/** "23 QR Code Types" */
export function TypesIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#2563eb" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#2563eb" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#2563eb" />
      <rect x="5.6" y="5.6" width="1.8" height="1.8" rx="0.5" fill="#2563eb" stroke="none" />
      <rect x="16.6" y="5.6" width="1.8" height="1.8" rx="0.5" fill="#2563eb" stroke="none" />
      <rect x="5.6" y="16.6" width="1.8" height="1.8" rx="0.5" fill="#2563eb" stroke="none" />
      <rect x="13.4" y="13.4" width="2.4" height="2.4" rx="0.6" fill="#11b1a7" stroke="none" />
      <rect x="18.6" y="13.4" width="2.4" height="2.4" rx="0.6" fill="#11b1a7" stroke="none" />
      <rect x="16" y="16" width="2.4" height="2.4" rx="0.6" fill="#2563eb" stroke="none" />
      <rect x="13.4" y="18.6" width="2.4" height="2.4" rx="0.6" fill="#11b1a7" stroke="none" />
      <rect x="18.6" y="18.6" width="2.4" height="2.4" rx="0.6" fill="#11b1a7" stroke="none" />
    </svg>
  );
}

/** "Dynamic QR Codes" */
export function DynamicIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.4 9.3A9 9 0 0 1 18.74 5.74L21 8" stroke="#2563eb" />
      <path d="M21 3v5h-5" stroke="#2563eb" />
      <path d="M16.5 19.8A9 9 0 0 1 5.26 18.26L3 16" stroke="#2563eb" />
      <path d="M8 16H3v5" stroke="#2563eb" />
      <g transform="translate(12.9 9.7) scale(0.4)">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" fill="none" stroke="#ffffff" strokeWidth="5" />
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" fill="#11b1a7" stroke="#11b1a7" strokeWidth="1.5" />
      <path d="M4.4 15.6 8.4 19.6" stroke="#ffffff" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** "Scan Analytics" */
export function AnalyticsIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
      <linearGradient id="mainChooseGrad1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2563eb" />
      <stop offset="1" stopColor="#11b1a7" />
      </linearGradient>
      </defs>
      <rect x="3" y="13.5" width="3.1" height="7.5" rx="0.7" fill="url(#mainChooseGrad1)" stroke="none" />
      <rect x="8" y="11.5" width="3.1" height="9.5" rx="0.7" fill="url(#mainChooseGrad1)" stroke="none" />
      <rect x="13" y="9.5" width="3.1" height="11.5" rx="0.7" fill="url(#mainChooseGrad1)" stroke="none" />
      <rect x="18" y="7.5" width="3.1" height="13.5" rx="0.7" fill="url(#mainChooseGrad1)" stroke="none" />
      <path d="M3.5 8 9 4.5l4.5 2L20.5 2" stroke="#2563eb" strokeWidth="1.8" />
      <circle cx="9" cy="4.5" r="1.1" fill="#2563eb" stroke="none" />
      <circle cx="13.5" cy="6.5" r="1.1" fill="#2563eb" stroke="none" />
      <circle cx="20.5" cy="2" r="1.1" fill="#2563eb" stroke="none" />
    </svg>
  );
}

/** "Custom Branding" */
export function BrandingIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke="#2563eb" />
      <circle cx="8.2" cy="7.2" r="1" fill="#11b1a7" stroke="none" />
      <circle cx="12.8" cy="5.9" r="1" fill="#2563eb" stroke="none" />
      <circle cx="16.8" cy="8.7" r="1" fill="#11b1a7" stroke="none" />
      <circle cx="6.2" cy="11.8" r="1" fill="#2563eb" stroke="none" />
      <g transform="translate(12.9 12.1) scale(0.45)">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" fill="#11b1a7" stroke="#ffffff" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

/** "High-Quality Downloads" */
export function QualityIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.5 22H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5.5l6 6v12a2 2 0 0 1-2 2z" stroke="#2563eb" />
      <path d="M14.5 2v6h6" stroke="#2563eb" />
      <circle cx="8" cy="16.5" r="4.3" fill="#11b1a7" stroke="#ffffff" strokeWidth="1.4" />
      <path d="M8 14.4v4.2" stroke="#ffffff" strokeWidth="1.7" />
      <path d="m6.3 16.8 1.7 1.8 1.7-1.8" stroke="#ffffff" strokeWidth="1.7" />
    </svg>
  );
}

/** "Easy to Manage" */
export function ManageIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#2563eb" />
      <path d="M3 8.6h18" stroke="#2563eb" />
      <circle cx="6" cy="6.3" r="0.55" fill="#2563eb" stroke="none" />
      <circle cx="8.2" cy="6.3" r="0.55" fill="#2563eb" stroke="none" />
      <rect x="7.3" y="10.8" width="3.7" height="3.6" rx="0.7" fill="#11b1a7" stroke="none" />
      <rect x="13" y="10.8" width="3.7" height="3.6" rx="0.7" fill="#2563eb" stroke="none" />
      <rect x="7.3" y="15.4" width="3.7" height="3.6" rx="0.7" fill="#2563eb" stroke="none" />
      <rect x="13" y="15.4" width="3.7" height="3.6" rx="0.7" fill="#11b1a7" stroke="none" />
    </svg>
  );
}
