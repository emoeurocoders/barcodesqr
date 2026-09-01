import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CircleQuestionMark, CircleUser, CreditCard, QrCode, ChartColumn, User } from "lucide-react";

import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  hero,
  popular,
  popularHeading,
  stillNeedHelp,
  topics,
  topicsHeading,
  type IconKey,
} from "./content";
import {
  BookOpenIcon,
  DownloadIcon,
  HeroArtLeft,
  HeroArtRight,
  LightbulbIcon,
  MessageIcon,
  PencilIcon,
  RocketIcon,
  SearchIcon,
  SparklesIcon,
  SupportArt,
  WalletIcon,
  WrenchIcon,
} from "./icons";

export const metadata: Metadata = {
  title: "Help Center — BarcodesQR",
  description:
    "Find answers about creating QR codes, managing your account, scan analytics, subscriptions, and more.",
};

/**
 * Their icons, half of them ours.
 *
 * Every glyph here was matched against lucide-react's own definitions shape by
 * shape: the ones that came back identical are imported from the package, the
 * ones the designer draws from an older Lucide release live in ./icons.tsx as
 * verbatim copies. Neither set was chosen by eye.
 */
const icons: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  sparkles: SparklesIcon,
  download: DownloadIcon,
  pencil: PencilIcon,
  "circle-question": CircleQuestionMark,
  "circle-user": CircleUser,
  "credit-card": CreditCard,
  rocket: RocketIcon,
  "qr-code": QrCode,
  chart: ChartColumn,
  user: User,
  wallet: WalletIcon,
  wrench: WrenchIcon,
};

/**
 * A row/card whose destination does not exist yet.
 *
 * The mockup writes every one of these as `href="#"`. Rather than invent
 * routes or silently drop the markup, the anchor is kept exactly where the
 * designer put it and left inert — the handover lists which ones they are.
 */
