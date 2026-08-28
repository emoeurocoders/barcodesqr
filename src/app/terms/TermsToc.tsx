"use client";

import { useEffect, useState } from "react";
import { toc } from "./content";
import { ChevronDownIcon } from "./TermsIcons";

/**
 * The contents list, and the two behaviours the mockup's CSS asks for.
 *
 * `.cur` is styled in `default.css` but nothing in the designer's JS ever
 * sets it, so the highlight is implemented here — the stylesheet plainly
 * intends the current section to be marked, and a thirty-one item list is
 * hard to keep your place in without it.
 *
 * The collapse is the designer's: below 992px the list shows ten entries
 * behind a "Show all 31 sections" toggle, and their handler swaps that copy
 * for "Show fewer sections".
 */
export function TermsToc() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>();

  useEffect(() => {
    const headings = toc
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;

    // Track the last section whose top has passed the reading line, so the
    // highlight follows what is actually being read rather than whatever
    // happens to be intersecting.
    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.25;
        const passed = headings.filter((el) => el.getBoundingClientRect().top <= line);
        setCurrent((passed[passed.length - 1] ?? headings[0]).id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="box-border rounded-[14px] border border-[#e8eaef] bg-[#fbfcfd] p-5 shadow-[0_1px_2px_rgba(14,19,17,0.04)] max-md:px-[22px]">
      <h2 className="text-base font-bold leading-[normal] text-ink">On This Page</h2>

      <ol className="mt-2.5 grid list-decimal pl-5 max-lg:grid-cols-2 max-lg:gap-x-[26px]">
        {toc.map(({ id, label }, i) => (
          <li
            key={id}
            className={`mt-[6.3px] text-sm leading-[1.4em] marker:text-body ${
              current === id ? "marker:font-semibold marker:text-primary" : ""
            } ${!open && i >= 10 ? "max-lg:hidden" : ""}`}
          >
            <a
              href={`#${id}`}
              className={`-ml-[0.2em] rounded-[0.5em] px-[0.5em] py-[0.2em] [box-decoration-break:clone] hover:text-primary ${
                current === id
                  ? "bg-[#eff4ff] font-semibold text-primary"
                  : "text-body"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 hidden cursor-pointer items-center text-sm font-semibold text-primary max-lg:inline-flex"
      >
        <span>{open ? "Show fewer sections" : `Show all ${toc.length} sections`}</span>
        <ChevronDownIcon
          className={`ml-[0.4em] h-[1.1em] w-[1.1em] transition-transform duration-[250ms] ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </aside>
  );
}
