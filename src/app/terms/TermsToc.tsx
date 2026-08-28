"use client";

import { useState } from "react";
import { toc } from "./content";
import { ChevronDownIcon } from "./TermsIcons";

/**
 * The contents list.
 *
 * Nothing marks the section you are currently reading. `default.css` does
 * carry a `.cur` rule for it, but nothing in the designer's JS ever sets that
 * class, so the mockup shows no highlight — and a highlight we invented sat
 * on section 1 from the moment the page loaded, before anyone had scrolled.
 * If the active state is wanted, the styling is already written and this is
 * where the observer would go.
 *
 * The collapse below 992px is the designer's: ten entries behind a
 * "Show all 31 sections" toggle, whose copy their handler swaps for
 * "Show fewer sections".
 */
export function TermsToc() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="box-border rounded-[14px] border border-[#e8eaef] bg-[#fbfcfd] p-5 shadow-[0_1px_2px_rgba(14,19,17,0.04)] max-md:px-[22px]">
      <h2 className="text-base font-bold leading-[normal] text-ink">
        On This Page
      </h2>

      <ol className="mt-2.5 grid list-decimal pl-5 max-lg:grid-cols-2 max-lg:gap-x-[26px]">
        {toc.map(({ id, label }, i) => (
          <li
            key={id}
            className={`mt-[6.3px] text-sm leading-[1.4em] marker:text-body ${
              !open && i >= 10 ? "max-lg:hidden" : ""
            }`}
          >
            <a
              href={`#${id}`}
              className="-ml-[0.2em] rounded-[0.5em] px-[0.5em] py-[0.2em] text-body [box-decoration-break:clone] hover:text-primary"
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
        <span>
          {open ? "Show fewer sections" : `Show all ${toc.length} sections`}
        </span>
        <ChevronDownIcon
          className={`ml-[0.4em] h-[1.1em] w-[1.1em] transition-transform duration-[250ms] ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </aside>
  );
}
