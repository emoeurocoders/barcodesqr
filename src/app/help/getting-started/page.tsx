import type { Metadata } from "next";

import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  exploreHeading,
  exploreTopics,
  gettingStarted,
  gettingStartedArticles,
} from "../content";
import { FileTextIcon } from "../icons";
import {
  ArrowRight,
  ChevronRight,
  HelpCrumbs,
  HelpCtaBand,
  HelpSidebar,
  MaybeLink,
  icons,
} from "../HelpChrome";

export const metadata: Metadata = {
  title: "Getting Started — Help Center — BarcodesQR",
  description: gettingStarted.intro,
};

export default async function GettingStartedPage() {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />
      <HelpCrumbs current={gettingStarted.title} />

      {/* 10px base and `em` throughout, as their #mainHelpCat is written. */}
      <section className="bg-white pb-[46px] pt-[40px] text-[10px] to-480:text-[2.1vw]">
        <div className="container-frm flex items-start to-992:flex-col">
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-help-tag-line bg-help-tag px-[1.1em] py-[0.45em] text-[1.15em] font-bold uppercase leading-[normal] tracking-[0.07em] text-brand-dark">
              {gettingStarted.tag}
            </span>

            <h2 className="mt-[0.4em] text-[4.2em] font-extrabold leading-[1.15em] tracking-heading text-black to-992:text-[3.6em]">
              {gettingStarted.title}
            </h2>

            <p className="mt-[0.8em] max-w-[30em] p-0 text-[1.6em] leading-[1.6em] text-prose to-576:font-medium">
              {gettingStarted.intro}
            </p>

            <div className="mt-[1.4em] flex items-center text-[1.35em] text-muted">
              <FileTextIcon className="mr-[0.5em] h-[1.11em] w-[1.11em] shrink-0" />
              {gettingStarted.count}
            </div>

            {/* The five articles in this category. */}
            <div className="mt-[2em]">
              {gettingStartedArticles.map((a, i) => {
                const Icon = icons[a.icon];
                return (
                  <MaybeLink
                    key={a.title}
                    href={a.href}
                    className={`flex items-center rounded-[12px] border border-help-card-line bg-white px-[1.8em] py-[1.6em] shadow-[0_1px_2px_rgba(14,19,17,0.04)] transition-colors hover:border-primary ${
                      i > 0 ? "mt-[1.4em]" : ""
                    }`}
                  >
                    <span className="flex h-[4.2em] w-[4.2em] shrink-0 items-center justify-center rounded-[1em] bg-help-tile text-primary">
                      <Icon className="h-[2em] w-[2em]" />
                    </span>
                    <span className="min-w-0 flex-1 px-[1.4em]">
                      <span className="block text-[1.6em] font-bold leading-[normal] text-ink">
                        {a.title}
                      </span>
                      <p className="mt-[0.3em] p-0 text-[1.35em] leading-[1.5em] text-muted to-576:font-medium">
                        {a.desc}
                      </p>
                    </span>
                    <span className="block h-[1.8em] w-[1.8em] shrink-0 text-primary">
                      <ChevronRight className="block h-full w-full" />
                    </span>
                  </MaybeLink>
                );
              })}
            </div>

            {/* Explore more help topics */}
            <div className="mt-[3em]">
              <h3 className="text-[1.7em] font-bold leading-[normal] text-ink">
                {exploreHeading}
              </h3>
              <div className="mt-[1.4em] grid grid-cols-3 gap-[1.6em] to-768:grid-cols-1 to-768:gap-[1.2em]">
                {exploreTopics.map((t) => {
                  const Icon = icons[t.icon];
                  return (
                    <MaybeLink
                      key={t.title}
                      href={t.href}
                      className="flex items-start rounded-[12px] border border-help-card-line bg-white p-[1.4em] shadow-[0_1px_2px_rgba(14,19,17,0.04)] transition-colors hover:border-primary"
                    >
                      <span className="flex h-[3.4em] w-[3.4em] shrink-0 items-center justify-center rounded-[0.9em] bg-help-tile text-primary">
                        <Icon className="h-[1.7em] w-[1.7em]" />
                      </span>
                      <span className="min-w-0 flex-1 pl-[1em] pr-[0.6em]">
                        <span className="block text-[1.3em] font-bold leading-[normal] text-ink">
                          {t.title}
                        </span>
                        <p className="mt-[0.3em] p-0 text-[1.15em] leading-[1.5em] text-muted to-576:font-medium">
                          {t.desc}
                        </p>
                      </span>
                      <span className="block h-[1.5em] w-[1.5em] shrink-0 self-center text-primary">
                        <ArrowRight className="block h-full w-full" />
                      </span>
                    </MaybeLink>
                  );
                })}
              </div>
            </div>
          </div>

          <HelpSidebar />
        </div>
      </section>

      <HelpCtaBand />
      <Footer />
    </>
  );
}
