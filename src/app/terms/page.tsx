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
 * Spacing here is in pixels, not `em`, on purpose.
 *
 * The mockup puts `font-size: 10px` on `#mainTerms`, so every `em` gap in
 * its stylesheet resolves against 10px. Copying those numbers as `em` into a
 * 16px context inflates each one by 60% — worth about 21px per section,
 * which over thirty-one sections put the page ~950px out.
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
                className="mb-[0.65em] mt-[0.4em] text-base font-bold leading-[normal] text-ink"
              >
                {block.text}
              </h3>
            );

          case "list":
            // Ticked lists run in two columns; plain ones are ordinary discs.
            return block.ticked ? (
              <ul
                key={i}
                className="grid gap-x-[22px] gap-y-[6.5px] pb-[12px] sm:grid-cols-2"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start text-[14.5px] leading-[1.65em]">
                    <CheckCircleIcon className="mr-[0.6em] mt-[0.2em] h-[1.17em] w-[1.17em] shrink-0 text-primary" />
                    <span>
                      <Runs runs={item} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul key={i} className="list-disc pb-[10px] pl-[16px]">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="mt-[0.35em] text-[15px] leading-[1.65em] text-body marker:text-faint"
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
                className="mb-[14px] flex items-start rounded-[10px] border border-[#d8e5fd] bg-[#eff4ff] px-[13px] py-[11px]"
              >
                <InfoIcon className="mr-[0.7em] mt-[0.18em] h-[1.7em] w-[1.7em] shrink-0 text-primary" />
                <p className="text-sm leading-[1.65em] text-body [&_strong]:text-primary-dark">
                  <Runs runs={block.body} />
                </p>
              </div>
            );

          case "cards":
            return (
              <div
                key={i}
                className="mb-[14px] flex items-stretch gap-4 max-md:flex-col"
              >
                {block.cards.map((card, j) => (
                  <div
                    key={j}
                    className="box-border min-w-0 flex-1 rounded-xl border border-[#e8eaef] bg-[#fbfcfd] px-[18px] py-[17px]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#e9f0fb] text-primary">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[19px] w-[19px]"
                        aria-hidden="true"
                        // The designer's own shapes, lifted straight out of
                        // terms.html by the extractor.
                        dangerouslySetInnerHTML={{ __html: card.shapes.join("") }}
                      />
                    </span>
                    <h3 className="mb-[0.6em] mt-[1em] text-[15.5px] font-bold leading-[normal] text-primary">
                      {card.title}
                    </h3>
                    {card.paras.map((p, k) => (
                      <p
                        key={k}
                        className="pb-[1em] text-sm leading-[1.65em] text-body last:pb-0"
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
              <p key={i} className="pb-[1em] text-[15px] leading-[1.65em] text-body">
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
        <section className="relative overflow-hidden border-b border-[#eceef2] bg-[#fbfcfd]">
          <div className="container-frm relative pb-[38px] pt-[42px]">
            <p className="text-[12.5px] font-bold uppercase leading-[normal] tracking-[0.08em] text-primary">
              {hero.cap}
            </p>
            <h1 className="mt-[0.3em] text-[40px] font-extrabold leading-[normal] tracking-heading text-ink">
              {hero.title}
            </h1>
            <p className="mt-[0.9em] max-w-[32em] text-base leading-[1.6em] text-body">
              {hero.lead}
            </p>
            <p className="mt-[2em] flex items-center text-[13.5px] font-medium leading-[normal] text-[#374151]">
              <CalendarIcon className="mr-[0.6em] h-[1.18em] w-[1.18em] shrink-0 text-primary" />
              {hero.updated}
            </p>
          </div>
        </section>

        <section className="bg-white pb-[60px] pt-[32px]">
          <div className="container-frm">
            <div className="flex items-start max-lg:flex-col">
              <div className="shrink-0 basis-[300px] max-lg:w-full max-lg:basis-auto">
                <TermsToc />

                <div className="mt-4 box-border rounded-[14px] border border-[#e8eaef] bg-[#fbfcfd] p-5 shadow-[0_1px_2px_rgba(14,19,17,0.04)] max-md:px-[22px]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#e9f0fb] text-primary">
                    <MailIcon className="h-[19px] w-[19px]" />
                  </span>
                  <h2 className="mt-[1em] text-base font-bold leading-[normal] text-ink">
                    {ask.title}
                  </h2>
                  <p className="mt-[0.25em] text-sm leading-[normal] text-muted">{ask.desc}</p>
                  <a
                    href={`mailto:${ask.email}`}
                    className="mt-[0.7em] inline-block text-sm font-semibold leading-[normal] text-primary hover:text-brand-dark"
                  >
                    {ask.email}
                  </a>
                </div>
              </div>

              <article className="ml-6 box-border min-w-0 flex-1 rounded-2xl border border-[#e8eaef] bg-white px-9 pb-[22px] pt-8 shadow-[0_1px_2px_rgba(14,19,17,0.04)] max-lg:ml-0 max-lg:mt-5 max-lg:w-full max-md:px-[22px] max-md:py-[26px]">
                <div>
                  {intro.map((p, i) => (
                    <p
                      key={i}
                      className="pb-[1em] text-[15px] leading-[1.65em] text-body"
                    >
                      <Runs runs={p} />
                    </p>
                  ))}
                </div>

                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="mt-[14px] scroll-mt-[20px] border-t border-[#eceef2] pt-[22px]"
                  >
                    <h2 className="mb-[0.75em] text-[22px] font-extrabold leading-[1.3em] tracking-[-0.01em] text-ink">
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
