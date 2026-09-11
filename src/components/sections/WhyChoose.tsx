import {
  AnalyticsIcon,
  BrandingIcon,
  DynamicIcon,
  ManageIcon,
  QualityIcon,
  TypesIcon,
} from "./WhyChooseIcons";

/**
 * "Why choose BarcodesQR" — the six-card grid the designer added after the QR
 * type picker.
 *
 * Not to be confused with `WhyBarcodesQR`, which is their `#mainWhy` further
 * down the page. This is `#mainChoose`.
 */

const heading = "Why choose BarcodesQR";
const intro =
  "Everything you need to create, customize and manage professional QR codes";

const features = [
  {
    Icon: TypesIcon,
    title: "23 QR Code Types",
    // The designer binds the last two words with &nbsp; so "and more" never
    // breaks across lines;   is that same character.
    desc: "Create QR codes for websites, PDFs, WiFi, vCards, Google reviews, menus, social media and more.",
  },
  {
    Icon: DynamicIcon,
    title: "Dynamic QR Codes",
    desc: "Update the destination anytime without reprinting your QR code.",
  },
  {
    Icon: AnalyticsIcon,
    title: "Scan Analytics",
    desc: "Track scans, devices, locations and campaign performance from one dashboard.",
  },
  {
    Icon: BrandingIcon,
    title: "Custom Branding",
    desc: "Add your logo, colors and style to create QR codes that match your brand.",
  },
  {
    Icon: QualityIcon,
    title: "High-Quality Downloads",
    desc: "Download crisp QR codes ready for print, packaging, signage and digital use.",
  },
  {
    Icon: ManageIcon,
    title: "Easy to Manage",
    desc: "Create, organize and update all your QR codes from one simple dashboard.",
  },
];

/**
 * Mobile is a different section, not a reflow of the one above.
 *
 * main_mobile.html cuts this grid from six cards to FOUR — "High-Quality
 * Downloads" and "Easy to Manage" are simply not in the file — and rewrites the
 * sub-line. Both are reproduced as shipped, and both are flagged in the
 * handover: dropping two selling points on phones looks like a decision someone
 * should confirm rather than a styling choice.
 *
 * The glyphs are theirs too, and they are NOT the desktop ones: the six
 * illustrations in WhyChooseIcons are multi-colour with their own fills, while
 * the mobile file draws single-stroke `currentColor` icons so each can take the
 * tint of the disc behind it.
 */
const mobileIntro = "Everything you need in one professional QR platform.";

