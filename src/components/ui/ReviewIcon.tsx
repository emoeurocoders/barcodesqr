import type { SVGProps } from "react";

/**
 * The Google Review type's glyph — a review bubble with a star, copied path
 * for path from the designer's `create.html`.
 *
 * It replaced the multi-coloured Google "G" that was in the mockup until
 * 2026-08-27, which resolves the trademark problem the type carried: the
 * name says where the code points, and nothing here reproduces Google's mark.
 *
 * The colour is baked into the artwork rather than inherited, exactly as the
 * designer drew it, so this ignores `currentColor` on purpose.
 */
export function ReviewIcon({
  className = "h-6 w-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="#dc3c2a"
      stroke="#dc3c2a"
      strokeWidth="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="m20.03 14.084c0-.497-.403-.9-.9-.9h-9.9c-.497 0-.9.403-.9.9s.403.9.9.9h9.9c.497 0 .9-.403.9-.9z" />
      <path d="m9.228 17.729c-.497 0-.9.403-.9.9s.403.9.9.9h5.249c.497 0 .9-.403.9-.9s-.403-.9-.9-.9z" />
      <path d="m25.96 14.134c-.497 0-.9.403-.9.9v7.279c0 1.362-1.108 2.47-2.47 2.47h-6.02c-.195 0-.385.063-.541.181l-5.198 3.909c-.132.099-.256.058-.318.024-.063-.032-.167-.111-.163-.272l.1-2.91c.008-.244-.083-.481-.252-.656-.169-.176-.403-.275-.647-.275h-4.181c-1.362 0-2.47-1.107-2.47-2.47v-11.9c0-1.367 1.108-2.479 2.47-2.479h11.09c.497 0 .9-.403.9-.9s-.403-.9-.9-.9h-11.09c-2.354 0-4.27 1.92-4.27 4.28v11.899c0 2.354 1.916 4.271 4.27 4.271h3.249l-.068 1.982c-.024.814.409 1.554 1.132 1.929.309.161.642.24.972.24.443 0 .882-.143 1.256-.422l4.959-3.729h5.719c2.354 0 4.27-1.916 4.27-4.271v-7.279c.001-.498-.402-.901-.899-.901z" />
      <path d="m30.825 5.561c-.163-.5-.564-.874-1.073-1l-2.3-.573-1.256-2.01c-.557-.894-2.011-.892-2.567 0l-1.256 2.01-2.3.573c-.509.126-.911.5-1.073 1s-.058 1.039.28 1.442l1.524 1.814-.166 2.364c-.037.524.195 1.021.62 1.33.264.192.574.291.888.291.191 0 .384-.037.569-.112l2.198-.888 2.197.888c.487.198 1.031.13 1.457-.178.425-.309.657-.806.621-1.331l-.166-2.364 1.524-1.815c.337-.402.442-.941.279-1.441zm-3.416 2.377c-.15.179-.225.409-.208.643l.16 2.27-2.11-.853c-.108-.044-.223-.066-.337-.066s-.229.022-.337.066l-2.109.853.159-2.27c.016-.233-.059-.464-.208-.643l-1.463-1.742 2.208-.551c.226-.057.422-.198.545-.396l1.206-1.929 1.206 1.929c.124.198.319.34.545.396l2.208.551z" />
    </svg>
  );
}
