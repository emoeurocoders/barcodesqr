import Link from "next/link";

/**
 * The mobile hero's glyphs, traced from main_mobile.html rather than matched to
 * `lucide-react`. Several of them (the PDF page, the vCard) are drawn from a
 * newer lucide than this project carries, so the installed component renders a
 * visibly different glyph at the same size — the icon rule says copy theirs
 * when that is true. Attributes are camelCased for React; lowercase
 * `strokeWidth` renders nothing and does it silently.
 */
function Glyph({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowRightGlyph({ className }: { className?: string }) {
  return (
    <Glyph className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Glyph>
  );
}

/** Their `.ben` strip, under the mobile CTA. */
const benefits = [
  {
    label: "Edit anytime",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </Glyph>
    ),
  },
  {
    label: "Track scans",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M20 20H2" />
      </Glyph>
    ),
  },
  {
    label: "Print with confidence",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </Glyph>
    ),
  },
];

/**
 * Their `.crd` tiles. The two colours per tile are inline styles in the mockup,
 * so they stay per-item data here rather than becoming `@theme` tokens — the
 * same call Showcase already makes for its `accent`.
 *
 * Every tile is `href="#"` in the mockup. This port has no per-type route — the
 * showcase's own CTA goes to a bare /create — so all four do the same.
 */
const heroTypes = [
  {
    label: "Website",
    blurb: "Link to any URL",
    href: "/create",
    fg: "#4F46E5",
    bg: "#4F46E522",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </Glyph>
    ),
  },
  {
    label: "PDF",
    blurb: "Share a PDF file",
    href: "/create",
    fg: "#F43F5E",
    bg: "#F43F5E22",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </Glyph>
    ),
  },
  {
    label: "vCard",
    blurb: "Share contact details",
    href: "/create",
    fg: "#14B8A6",
    bg: "#14B8A622",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6 16c.6-1.7 1.6-2.5 3-2.5s2.4.8 3 2.5" />
        <path d="M15 11h3" />
        <path d="M15 15h3" />
      </Glyph>
    ),
  },
  {
    label: "Video",
    blurb: "Link to a video",
    href: "/create",
    fg: "#FB7185",
    bg: "#FB718522",
    Icon: ({ className }: { className?: string }) => (
      <Glyph className={className}>
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </Glyph>
    ),
  },
];

/**
 * mainB.html's `.lft .lst` under the desktop CTA — a different set of glyphs
 * from the mobile `.ben` strip above (13px viewBox, thinner stroke, colour
 * baked into the paths), so neither is reused for the other. Copied verbatim.
 */
const T = "#0DAEA3";
const perks = [
  {
    label: "Edit anytime",
    paths: [
      "M6.5 10.2917H11.375",
      "M8.9375 1.89583C9.15299 1.68034 9.44525 1.55928 9.75 1.55928C10.0547 1.55928 10.347 1.68034 10.5625 1.89583C10.778 2.11132 10.899 2.40359 10.899 2.70833C10.899 3.01308 10.778 3.30534 10.5625 3.52083L4.875 9.20833L2.70833 9.75L3.25 7.58333L8.9375 1.89583Z",
      "M7.58333 3.25L9.75 5.41667",
    ],
  },
  {
    label: "Track scans",
    paths: [
      "M1.625 10.8333H11.375",
      "M3.25 9.20833V4.875",
      "M6.5 9.20833V2.16667",
      "M9.75 9.20833V5.95833",
      "M3.25 4.33333C3.54915 4.33333 3.79167 4.09082 3.79167 3.79167C3.79167 3.49251 3.54915 3.25 3.25 3.25C2.95085 3.25 2.70833 3.49251 2.70833 3.79167C2.70833 4.09082 2.95085 4.33333 3.25 4.33333Z",
      "M9.75 5.41667C10.0492 5.41667 10.2917 5.17415 10.2917 4.875C10.2917 4.57585 10.0492 4.33333 9.75 4.33333C9.45085 4.33333 9.20833 4.57585 9.20833 4.875C9.20833 5.17415 9.45085 5.41667 9.75 5.41667Z",
    ],
  },
  {
    label: "Print with confidence",
    paths: [
      "M3.25 4.875V1.625H9.75V4.875",
      "M10.2917 4.875H2.70833C2.11002 4.875 1.625 5.36002 1.625 5.95833V8.66667C1.625 9.26498 2.11002 9.75 2.70833 9.75H10.2917C10.89 9.75 11.375 9.26498 11.375 8.66667V5.95833C11.375 5.36002 10.89 4.875 10.2917 4.875Z",
      "M3.25 8.66667H9.75V11.375H3.25V8.66667Z",
      "M9.20833 6.5H9.75",
    ],
  },
];