function ChooseGlyph({
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

const mobileFeatures = [
  {
    title: features[0].title,
    desc: features[0].desc,
    fg: "#782be4",
    bg: "#f1e9ff",
    Icon: ({ className }: { className?: string }) => (
      <ChooseGlyph className={className}>
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M21 21v.01" />
        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
        <path d="M3 12h.01" />
        <path d="M12 3h.01" />
        <path d="M12 16v.01" />
        <path d="M16 12h1" />
        <path d="M21 12v.01" />
        <path d="M12 21v-1" />
      </ChooseGlyph>
    ),
  },
  {
    title: features[1].title,
    desc: features[1].desc,
    fg: "#079b63",
    bg: "#e4f8ef",
    Icon: ({ className }: { className?: string }) => (
      <ChooseGlyph className={className}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </ChooseGlyph>
    ),
  },
  {
    title: features[2].title,
    desc: features[2].desc,
    fg: "#078fa9",
    bg: "#e5f8fb",
    Icon: ({ className }: { className?: string }) => (
      <ChooseGlyph className={className}>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M20 20H2" />
      </ChooseGlyph>
    ),
  },
  {
    title: features[3].title,
    desc: features[3].desc,
    fg: "#c51d9e",
    bg: "#fbe8f7",
    Icon: ({ className }: { className?: string }) => (
      <ChooseGlyph className={className}>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </ChooseGlyph>
    ),
  },
];

export function WhyChoose() {
  return (
    <section id="choose" className="scroll-mt-[84px] border-b border-hero-line bg-white md:scroll-mt-20">
      {/*
        The designer gives both this section and #mainWhy a full genPad1
        (76px top and bottom), so the two stack into a ~152px trough. The PM
        asked for it tightened, so the bottom half is cut to 40px here and the
        top of WhyBarcodesQR matches. A deliberate divergence from the mockup,
        recorded in LAUNCH.md so the next sync does not read it as drift.
      */}
      <div className="container-wide-home pb-16 pt-[59px] md:pb-[40px] md:pt-[76px]">
        {/*
          Mobile is written out rather than layered onto the desktop markup with
          more `to-*` variants. Those custom variants are registered widest-first
          in globals.css, so `to-480` sorts AFTER anything scoped to `to-767` and
          would silently win back every value below 480 — exactly the widths this
          is for. A separate block has no ordering to get wrong.

          The section's own padding above is the one thing shared, and mobile
          takes the designer's 59/64 rather than the tightened 76/40: that
          tightening exists to close the trough where #mainChoose meets #mainWhy,
          and on mobile the designer has moved #mainWhy up above #mainTypes, so
          the two are no longer adjacent and the trough is not there to close.
        */}
        <div className="md:hidden">
          <div className="text-center">
            <h4 className="mx-auto text-[7.1vw] font-extrabold leading-[1.08] tracking-[-0.035em] text-black">
              {heading}
            </h4>
            <p className="mx-auto mt-[0.85em] max-w-[17em] p-0 text-[4.1vw] leading-[1.55] text-muted">
              {mobileIntro}
            </p>
          </div>

          <div className="mt-[4.6875vw] grid grid-cols-2 gap-[3.1vw]">
            {mobileFeatures.map(({ title, desc, fg, bg, Icon }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-[2em] border border-hero-card-line bg-white px-[1.85em] py-[2.46em] text-center text-[2.1vw] leading-[normal] shadow-[0_1px_2px_rgba(14,19,17,0.04)]"
              >
                <span
                  className="flex h-[6.9em] w-[6.9em] shrink-0 items-center justify-center rounded-full"
                  style={{ color: fg, background: bg }}
                >
                  <Icon className="h-[3.57em] w-[3.57em]" />
                </span>
                <div className="mt-[1.5em]">
                  <h5 className="text-[1.72em] font-bold leading-[normal] text-black">
                    {title}
                  </h5>
                  <p className="mt-[0.5em] p-0 text-[1.48em] leading-[1.45] text-muted">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
        <div className="text-center">
          {/* Their <h4>, kept — the page's heading levels are the designer's. */}
          <h4 className="mx-auto text-[40px] font-extrabold leading-[normal] tracking-heading text-black to-768:text-[36px] to-480:text-[7.5vw]">
            {heading}
          </h4>
          <p className="mx-auto mt-[0.55em] max-w-none p-0 text-[18px] leading-[normal] text-muted to-992:max-w-[22em] to-480:text-[3.7vw]">
            {intro}
          </p>
        </div>

        {/* Their .btm wrapper carries no styles, but it is in the markup. */}
        <div>
          {/*
            text-[10px] because their `gap: 2.4em` resolves against the
            mockup's 10px body, not the 16px ours inherits — without it the
            columns sit 39px apart instead of 24px and every card is 10px
            narrower.
          */}
          <div className="mt-[40px] grid grid-cols-3 gap-[2.4em] text-[10px] to-992:grid-cols-2 to-768:grid-cols-1 to-768:gap-[2em]">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start rounded-[16px] border border-help-card-line bg-white px-[3em] py-[3.4em] text-[10px] shadow-[0_1px_2px_rgba(14,19,17,0.04)] to-480:text-[2.1vw]"
              >
                <span className="w-[5.2em] shrink-0">
                  <Icon className="block w-full" />
                </span>
                <div className="ml-[2em]">
                  <h5 className="text-[1.9em] font-bold leading-[normal] text-black">
                    {title}
                  </h5>
                  <p className="mt-[0.55em] p-0 text-[1.39em] leading-[1.55em] text-muted to-576:font-medium">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
