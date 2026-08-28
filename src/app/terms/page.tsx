import { Fragment } from "react";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { hero, ask, intro, sections } from "./content";
import type { Block, Run } from "./content";
import { TermsToc } from "./TermsToc";
import {
  CalendarIcon,
  MailIcon,
  CheckCircleIcon,
  InfoIcon,
} from "./TermsIcons";

export const metadata: Metadata = {
  title: "Terms & Conditions — BarcodesQR",
  description:
    "These Terms & Conditions govern your access to and use of BarcodesQR.com and the QR code creation and management services we provide.",
};

/**
 * Inline text: plain runs, bold, links and the occasional break.
 *
 * Links are `next/link` for our own routes and plain anchors for `mailto:`
 * and the one external address, which is what they are in the mockup too.
 */
function Runs({ runs }: { runs: readonly Run[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (run.br) return <br key={i} />;
        if (run.href) {
          return (
            <a
              key={i}
              href={run.href}
              className="font-medium text-primary hover:text-brand-dark"
              {...(run.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {run.t}
            </a>
          );
        }
        if (run.strong) {
          return (
            <strong key={i} className="font-semibold text-body">
              {run.t}
            </strong>
          );
        }
        // Bare text, not a <span>: the designer's paragraphs are one text
        // node with the odd inline tag in them, and wrapping every run
        // changes both the DOM and what a screen reader chunks together.
        return <Fragment key={i}>{run.t}</Fragment>;
      })}
    </>
  );
}

/**
 * Every size below is the designer's own `em` value, unconverted.
 *
 * `#mainTerms` carries `font-size: 10px`, so their `1.5em` body copy is 15px
 * and their `2.2em` heading is 22px. Reproducing that root is not a detail:
 * under 480px they swap it for `2.1vw` and the entire page — type, padding,
 * icons, the sidebar's 30em column — scales from that one declaration.
 * Hard-coding the desktop pixels, as this file used to, silently opts out of
 * that and leaves the phone layout ~20% oversized.
 *
 * `em` padding and margins resolve against the element's OWN font-size, so
 * they only line up while each element's font-size matches the mockup's too.
 */
function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h3":
            return (
              <h3
                key={i}
                className="mb-[0.65em] mt-[0.4em] text-[1.6em] font-bold leading-[normal] text-ink"
              >
                {block.text}
              </h3>
            );

          case "list":
            // Ticked lists run in two columns; plain ones are ordinary discs.
            // The ticked <li> holds the icon and then a bare text node, as the
            // designer's does — an anonymous flex item lays out the same as a
            // <span> would, and the wrapper showed up in the skeleton diff.
            return block.ticked ? (
              <ul
                key={i}
                className="grid grid-cols-2 gap-x-[2.2em] gap-y-[0.65em] pb-[1.2em] to-768:grid-cols-1"
              >
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex list-none items-start text-[1.45em] leading-[1.65em] text-prose to-576:font-medium"
                  >
                    <CheckCircleIcon className="mr-[0.6em] mt-[0.2em] h-[1.17em] w-[1.17em] shrink-0 text-primary to-480:h-[2.3vw] to-480:min-h-[12px] to-480:w-[2.3vw] to-480:min-w-[12px]" />
                    <Runs runs={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul key={i} className="list-disc pb-[1em] pl-[1.6em]">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="mt-[0.35em] text-[1.5em] leading-[1.65em] text-prose marker:text-faint to-576:font-medium"
                  >
                    <Runs runs={item} />
                  </li>
                ))}
              </ul>
            );

          case "note":
            return (
              <div
                key={i}
                className="mb-[1.4em] flex items-start rounded-[1em] border border-[#d8e5fd] bg-[#eff4ff] px-[1.3em] py-[1.1em]"
              >
                <InfoIcon className="mr-[0.7em] mt-[0.18em] h-[1.7em] w-[1.7em] shrink-0 text-primary" />
                <p className="p-0 text-[1.4em] leading-[1.65em] text-prose to-576:font-medium [&_strong]:text-primary-dark">
                  <Runs runs={block.body} />
                </p>
              </div>
            );

          case "cards":
            return (
              <div
                key={i}
                className="mb-[1.4em] flex items-stretch gap-[1.6em] to-768:flex-col"
              >
                {block.cards.map((card, j) => (
                  <div
                    key={j}
                    className="box-border min-w-0 flex-1 rounded-[1.2em] border border-[#e8eaef] bg-[#fbfcfd] px-[1.8em] py-[1.7em]"
                  >
                    <span className="flex h-[4em] w-[4em] items-center justify-center rounded-[1em] bg-[#e9f0fb] text-primary">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[1.9em] w-[1.9em]"
                        aria-hidden="true"
                        // The designer's own shapes, lifted straight out of
                        // terms.html by the extractor.
                        dangerouslySetInnerHTML={{ __html: card.shapes.join("") }}
                      />
                    </span>
                    <h3 className="mb-[0.6em] mt-[1em] text-[1.55em] font-bold leading-[normal] text-primary">
                      {card.title}
                    </h3>
                    {card.paras.map((p, k) => (
                      <p
                        key={k}
                        className="pb-[1em] text-[1.4em] leading-[1.65em] text-prose last:pb-0 to-576:font-medium"
                      >
                        <Runs runs={p} />
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            );

          default:
            return (
              <p
                key={i}
                className="pb-[1em] text-[1.5em] leading-[1.65em] text-prose to-576:font-medium"
              >
                <Runs runs={block.body} />
              </p>
            );
        }
      })}
    </>
  );
}

