"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { openLiveHelp } from "@/components/support/crisp";

/**
 * One footer `.col`, which main_mobile.html turns into an accordion row below
 * `md:` — `.col a { display: none }` until `.col.open`. From `md:` up it is
 * their heading over a stack of links, the links always shown and the toggle
 * inert (`pointer-events-none`), so a stray click cannot leave a column in a
 * state nothing reflects.
 *
 * Their markup is `div.col > h5.ln1 + a…`, the links bare children of the
 * column. They are kept that way: the open state is put on the column as
 * `data-open`, and each link (see `footerLinkClass`) shows itself off the
 * `group-data-[open=true]` variant rather than through a wrapping list.
 *
 * Their <h5> is the click target. Here a <button> inside it is, because a
 * clickable heading is unreachable by keyboard — one node more than their
 * file, and the only one.
 *
 * Client-side only because of that state — the rest of the footer stays a
 * server component, which is why this is its own file.
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
      data-open={open}
      className="group border-b border-hero-divider data-[open=true]:pb-3 md:border-0 md:data-[open=true]:pb-0 [@media(min-width:768px)_and_(max-width:1080px)]:mt-[3.5em] [@media(min-width:768px)_and_(max-width:1080px)]:max-w-[33.33%] [@media(min-width:768px)_and_(max-width:1080px)]:flex-auto [@media(min-width:768px)_and_(max-width:1080px)]:basis-[26%]"
    >
      <h5 className="text-[16px] font-bold text-black md:mb-[1.2em] [@media(min-width:768px)_and_(max-width:1080px)]:mb-[0.8em]">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer select-none items-center justify-between py-[18px] text-left font-bold md:pointer-events-none md:block md:w-auto md:py-0"
        >
          {title}
          {/* Their `.ln1:after`: main_faq_ico_chevron.svg, inlined. */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 transition-transform duration-[250ms] ease-out md:hidden ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h5>
      {children}
    </div>
  );
}

/**
 * Their `.col a`: hidden on mobile until the column opens, then a 40px-tall
 * 14px row; from `md:` up a 14.5px line, 0.9em under the one above.
 */
export const footerLinkClass =
  "hidden min-h-[40px] items-center text-[14px] text-prose transition-colors hover:text-ink group-data-[open=true]:flex md:mt-[0.9em] md:flex md:min-h-0 md:text-[14.5px]";

function LiveHelpGlyph({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  );
}

/**
 * Their two "Live Help" links — `.footLive` in the Support column, and the
 * mobile-only `.hlp` button beside the logo. Both are `href="#"` in the mockup
 * and open the Crisp chat here. They stay links, to /help, so that with the
 * chat unavailable (no website id, script blocked) the click still lands
 * somewhere useful.
 */
function openChat(e: React.MouseEvent) {
  if (typeof window === "undefined" || !window.$crisp) return;
  e.preventDefault();
  openLiveHelp();
}

export function FooterLiveHelp() {
  return (
    <Link
      href="/help"
      onClick={openChat}
      className={`${footerLinkClass} font-semibold`}
    >
      Live Help
      <span className="text-primary">
        <LiveHelpGlyph className="ml-[0.425em] inline max-h-[1.1428em] align-baseline min-w-[1.1428em] max-w-[1.1428em]" />
      </span>
    </Link>
  );
}

/**
 * The `.hlp` button. Above 390px their `font-size: ;` is an empty declaration
 * and drops out, leaving 13px; at 390 and below it is 3.3vw.
 */
export function FooterHelpButton() {
  return (
    <Link
      href="/help"
      onClick={openChat}
      className="absolute right-0 top-0 inline-flex h-[3.38em] items-center gap-[0.45em] rounded-[0.76em] border border-primary bg-white px-[1em] text-[13px] font-bold text-primary md:hidden [@media(max-width:390px)]:text-[3.3vw]"
    >
      <LiveHelpGlyph className="h-5 w-5" />
      Live Help
    </Link>
  );
}
