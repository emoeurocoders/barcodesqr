import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck, Info } from "lucide-react";

import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  article,
  articleSections,
  articleSidebar,
  bestPractices,
  gettingStarted,
  relatedArticles,
  sidebarPopular,
  vote,
} from "../../content";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "../../icons";
import { HelpCrumbs, HelpCtaBand, HelpSidebar } from "../../HelpChrome";

export const metadata: Metadata = {
  title: `${article.title} — Help Center — BarcodesQR`,
  description: article.intro,
};

export default async function ArticlePage() {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />
      <HelpCrumbs current={gettingStarted.title} />

      <section className="bg-white pb-[46px] pt-[40px] text-[10px] to-480:text-[2.1vw]">
        <div className="container-frm flex items-start to-992:flex-col">
          {/* Their <article>, kept as an <article>. */}
          <article className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-help-tag-line bg-help-tag px-[1.1em] py-[0.45em] text-[1.15em] font-bold uppercase leading-[normal] tracking-[0.07em] text-brand-dark">
              {article.tag}
            </span>

            <h2 className="mt-[0.45em] max-w-[13em] text-[3.8em] font-extrabold leading-[1.15em] tracking-heading text-black to-992:text-[3.2em] to-480:text-[7.8vw]">
              {article.title}
            </h2>

            <div className="mt-[1.3em] flex flex-wrap items-center text-[1.35em] text-muted">
              <span className="flex items-center">
                <CalendarIcon className="mr-[0.5em] h-[1.11em] w-[1.11em] shrink-0" />
                {article.updated}
              </span>
              {/* Their separator is an <i>, not a span. */}
              <i className="mx-[0.9em] block h-[3px] w-[3px] rounded-full bg-faint" />
              <span className="flex items-center">
                <ClockIcon className="mr-[0.5em] h-[1.11em] w-[1.11em] shrink-0" />
                {article.readTime}
              </span>
            </div>

            <p className="mt-[1.35em] max-w-[32em] p-0 text-[1.5em] leading-[1.65em] text-prose to-576:font-medium">
              {article.intro}
            </p>

            <div className="mt-[1.8em] flex items-start rounded-[1em] border border-[#ddf0ee] bg-[#f2f9f8] px-[1.6em] py-[1.5em]">
              <Info className="mr-[0.75em] mt-[0.15em] h-[1.8em] w-[1.8em] shrink-0 text-brand" />
              <p className="max-w-none p-0 text-[1.45em] leading-[1.65em] text-prose to-576:font-medium">
                {article.note}
              </p>
            </div>

            {articleSections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="mt-[2.6em] scroll-mt-[2em]"
              >
                <h3 className="mb-[0.6em] text-[1.8em] font-bold leading-[normal] text-ink">
                  {s.heading}
                </h3>
                <p className="max-w-[32em] p-0 text-[1.5em] leading-[1.65em] text-prose to-576:font-medium">
                  {s.body}
                </p>
                {"shot" in s && s.shot && (
                  <div className="mt-[20px] overflow-hidden rounded-[12px] border border-help-panel-line shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.shot.src}
                      alt={article.shot.alt}
                      className="block w-full"
                    />
                  </div>
                )}
              </section>
            ))}

            {/* Best practices */}
            <div
              id={bestPractices.id}
              className="mt-[2.6em] scroll-mt-[2em] border-t border-hero-line pt-[2.2em]"
            >
              <div className="flex items-center">
                <CircleCheck className="mr-[0.9em] h-[1.9em] w-[1.9em] shrink-0 text-primary" />
                <h3 className="text-[1.7em] font-bold leading-[normal] text-ink">
                  {bestPractices.heading}
                </h3>
              </div>
              <ul className="pl-[3em] pt-[1em]">
                {bestPractices.items.map((li) => (
                  <li
                    key={li}
                    className="mt-[0.35em] list-disc text-[1.45em] leading-[1.65em] text-prose marker:text-faint to-576:font-medium"
                  >
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related articles */}
            <div id={relatedArticles.id} className="mt-[2.6em] scroll-mt-[2em]">
              <h3 className="text-[1.7em] font-bold leading-[normal] text-ink">
                {relatedArticles.heading}
              </h3>
              <div className="mt-[1.2em] grid grid-cols-2 gap-x-[2.4em] gap-y-[1em] to-768:grid-cols-1">
                {relatedArticles.items.map((r) => (
                  <a
                    key={r}
                    href="#"
                    className="flex items-center text-[1.4em] font-medium text-body hover:text-primary"
                  >
                    <FileTextIcon className="mr-[0.6em] h-[1.14em] w-[1.14em] shrink-0 text-primary" />
                    {r}
                  </a>
                ))}
              </div>
            </div>

            {/* Was this helpful? */}
            <div className="mt-[2.6em] flex items-center justify-between rounded-[12px] border border-help-card-line bg-hero-tint px-[2.2em] py-[1.8em] to-768:flex-col to-768:text-center">
              <div>
                <p className="p-0 text-[1.6em] font-bold leading-[normal] text-ink">
                  {vote.title}
                </p>
                <p className="mt-[0.3em] p-0 text-[1.3em] leading-[normal] text-muted">
                  {vote.body}
                </p>
              </div>
              <div className="ml-[2em] flex shrink-0 to-768:ml-0 to-768:mt-[1.4em]">
                <a
                  href="#"
                  className="inline-flex items-center rounded-[9px] border border-[#d7dde2] bg-white px-[18px] py-[9px] text-[14px] font-semibold text-body hover:border-primary hover:text-primary to-480:text-[13px]"
                >
                  <ThumbsUpIcon className="mr-[0.5em] h-[1.14em] w-[1.14em] shrink-0" />
                  {vote.yes}
                </a>
                <a
                  href="#"
                  className="ml-[10px] inline-flex items-center rounded-[9px] border border-[#d7dde2] bg-white px-[18px] py-[9px] text-[14px] font-semibold text-body hover:border-primary hover:text-primary to-480:text-[13px]"
                >
                  <ThumbsDownIcon className="mr-[0.5em] h-[1.14em] w-[1.14em] shrink-0" />
                  {vote.no}
                </a>
              </div>
            </div>
          </article>

          {/* The article's sidebar swaps "Other categories" for a table of
              contents and a popular-articles list. */}
          <HelpSidebar>
            <div className="mt-[2em] box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
              <h5 className="text-[1.6em] font-bold leading-[normal] text-ink">
                {articleSidebar.tocHeading}
              </h5>
              <ol className="mt-[1em] pl-[2em]">
                {articleSections.map((s) => (
                  <li
                    key={s.id}
                    className="mt-[0.6em] list-decimal text-[1.4em] leading-[1.45em] marker:text-muted to-576:font-medium"
                  >
                    <a href={`#${s.id}`} className="text-prose hover:text-primary">
                      {s.toc}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="my-[1.4em] h-px bg-hero-line" />
              <a
                href={`#${bestPractices.id}`}
                className="mt-[0.6em] block text-[1.4em] text-prose hover:text-primary"
              >
                {bestPractices.heading}
              </a>
              <a
                href={`#${relatedArticles.id}`}
                className="mt-[0.6em] block text-[1.4em] text-prose hover:text-primary"
              >
                {relatedArticles.heading}
              </a>
            </div>

            <div className="mt-[2em] box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
              <h5 className="text-[1.6em] font-bold leading-[normal] text-ink">
                {articleSidebar.popularHeading}
              </h5>
              <div className="mt-[0.4em]">
                {sidebarPopular.map((t) => (
                  <a
                    key={t}
                    href="#"
                    className="mt-[0.75em] flex items-start text-[1.35em] leading-[1.45em] text-body hover:text-primary"
                  >
                    <FileTextIcon className="mr-[0.6em] mt-[0.1em] h-[1.11em] w-[1.11em] shrink-0 text-muted" />
                    {t}
                  </a>
                ))}
              </div>
              <Link
                href="/help"
                className="mt-[1em] inline-flex items-center text-[1.4em] font-semibold text-primary hover:text-primary-press"
              >
                {articleSidebar.viewAll}
                <ArrowRight className="ml-[0.43em] h-[1.07em] w-[1.07em] shrink-0" />
              </Link>
            </div>
          </HelpSidebar>
        </div>
      </section>

      <HelpCtaBand />
      <Footer />
    </>
  );
}
