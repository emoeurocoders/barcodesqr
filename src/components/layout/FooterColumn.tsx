"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * One footer column, which main_mobile.html turns into an accordion row below
 * `md:` — `.col a { display: none }` until `.col.open`. From `md:` up it is the
 * heading-over-list it has always been, and the toggle is inert: the list is
 * shown unconditionally there, and the trigger takes `pointer-events-none` so a
 * stray click cannot leave a column in a state nothing reflects.
 *
 * Client-side only because of that state — the rest of the footer stays a
 * server component, which is why this is its own file rather than a function
 * inside Footer.tsx.
 */
export function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-hero-divider md:border-0 ${
        open ? "pb-3 md:pb-0" : ""
      }`}
    >
      <h4 className="text-sm font-bold text-ink">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer select-none items-center justify-between py-[18px] text-left text-[16px] md:pointer-events-none md:block md:py-0 md:text-sm"
        >
          {title}
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 transition-transform duration-[250ms] ease-out md:hidden ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h4>

      {/* `space-y` would put a margin between rows that their 40px min-height
          already accounts for, so it only applies from `md:` up. */}
      <ul
        className={`mt-0 space-y-0 md:mt-4 md:block md:space-y-2.5 ${
          open ? "block" : "hidden"
        }`}
      >
        {children}
      </ul>
    </div>
  );
}