export default async function TermsPage() {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />

      <main className="leading-[normal]">
        <section
          id="mainTermsHero"
          className="relative overflow-hidden border-b border-[#eceef2] bg-[#fbfcfd] text-[10px] to-480:text-[2.1vw]"
        >
          <div className="container-frm relative pb-[3.8em] pt-[4.2em]">
            <p className="text-[1.25em] font-bold uppercase leading-[normal] tracking-[0.08em] text-primary">
              {hero.cap}
            </p>
            {/*
              An <h2> in black, not an <h1> in --color-ink: the designer's only
              <h1> is the site logo in the header on every page, and `.ln1` sets
              no colour, so their title computes to pure black while their
              section headings are #0e1311. Both reproduced, both flagged in the
              handover.
            */}
            <h2 className="mt-[0.3em] text-[4em] font-extrabold leading-[normal] tracking-heading text-black">
              {hero.title}
            </h2>
            <p className="mt-[0.9em] max-w-[32em] text-[1.6em] leading-[1.6em] text-prose">
              {hero.lead}
            </p>
            <p className="mt-[2em] flex items-center text-[1.35em] font-medium leading-[normal] text-body">
              <CalendarIcon className="mr-[0.6em] h-[1.18em] w-[1.18em] shrink-0 text-primary" />
              {hero.updated}
            </p>
          </div>
        </section>

        {/* The 10px root, and the 2.1vw that replaces it on phones. */}
        <section
          id="mainTerms"
          className="bg-white pb-[6em] pt-[3.2em] text-[10px] to-480:text-[2.1vw]"
        >
          <div className="container-frm">
            <div className="flex items-start to-992:flex-col">
              <div className="shrink-0 basis-[30em] to-992:w-full to-992:basis-auto">
                <TermsToc />

                <div className="mt-[1.6em] box-border rounded-[1.4em] border border-[#e8eaef] bg-[#fbfcfd] p-[2em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
                  <span className="flex h-[4em] w-[4em] items-center justify-center rounded-[1em] bg-[#e9f0fb] text-primary">
                    <MailIcon className="h-[1.9em] w-[1.9em]" />
                  </span>
                  <h5 className="mt-[1em] text-[1.6em] font-bold leading-[normal] text-ink">
                    {ask.title}
                  </h5>
                  <p className="mt-[0.25em] text-[1.4em] leading-[normal] text-muted">
                    {ask.desc}
                  </p>
                  <a
                    href={`mailto:${ask.email}`}
                    className="mt-[0.7em] inline-block text-[1.4em] font-semibold leading-[normal] text-primary hover:text-brand-dark"
                  >
                    {ask.email}
                  </a>
                </div>
              </div>

              <article className="ml-[2.4em] box-border min-w-0 flex-1 rounded-[1.6em] border border-[#e8eaef] bg-white px-[3.6em] pb-[2.2em] pt-[3.2em] shadow-[0_1px_2px_rgba(14,19,17,0.04)] to-992:ml-0 to-992:mt-[2em] to-992:w-full to-768:px-[2.2em] to-768:py-[2.6em]">
                <div>
                  {intro.map((p, i) => (
                    <p
                      key={i}
                      className="pb-[1em] text-[1.5em] leading-[1.65em] text-prose to-576:font-medium"
                    >
                      <Runs runs={p} />
                    </p>
                  ))}
                </div>

                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="mt-[1.4em] scroll-mt-[2em] border-t border-[#eceef2] pt-[2.2em]"
                  >
                    <h2 className="mb-[0.75em] text-[2.2em] font-extrabold leading-[1.3em] tracking-[-0.01em] text-ink">
                      {section.heading}
                    </h2>
                    <Blocks blocks={section.blocks} />
                  </section>
                ))}
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