function MaybeLink({
  href,
  className,
  children,
}: {
  href: string | null;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <a href="#" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function HelpPage() {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />

      {/*
        Hero. `.ln1` sets no colour in their CSS, so the title computes to pure
        black while the section headings below are --color-ink; both are
        reproduced, as on the terms page.

        Every `rem` in this page's CSS resolves against a 10px root — the
        mockup's scaler.css forces `html { font-size: 10px !important }` — so
        their `padding-top: 5.4rem` is 54px, not 86px.
      */}
      <section className="relative overflow-hidden border-b border-hero-line bg-hero-tint">
        {/* Their <span class="art"> wrapper carries the positioning; the svg
            inside is a plain block. Keeping the wrapper keeps the structure. */}
        <span className="pointer-events-none absolute left-[44px] top-1/2 block w-[130px] -translate-y-1/2 text-help-art to-1080:left-[20px] to-1080:w-[100px] to-768:hidden">
          <HeroArtLeft className="block h-auto w-full" />
        </span>
        <span className="pointer-events-none absolute right-[26px] top-1/2 block w-[230px] -translate-y-1/2 text-help-art to-1080:right-0 to-1080:w-[180px] to-768:hidden">
          <HeroArtRight className="block h-auto w-full" />
        </span>

        <div className="container-frm relative z-[2] pb-[60px] pt-[54px] text-center to-768:pb-[46px] to-768:pt-[42px]">
          <h2 className="text-[46px] font-extrabold leading-[normal] tracking-heading text-black to-480:text-[9.2vw]">
            {hero.title}
          </h2>
          <p className="mx-auto mt-[1em] max-w-[33em] text-[17px] leading-[1.6em] text-prose to-1080:max-w-[30em] to-1080:text-[16px] to-480:text-[3.5vw]">
            {hero.intro}
          </p>

          {/*
            A form, as theirs is — search has no backend yet, so it does not
            navigate. Flagged in the handover rather than wired to a route that
            does not exist.
          */}
          <form className="relative mx-auto mt-[28px] max-w-[520px]">
            <span className="pointer-events-none absolute left-[17px] top-1/2 z-10 block h-[19px] w-[19px] -translate-y-1/2 text-faint">
              <SearchIcon className="block h-full w-full" />
            </span>
            <input
              className="block h-[3.1em] w-full rounded-[5px] border border-help-input-line bg-white pl-[46.4px] pr-[19.2px] text-[16px] text-ink shadow-[0_1px_2px_rgba(14,19,17,0.05)] placeholder:text-faint focus:outline-none"
              placeholder={hero.searchPlaceholder}
            />
          </form>
        </div>
      </section>

      {/* Popular Articles. 10px base, `em` throughout, as the designer wrote it. */}
      <section className="bg-white pt-[46px] text-[10px] to-480:text-[2.1vw]">
        <div className="container-frm">
          <div className="flex items-center">
            <span className="mr-[1em] block h-[2.2em] w-[2.2em] shrink-0 text-primary">
              <LightbulbIcon className="block h-full w-full" />
            </span>
            <h3 className="text-[2em] font-extrabold leading-[normal] tracking-[-0.01em] text-black">
              {popularHeading}
            </h3>
          </div>

          <div className="mt-[2em] grid grid-cols-2 gap-x-[2.4em] gap-y-[1.6em] to-992:grid-cols-1 to-992:gap-[1.2em]">
            {popular.map((a) => {
              const Icon = icons[a.icon];
              return (
                <MaybeLink
                  key={a.label}
                  href={a.href}
                  className="flex items-center rounded-[12px] border border-help-card-line bg-white py-[0.8em] pl-[1em] pr-[1.6em] shadow-[0_1px_2px_rgba(14,19,17,0.04)] transition-colors hover:border-primary"
                >
                  <span className="flex h-[3.8em] w-[3.8em] shrink-0 items-center justify-center rounded-[10px] bg-help-tile text-primary">
                    <Icon className="h-[1.8em] w-[1.8em]" />
                  </span>
                  <span className="min-w-0 flex-1 px-[1em] text-[1.5em] font-semibold text-ink">
                    {a.label}
                  </span>
                  <span className="block h-[1.8em] w-[1.8em] shrink-0 text-primary">
                    <ChevronRight className="block h-full w-full" />
                  </span>
                </MaybeLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse Help Topics */}
      <section className="bg-white pt-[44px] text-[10px] to-480:text-[2.1vw]">
        <div className="container-frm">
          <div className="flex items-center">
            <span className="mr-[10px] block h-[2.2em] w-[2.2em] shrink-0 text-primary">
              <BookOpenIcon className="block h-full w-full" />
            </span>
            <h3 className="text-[2em] font-extrabold leading-[normal] tracking-[-0.01em] text-black">
              {topicsHeading}
            </h3>
          </div>

          <div className="mt-[2em] grid grid-cols-3 gap-[2em] to-1123:grid-cols-2 to-768:grid-cols-1 to-768:gap-[14px]">
            {topics.map((t) => {
              const Icon = icons[t.icon];
              return (
                <MaybeLink
                  key={t.title}
                  href={t.href}
                  className="flex items-start rounded-[1.4em] border border-help-card-line bg-white p-[2em] shadow-[0_1px_2px_rgba(14,19,17,0.04)] transition-colors hover:border-primary"
                >
                  <span className="flex h-[4.6em] w-[4.6em] shrink-0 items-center justify-center rounded-[1.2em] bg-help-tile text-primary">
                    <Icon className="h-[2.2em] w-[2.2em]" />
                  </span>
                  <span className="min-w-0 pl-[1.4em]">
                    <span className="block text-[1.65em] font-bold leading-[normal] text-ink">
                      {t.title}
                    </span>
                    <p className="mt-[0.4em] p-0 text-[1.35em] leading-[1.55em] text-muted to-576:font-medium">
                      {t.desc}
                    </p>
                    <span className="mt-[1em] inline-block rounded-full border border-help-tag-line bg-help-tag px-[0.95em] py-[0.33em] text-[1.2em] font-semibold leading-[normal] text-brand-dark">
                      {t.count}
                    </span>
                  </span>
                </MaybeLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still Need Help? */}
      <section className="bg-white pb-[50px] pt-[48px]">
        <div className="container-frm">
          <div className="flex items-center rounded-[16px] border border-help-panel-line bg-help-panel px-[36px] py-[10px] to-1240:py-[30px] to-992:flex-col to-992:px-[24px] to-992:text-center">
            <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <MessageIcon className="h-[26px] w-[26px]" />
            </span>

            <div className="min-w-0 pl-[20px] pr-[34px] to-992:px-0 to-992:pt-[16px]">
              <h3 className="text-[24px] font-extrabold leading-[normal] tracking-heading text-black to-480:text-[5.8vw]">
                {stillNeedHelp.title}
              </h3>
              <p className="mt-[0.55em] max-w-[34em] p-0 text-[14.5px] leading-[1.6em] text-prose to-992:mx-auto to-576:max-w-[25em] to-480:text-[3.5vw] to-480:font-medium">
                {stillNeedHelp.body}
              </p>
            </div>

            {/*
              Anchors, not <Button>: they are <a> in the mockup and the contract
              keeps the element. Neither has a destination yet.
            */}
            <div className="ml-auto flex shrink-0 items-center to-992:ml-0 to-992:mt-[20px] to-480:w-full to-480:flex-col">
              <a
                href="#"
                className="inline-block rounded-[0.7em] bg-primary px-[2.2em] py-[1em] text-center text-[16px] font-medium capitalize leading-[1em] text-white transition-colors hover:bg-primary-press to-480:w-full"
              >
                {stillNeedHelp.primary}
              </a>
              <a
                href="#"
                className="ml-[12px] inline-block rounded-[0.7em] border border-primary bg-white px-[2.2em] py-[1em] text-center text-[16px] font-medium capitalize leading-[1em] text-primary transition-colors hover:bg-primary hover:text-white to-480:ml-0 to-480:mt-[10px] to-480:w-full"
              >
                {stillNeedHelp.secondary}
              </a>
            </div>

            <span className="ml-[32px] block w-[200px] shrink-0 to-1240:hidden">
              <SupportArt className="block h-auto w-full" />
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
