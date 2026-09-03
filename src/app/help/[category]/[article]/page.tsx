import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleCheck, Info } from "lucide-react";

import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { articleAt, articles, type ArticleLink } from "../../articles";
import { bySlug } from "../../categories";
import { articleSidebar, vote } from "../../content";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "../../icons";
import { HelpCrumbs, HelpCtaBand, HelpSidebar, MaybeLink } from "../../HelpChrome";

/**
 * One template for every help article.
 *
 * The designer ships them as six near-identical files that differ only in
 * their words, so the markup lives here once and the copy lives in
 * articles.ts.
 */

export function generateStaticParams() {
  return articles.map((a) => ({ category: a.category, article: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; article: string }>;
}): Promise<Metadata> {
  const { category, article } = await params;
  const a = articleAt(category, article);
  if (!a) return {};
  return {
    title: `${a.title} — Help Center — BarcodesQR`,
    description: a.intro,
  };
}

/** A related/popular row: a file icon and a title, linked when it exists. */
function LinkRow({ link, className }: { link: ArticleLink; className: string }) {
  return (
    <MaybeLink href={link.href} className={className}>
      <FileTextIcon className="mr-[0.6em] mt-[0.1em] h-[1.11em] w-[1.11em] shrink-0 text-primary" />
      {link.title}
    </MaybeLink>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; article: string }>;
}) {
  const { category, article } = await params;
  const a = articleAt(category, article);
  if (!a) notFound();

  const cat = bySlug(a.category);
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />
      <HelpCrumbs
        category={cat?.title ?? a.category}
        categoryHref={`/help/${a.category}`}
        article={a.title}
      />

      <section className="bg-white pb-[46px] pt-[40px] text-[10px] to-480:text-[2.1vw]">
        <div className="container-frm flex items-start to-992:flex-col">
          <article className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-help-tag-line bg-help-tag px-[1.1em] py-[0.45em] text-[1.15em] font-bold uppercase leading-[normal] tracking-[0.07em] text-brand-dark">
              {cat?.title ?? a.category}
            </span>

            <h2 className="mt-[0.45em] max-w-[13em] text-[3.8em] font-extrabold leading-[1.15em] tracking-heading text-black to-992:text-[3.2em] to-480:text-[7.8vw]">
              {a.title}
            </h2>

            <div className="mt-[1.3em] flex flex-wrap items-center text-[1.35em] leading-[normal] text-muted">
              <span className="flex items-center">
                <CalendarIcon className="mr-[0.5em] h-[1.11em] w-[1.11em] shrink-0" />
                {a.updated}
              </span>
              {/* Their separator is an <i>, not a span. */}
              <i className="mx-[0.9em] block h-[3px] w-[3px] rounded-full bg-faint" />
              <span className="flex items-center">
                <ClockIcon className="mr-[0.5em] h-[1.11em] w-[1.11em] shrink-0" />
                {a.readTime}
              </span>
            </div>

            <p className="mt-[1.35em] max-w-[32em] p-0 text-[1.5em] leading-[1.65em] text-prose to-576:font-medium">
              {a.intro}
            </p>

            {a.note && (
              <div className="mt-[1.8em] flex items-start rounded-[1em] border border-[#ddf0ee] bg-[#f2f9f8] px-[1.6em] py-[1.5em]">
                <Info className="mr-[0.75em] mt-[0.15em] h-[1.8em] w-[1.8em] shrink-0 text-brand" />
                <p className="max-w-none p-0 text-[1.45em] leading-[1.65em] text-prose to-576:font-medium">
                  {a.note}
                </p>
              </div>
            )}

            {a.sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-[2.6em] scroll-mt-[2em]">
                <h3 className="mb-[0.6em] text-[1.8em] font-bold leading-[normal] text-ink">
                  {s.heading}
                </h3>
                {s.paras.map((p, i) => (
                  <p
                    key={i}
                    className="max-w-[32em] p-0 text-[1.5em] leading-[1.65em] text-prose to-576:font-medium"
                  >
                    {p}
                  </p>
                ))}
                {s.img && (
                  <div className="mt-[20px] overflow-hidden rounded-[12px] border border-help-panel-line shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img.src} alt={s.img.alt} className="block w-full" />
                  </div>
                )}
              </section>
            ))}

            {a.best && (
              <div
                id={a.best.id}
                className="mt-[2.6em] scroll-mt-[2em] border-t border-hero-line pt-[2.2em]"
              >
                <div className="flex items-center">
                  <CircleCheck className="mr-[0.9em] h-[1.9em] w-[1.9em] shrink-0 text-primary" />
                  <h3 className="text-[1.7em] font-bold leading-[normal] text-ink">
                    {a.best.heading}
                  </h3>
                </div>
                <ul className="pl-[3em] pt-[1em]">
                  {a.best.items.map((li) => (
                    <li
                      key={li}
                      className="mt-[0.35em] list-disc text-[1.45em] leading-[1.65em] text-prose marker:text-faint to-576:font-medium"
                    >
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div id={a.relId} className="mt-[2.6em] scroll-mt-[2em]">
              <h3 className="text-[1.7em] font-bold leading-[normal] text-ink">
                {articleSidebar.relatedHeading}
              </h3>
              <div className="mt-[1.2em] grid grid-cols-2 gap-x-[2.4em] gap-y-[1em] to-768:grid-cols-1">
                {a.related.map((r) => (
                  <LinkRow
                    key={r.title}
                    link={r}
                    className="flex items-center text-[1.4em] font-medium leading-[normal] text-body hover:text-primary"
                  />
                ))}
              </div>
            </div>

            <div className="mt-[2.6em] flex items-center justify-between rounded-[12px] border border-help-card-line bg-hero-tint px-[2.2em] py-[1.8em] to-768:flex-col to-768:text-center">
              <div>
                {/* Their line-heights here are inherited, not `normal`:
                    18.4px on 16px and 21.45px on 13px, measured. */}
                <p className="mt-[0.45em] p-0 text-[1.6em] font-bold leading-[1.15em] text-ink">
                  {vote.title}
                </p>
                <p className="mt-[0.3em] p-0 text-[1.3em] leading-[1.65em] text-muted">
                  {vote.body}
                </p>
              </div>
              <div className="ml-[2em] flex shrink-0 to-768:ml-0 to-768:mt-[1.4em]">
                <a
                  href="#"
                  className="inline-flex items-center rounded-[9px] border border-[#d7dde2] bg-white px-[18px] py-[9px] text-[14px] font-semibold leading-[normal] text-body hover:border-primary hover:text-primary to-480:text-[13px]"
                >
                  <ThumbsUpIcon className="mr-[0.5em] h-[1.14em] w-[1.14em] shrink-0" />
                  {vote.yes}
                </a>
                <a
                  href="#"
                  className="ml-[10px] inline-flex items-center rounded-[9px] border border-[#d7dde2] bg-white px-[18px] py-[9px] text-[14px] font-semibold leading-[normal] text-body hover:border-primary hover:text-primary to-480:text-[13px]"
                >
                  <ThumbsDownIcon className="mr-[0.5em] h-[1.14em] w-[1.14em] shrink-0" />
                  {vote.no}
                </a>
              </div>
            </div>
          </article>

          {/* The article sidebar swaps "Other categories" for a contents list
              and the popular-articles roll. */}
          <HelpSidebar currentSlug={a.category}>
            <div className="mt-[2em] box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
              <h5 className="text-[1.6em] font-bold leading-[normal] text-ink">
                {articleSidebar.tocHeading}
              </h5>
              {/*
                Only the procedural steps go in the numbered list. Sections the
                designer treats as asides — an FAQ, a "need help?" — follow the
                separator as plain links, beside Best practices and Related
                articles.
              */}
              <ol className="mt-[1em] pl-[2em]">
                {a.sections
                  .filter((s) => !s.aside)
                  .map((s) => (
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
              {a.sections
                .filter((s) => s.aside)
                .map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="mt-[0.6em] block text-[1.4em] text-prose hover:text-primary"
                  >
                    {s.toc}
                  </a>
                ))}
              {a.best && (
                <a
                  href={`#${a.best.id}`}
                  className="mt-[0.6em] block text-[1.4em] text-prose hover:text-primary"
                >
                  {a.best.heading}
                </a>
              )}
              <a
                href={`#${a.relId}`}
                className="mt-[0.6em] block text-[1.4em] text-prose hover:text-primary"
              >
                {articleSidebar.relatedHeading}
              </a>
            </div>

            <div className="mt-[2em] box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
              <h5 className="text-[1.6em] font-bold leading-[normal] text-ink">
                {articleSidebar.popularHeading}
              </h5>
              <div className="mt-[0.4em]">
                {a.popular.map((p) => (
                  <LinkRow
                    key={p.title}
                    link={p}
                    className="mt-[0.75em] flex items-start text-[1.35em] leading-[1.45em] text-body hover:text-primary [&>svg]:text-muted"
                  />
                ))}
              </div>
              <Link
                href="/help"
                className="mt-[1em] inline-flex items-center text-[1.4em] font-semibold leading-[normal] text-primary hover:text-primary-press"
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
