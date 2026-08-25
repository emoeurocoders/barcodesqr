/**
 * Marks from the two modals that lucide cannot stand in for.
 *
 * Google and Apple are trademarks with published sign-in button guidelines,
 * so the artwork is reproduced path for path. The bar chart is here for a
 * duller reason: the designer's three bars are their own heights and no
 * lucide chart icon draws them, so it is copied rather than approximated.
 */

export function GoogleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.49h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.17Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.06v2.58A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.42 13.91a6 6 0 0 1 0-3.82V7.51H3.06a10 10 0 0 0 0 8.98l3.36-2.58Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.69 2 12 2A10 10 0 0 0 3.06 7.51l3.36 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AppleMark() {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="#0b0c0f"
      aria-hidden="true"
    >
      <path d="M17.05 12.5c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.15-.47 7.82 1.3 10.38.86 1.25 1.89 2.66 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.28-1.27 3.13-2.53.98-1.45 1.39-2.85 1.41-2.92-.03-.01-2.71-1.04-2.74-4.13ZM14.6 4.84c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.28.69-3.02 1.55-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45Z" />
    </svg>
  );
}

/** The three bars beside "Track scans". Designer's own, at their heights. */
export function TrackBarsIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.83333"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.66667 18.3333V11" />
      <path d="M9.16667 18.3333V5.5" />
      <path d="M14.6667 18.3333V13.75" />
    </svg>
  );
}

/**
 * Zap and Headphones as the creator draws them.
 *
 * lucide has redrawn both since — ours starts the bolt at a different point
 * and builds the headphones ear-cups-first — so at 25px the silhouettes do
 * not match. Same situation as `CreatorIcons`, same remedy: copy the paths.
 */
const strokeBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.08333,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * The shield with an info mark inside. lucide ships a dozen shield variants
 * and no `shield-info`, so this one is the designer's drawing outright.
 */
export function SecureIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 25 25" {...strokeBase} className={className} aria-hidden="true">
      <path d="M20.8333 13.5417C20.8333 18.75 17.1875 21.3542 12.8542 22.8646C12.6273 22.9415 12.3808 22.9378 12.1563 22.8542C7.8125 21.3542 4.16667 18.75 4.16667 13.5417V6.25C4.16667 5.97373 4.27641 5.70878 4.47176 5.51343C4.66711 5.31808 4.93207 5.20833 5.20833 5.20833C7.29167 5.20833 9.89583 3.95833 11.7083 2.375C11.8061 2.26065 11.9275 2.16884 12.0642 2.10588C12.2009 2.04293 12.3495 2.01034 12.5 2.01034C12.6505 2.01034 12.7991 2.04293 12.9358 2.10588C13.0725 2.16884 13.1939 2.26065 13.2917 2.375C15.1146 3.96875 17.7083 5.20833 19.7917 5.20833C20.0679 5.20833 20.3329 5.31808 20.5282 5.51343C20.7236 5.70878 20.8333 5.97373 20.8333 6.25V13.5417Z" />
      <path d="M12.5 10.9375V14.0625" />
      <path
        d="M12.5 9.16667C12.8452 9.16667 13.125 8.88684 13.125 8.54167C13.125 8.19649 12.8452 7.91667 12.5 7.91667C12.1548 7.91667 11.875 8.19649 11.875 8.54167C11.875 8.88684 12.1548 9.16667 12.5 9.16667Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstantIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 25 25" {...strokeBase} className={className} aria-hidden="true">
      <path d="M13.5417 2.08333L4.26042 13.6562C4.13678 13.8086 4.05871 13.9929 4.03519 14.1877C4.01167 14.3825 4.04367 14.58 4.12749 14.7575C4.21131 14.9349 4.34354 15.085 4.50897 15.1906C4.67439 15.2962 4.86627 15.3529 5.0625 15.3542H11.4583L10.4167 22.9167L19.6979 11.3438C19.8216 11.1914 19.8996 11.0071 19.9231 10.8123C19.9467 10.6175 19.9147 10.42 19.8308 10.2425C19.747 10.0651 19.6148 9.91496 19.4494 9.80939C19.2839 9.70382 19.0921 9.64712 18.8958 9.64583H12.5L13.5417 2.08333Z" />
    </svg>
  );
}

export function SupportIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 25 25" {...strokeBase} className={className} aria-hidden="true">
      <path d="M3.125 14.5833V11.4583C3.125 8.97193 4.11272 6.58736 5.87087 4.82921C7.62903 3.07105 10.0136 2.08333 12.5 2.08333C14.9864 2.08333 17.371 3.07105 19.1291 4.82921C20.8873 6.58736 21.875 8.97193 21.875 11.4583V14.5833" />
      <path d="M21.875 16.6667C21.875 17.2192 21.6555 17.7491 21.2648 18.1398C20.8741 18.5305 20.3442 18.75 19.7917 18.75H18.75C18.4737 18.75 18.2088 18.6403 18.0134 18.4449C17.8181 18.2496 17.7083 17.9846 17.7083 17.7083V14.5833C17.7083 14.3071 17.8181 14.0421 18.0134 13.8468C18.2088 13.6514 18.4737 13.5417 18.75 13.5417H21.875V16.6667Z" />
      <path d="M3.125 16.6667C3.125 17.2192 3.34449 17.7491 3.73519 18.1398C4.1259 18.5305 4.6558 18.75 5.20833 18.75H6.25C6.52627 18.75 6.79122 18.6403 6.98657 18.4449C7.18192 18.2496 7.29167 17.9846 7.29167 17.7083V14.5833C7.29167 14.3071 7.18192 14.0421 6.98657 13.8468C6.79122 13.6514 6.52627 13.5417 6.25 13.5417H3.125V16.6667Z" />
      <path d="M21.875 18.75V19.7917C21.875 20.6205 21.5458 21.4153 20.9597 22.0014C20.3737 22.5874 19.5788 22.9167 18.75 22.9167H14.5833" />
    </svg>
  );
}