/**
 * Their genBtn9 + btnC3: the mobile file's full-width CTA. Shared with the
 * closing panel and the sticky bar, which use the same class pair. At 390px
 * and below their label scales with the viewport (`4.1vw`); the media query is
 * written inclusively because theirs is `max-width: 390px`.
 *
 * Vertical padding is left to the caller: genBtn9's own is 1.15em, but the
 * closing panel overrides it to 1.05em, and two `py-*` on one element would
 * be settled by stylesheet order rather than by intent.
 */
export const mobileCtaClass =
  "flex w-full items-center justify-center gap-[0.7em] rounded-[0.7em] bg-primary px-[1.1em] text-[16px] font-semibold leading-[1.3em] text-on-accent transition-colors hover:bg-primary-press [@media(max-width:390px)]:text-[4.1vw]";

export function Hero() {
  return (
    <section
      id="hero"
      className="scroll-mt-[84px] border-b border-hero-line bg-gradient-to-b from-white to-hero-fade pt-[10vw] md:scroll-mt-20 md:border-b-0 md:pt-0"
    >
      {/*
        Two compositions under one container, because main_mobile.html and
        mainB.html are not a reflow of each other: mobile is a centred column
        with a benefits strip and a "Choose your QR code type" card, desktop a
        two-column row with the dashboard render on the right. Only one is ever
        displayed, so neither heading is announced twice.

        Their heading is an <h4> in both files — the page's <h1> is the logo in
        the header — and the levels are kept.
      */}
      <div className="container-wide-home">
        <div className="pb-[10vw] md:hidden">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center rounded-full border border-hero-badge-line bg-white px-[1.2em] py-[0.5em] text-[3.6vw] font-bold leading-[normal] text-hero-badge-ink shadow-[0_2px_4px_rgba(37,99,235,0.06)]">
              🏆 #1 QR Code Generator
            </span>
            <h4 className="mt-[0.42em] max-w-[9em] text-[10.2vw] font-extrabold leading-[1.06em] tracking-[-0.055em] text-black">
              Generate Branded <span className="text-primary">QR Codes</span>
            </h4>
            {/* "anytime-even" with a hyphen is the mobile file's; the desktop
                one has an em dash. Both reproduced as written. */}
            <p className="mx-auto mb-[1.5em] mt-[1em] max-w-[20.5em] text-[4.6vw] leading-[1.55em] text-prose">
              Dynamic QR codes with analytics you can edit anytime-even after
              printing.
            </p>
            <div className="w-full">
              <Link href="/create" data-mob-cta="hero"
                className={`${mobileCtaClass} py-[1.15em]`}
              >
                Create Your QR Code
                <ArrowRightGlyph className="h-[1.3em] w-[1.3em]" />
              </Link>
            </div>

            <ul className="mt-[28px] flex w-full text-[2.1vw] leading-[normal]">
              {benefits.map(({ label, Icon }, i) => (
                <li
                  key={label}
                  className={`flex min-w-0 flex-1 flex-col items-center px-[0.85em] ${
                    i > 0 ? "border-l border-hero-divider" : ""
                  }`}
                >
                  <span className="flex h-[4.68em] w-[4.68em] shrink-0 items-center justify-center rounded-full bg-hero-tile text-brand-dark">
                    <Icon className="h-[2.34em] w-[2.34em]" />
                  </span>
                  <p className="mt-[0.68em] max-w-[5.6em] text-center text-[1.48em] font-semibold leading-[1.25] text-prose">
                    {label}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-[7.7vw] w-full rounded-[2.2em] border border-hero-divider bg-white p-[2.7em] text-left text-[2.1vw] leading-[normal] shadow-[0_1px_2px_rgba(14,19,17,0.04)]">
            <div className="flex items-start">
              <span className="flex h-[1.92em] w-[1.92em] shrink-0 items-center justify-center rounded-full bg-hero-num-tile text-[2.95em] font-extrabold text-primary">
                1
              </span>
              <div className="min-w-0 pl-[1.7em]">
                <h5 className="max-w-[10em] text-[2.83em] font-extrabold leading-[1.15] tracking-[-0.025em] text-black">
                  Choose your QR&nbsp;code type
                </h5>
                <p className="mt-[0.42em] text-[1.72em] leading-[1.5] text-muted">
                  Choose what you want to share, then create your QR code.
                </p>
              </div>
            </div>

            <div className="mt-[2.46em] grid grid-cols-2 gap-[1.35em]">
              {heroTypes.map(({ label, blurb, href, fg, bg, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center rounded-[1.6em] border border-hero-card-line px-[1.2em] py-[1.48em]"
                >
                  <span
                    className="flex h-[5.17em] w-[5.17em] shrink-0 items-center justify-center rounded-full"
                    style={{ color: fg, background: bg }}
                  >
                    <Icon className="h-[2.7em] w-[2.7em]" />
                  </span>
                  <span className="min-w-0 flex-1 pl-[1.1em] pr-[0.4em]">
                    <b className="block text-[1.72em] font-bold text-ink">
                      {label}
                    </b>
                    <small className="mt-[0.36em] block max-w-[6.8em] text-[1.35em] leading-[1.3] text-muted">
                      {blurb}
                    </small>
                  </span>
                  <span className="w-[1.97em] shrink-0 text-muted">
                    <ArrowRightGlyph className="block h-auto w-full" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/*
          mainB.html. Their 4.5em/5em/2.5em resolve against a 10px body, so the
          row is set to text-[10px] rather than converting every one by hand.
          Below 992px their row stacks and centres. The heading drops to 48px
          at 1120 and STAYS there below 992: their 992 rule asks for 42px, but
          the 1120 one is written `.ln1:has(.ln)`, which outranks it.
        */}
        <div className="hidden items-center pb-[50px] pt-[45px] text-[10px] md:flex to-992:flex-col to-992:pb-[35px] to-992:pt-[30px]">
          <div className="flex-[0_0_44%] to-992:flex to-992:flex-none to-992:flex-col to-992:items-center to-992:text-center">
            <span className="inline-flex items-center rounded-full border border-hero-chip-line bg-white px-[1.1em] py-[0.45em] text-[13.5px] font-medium leading-[normal] text-body">
              🏆 #1 QR Code Generator
            </span>
            <h4 className="mb-[0.35em] mt-[0.38em] text-[56px] font-extrabold leading-[1.1em] tracking-[-0.03em] text-black [@media(max-width:1120px)]:text-[48px] to-992:max-w-[10em]">
              Generate{" "}
              <span className="border-2 border-hero-mark-line bg-hero-mark px-[0.05em]">
                Branded
              </span>{" "}
              <span className="block text-primary">QR Codes</span>
            </h4>
            <p className="max-w-[22em] pb-[1.2em] text-[20px] leading-[1.55em] text-prose to-992:text-[18px]">
              Dynamic QR codes with analytics you can edit anytime—even after
              printing.
            </p>
            <div>
              <Link
                href="/create"
                className="inline-flex items-center gap-[0.8em] rounded-[0.7em] bg-primary px-[2.2em] py-[1em] text-[16px] font-medium leading-[1em] text-on-accent transition-colors hover:bg-primary-press"
              >
                Create Your QR Code
                <ArrowRightGlyph className="h-[1.2em] w-[1.2em] shrink-0" />
              </Link>
            </div>
            <ul className="mt-[22px] flex items-center leading-[normal] to-992:flex-wrap to-992:justify-center">
              {perks.map(({ label, paths }) => (
                <li
                  key={label}
                  className="ml-[20px] flex items-center whitespace-nowrap text-[12px] font-semibold text-hero-perk first:ml-0"
                >
                  <span className="mr-[6px] flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full bg-hero-perk-tile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 13 13"
                      fill="none"
                      aria-hidden="true"
                      className="h-[13px] w-[13px]"
                    >
                      {paths.map((d) => (
                        <path
                          key={d}
                          d={d}
                          stroke={T}
                          strokeWidth="0.975"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                    </svg>
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-[2.5em] max-w-[664.5px] flex-auto to-992:ml-0 to-992:mt-[2.5em]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-dashboard.png"
              alt="BarcodesQR dashboard"
              width={1329}
              height={1096}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
