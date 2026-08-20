import type { SVGProps } from "react";

/**
 * Stand-in for the Google "G" mark on the Google Review type.
 *
 * Google's logo is a trademark we have no licence to display, so the type
 * keeps its name but gets a neutral speech-bubble-and-star icon instead.
 * Drawn rather than composed from two lucide icons so the star sits
 * optically centred inside the bubble at every size.
 */
export function ReviewIcon({
  className = "h-6 w-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M21 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
      <path
        d="m12.5 7.4 1.24 2.5 2.76.4-2 1.95.47 2.75-2.47-1.3-2.47 1.3.47-2.75-2-1.95 2.76-.4z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
