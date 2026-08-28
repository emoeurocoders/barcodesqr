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
 * Sizes are `em` against the 10px root that `page.tsx` sets, which is how the
 * designer wrote them and what lets the whole page scale with `2.1vw` below
 * 480px. The breakpoints are theirs too (992/576), not Tailwind's neighbours.
 */
export function TermsToc() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="box-border rounded-[1.4em] border border-[#e8eaef] bg-[#fbfcfd] p-[2em] shadow-[0_1px_2px_rgba(14,19,17,0.04)] to-768:px-[2.2em]">
      <h5 className="text-[1.6em] font-bold leading-[normal] text-ink">
        On This Page
      </h5>

      <ol className="mt-[1em] list-decimal pl-[2em] to-992:grid to-992:grid-cols-2 to-992:gap-x-[2.6em] to-576:grid-cols-1">
        {toc.map(({ id, label }, i) => (
          <li
            key={id}
            className={`mt-[0.45em] text-[1.4em] leading-[1.4em] marker:text-prose to-576:font-medium ${
              !open && i >= 10 ? "to-992:hidden" : ""
            }`}
          >
            <a
              href={`#${id}`}
              className="-ml-[0.2em] rounded-[0.5em] px-[0.5em] py-[0.2em] text-prose [box-decoration-break:clone] hover:text-primary"
            >
              {label}
            </a>
          </li>
        ))}
      </ol>

      {/*
        An <a href="#">, because that is what the designer wrote. It behaves as
        a button and would be better as one — raised in the handover rather
        than quietly changed here, since swapping it changes what a screen
        reader announces.
      */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="mt-[1.2em] hidden cursor-pointer items-center text-[1.4em] font-semibold text-primary to-992:inline-flex"
      >
        <span>
          {open ? "Show fewer sections" : `Show all ${toc.length} sections`}
        </span>
        <ChevronDownIcon
          className={`ml-[0.4em] h-[1.1em] w-[1.1em] shrink-0 transition-transform duration-[250ms] ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </a>
    </aside>
  );
}
