"use client";

import Link from "next/link";
import { openLiveHelp } from "@/components/support/crisp";

/**
 * The mockups' `#mainSlimFooter`: four centred items, gray, Live Help bold
 * with its chat glyph. Not the dashboard's SlimFooter, which is a different
 * (left-aligned) design. Below 640 the copyright wraps to its own last line.
 */
export function MainSlimFooter() {
  const year = new Date().getFullYear();
  const item = "px-[0.6em]";
  const link = "inline-flex items-center whitespace-nowrap text-prose hover:text-ink";

  return (
    <section className="border-t border-line bg-white py-[30px] text-center text-[14px] leading-[normal] [@media(max-width:480px)]:text-[3vw]">
      <div className="mx-auto max-w-[1240px] px-5">
        <ul className="mx-auto flex justify-center text-prose [@media(max-width:640px)]:flex-wrap">
          <li className={`${item} [@media(max-width:640px)]:order-10 [@media(max-width:640px)]:mt-[0.6em] [@media(max-width:640px)]:min-w-full`}>
            &copy; {year} BarcodesQR.
          </li>
          <li className={item}>
            <Link href="/legal/privacy" className={link}>
              Privacy Policy
            </Link>
          </li>
          <li className={item}>
            <Link href="/terms" className={link}>
              Terms &amp; Conditions
            </Link>
          </li>
          <li className={item}>
            {/* Their `href="#"` was always a stand-in for opening the chat. */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openLiveHelp();
              }}
              className={`${link} font-semibold`}
            >
              Live Help
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-[0.425em] max-h-[1.1428em] max-w-[1.1428em] min-w-[1.1428em]"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
