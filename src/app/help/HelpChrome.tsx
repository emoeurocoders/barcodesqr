import Link from "next/link";
import {
  ArrowRight,
  ChartColumn,
  ChevronRight,
  CircleQuestionMark,
  CircleUser,
  CreditCard,
  QrCode,
  User,
  UserRound,
} from "lucide-react";

import {
  helpCta,
  otherCategories,
  sidebar,
  supportPoints,
  type IconKey,
} from "./content";
import {
  CopyIcon,
  DownloadIcon,
  HeartHandshakeIcon,
  HomeIcon,
  MailIcon,
  MessageIcon,
  PencilIcon,
  RocketIcon,
  SearchIcon,
  SparklesIcon,
  SupportArtSmall,
  WalletIcon,
  WrenchIcon,
} from "./icons";

/**
 * The furniture shared by the category and article pages: breadcrumbs, the
 * right-hand sidebar cards, and the CTA band above the footer. Their CSS is
 * written as `#mainHelpArticle .sideCol, #mainHelpCat .sideCol { … }`, i.e.
 * one component in their file too.
 */

/**
 * Every glyph, matched shape-by-shape against lucide-react's own definitions.
 * The ones that came back identical are the package's; the rest are the
 * designer's own path data in ./icons.tsx.
 */
export const icons: Record<
  IconKey,
  React.ComponentType<{ className?: string }>
> = {
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
  "copy-minus": CopyIcon,
};

/**
 * A link whose destination does not exist yet.
 *
 * The mockup writes these as `href="#"`. The anchor is kept exactly where the
 * designer put it rather than dropped or pointed at an invented route — the
 * handover lists which ones they are.
 */
export function MaybeLink({
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

/** Home / Help Center / <current>. */
export function HelpCrumbs({ current }: { current: string }) {
  return (
    <section className="border-b border-help-crumbs-line bg-help-crumbs text-[10px] to-480:text-[2.1vw]">
      <div className="container-frm flex items-center py-[1.4em] text-[1.35em]">
        <Link href="/" className="flex shrink-0 text-muted hover:text-primary">
          <HomeIcon className="h-[1.6em] w-[1.6em]" />
        </Link>
        <span className="shrink-0 px-[10px] text-faint">/</span>
        <Link href="/help" className="shrink-0 text-muted hover:text-primary">
          Help Center
        </Link>
        <span className="shrink-0 px-[10px] text-faint">/</span>
        {/*
          The current crumb is an <a href="#"> in their markup, not a span —
          kept as an anchor so the structure matches.
        */}
        <a href="#" className="shrink-0 font-semibold text-primary">
          {current}
        </a>
      </div>
    </section>
  );
}

/** Search, other categories, and the support card. */
export function HelpSidebar({ children }: { children?: React.ReactNode }) {
  const points = [MailIcon, UserRound, HeartHandshakeIcon];

  return (
    <aside className="ml-[60px] flex-[0_0_300px] to-992:ml-0 to-992:mt-[30px] to-992:w-full to-992:flex-[0_0_auto]">
      <div className="box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
        <form className="relative">
          <span className="pointer-events-none absolute left-[12px] top-1/2 z-10 block h-[16px] w-[16px] -translate-y-1/2 text-faint">
            <SearchIcon className="block h-full w-full" />
          </span>
          <input
            className="block h-[3em] w-full rounded-[5px] border border-help-input-line bg-white pl-[2.6em] pr-[1em] text-[14px] text-ink placeholder:text-faint focus:outline-none"
            placeholder={sidebar.searchPlaceholder}
          />
        </form>
      </div>

      {children ?? (
      <div className="mt-[2em] box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
        <h5 className="text-[1.6em] font-bold leading-[normal] text-ink">
          {sidebar.categoriesHeading}
        </h5>
        <div className="mt-[0.4em]">
          {otherCategories.map((c) => {
            const Icon = icons[c.icon];
            return (
              <a
                key={c.title}
                href="#"
                className="mt-[1em] flex items-center text-[1.4em] font-medium leading-[normal] text-body hover:text-primary to-576:font-medium"
              >
                <span className="mr-[0.7em] block h-[1.29em] w-[1.29em] shrink-0 text-primary">
                  <Icon className="block h-full w-full" />
                </span>
                {c.title}
                <span className="ml-auto block h-[1.15em] w-[1.15em] shrink-0 text-faint">
                  <ChevronRight className="block h-full w-full" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
      )}

      <div className="mt-[2em] box-border rounded-[14px] border border-help-card-line bg-white px-[2em] py-[1.8em] text-left shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
        <span className="flex justify-start pt-[0.6em]">
          <SupportArtSmall className="h-auto w-[66px]" />
        </span>
        <h5 className="mt-[0.6em] text-[1.6em] font-bold leading-[normal] text-ink">
          {sidebar.helpHeading}
        </h5>
        <p className="mt-[0.5em] max-w-[18em] p-0 text-[1.35em] leading-[1.6em] text-muted to-576:font-medium">
          {sidebar.helpBody}
        </p>
        <a
          href="#"
          className="mt-0 block w-full rounded-[0.7em] bg-primary px-[2.2em] py-[1em] text-center text-[16px] font-medium capitalize leading-[1em] text-white transition-colors hover:bg-primary-press"
        >
          {sidebar.helpCta}
        </a>
        <div className="mt-[2em] text-left">
          {supportPoints.map((p, i) => {
            const Icon = points[i];
            return (
              <div
                key={p}
                className="mt-[0.75em] flex items-center text-[1.35em] leading-[normal] text-body"
              >
                <Icon className="mr-[0.65em] h-[1.19em] w-[1.19em] shrink-0 text-primary" />
                {p}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/** The "Still need help?" band that sits above the footer on both pages. */
export function HelpCtaBand() {
  return (
    <section className="bg-white pb-[46px] text-[10px] to-480:text-[2.1vw]">
      <div className="container-frm">
        <div className="flex items-center rounded-[1.4em] border border-help-cta-line bg-help-crumbs px-[24px] py-[20px] to-992:flex-col to-992:px-[20px] to-992:py-[24px] to-992:text-center">
          <span className="shrink-0 text-primary">
            <MessageIcon className="block h-[3.6em] w-[3.6em]" />
          </span>
          <div className="min-w-0 px-[20px] to-992:px-0 to-992:pt-[1.2em]">
            <span className="block text-[1.7em] font-extrabold leading-[normal] text-ink">
              {helpCta.title}
            </span>
            <p className="mt-[0.35em] p-0 text-[1.4em] leading-[normal] text-prose to-576:max-w-[21em] to-576:font-medium">
              {helpCta.body}
            </p>
          </div>
          <a
            href="#"
            className="ml-auto shrink-0 rounded-[0.7em] bg-primary px-[2.2em] py-[1em] text-center text-[16px] font-medium capitalize leading-[1em] text-white transition-colors hover:bg-primary-press to-992:ml-0 to-992:mt-[1.6em]"
          >
            {helpCta.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

export { ArrowRight, ChevronRight };
