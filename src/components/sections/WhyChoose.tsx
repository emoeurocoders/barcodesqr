/**
 * "Why choose BarcodesQR".
 *
 * Desktop is mainB.html's `#mainReasons`; mobile is main_mobile.html's
 * `#mainChoose`. Both now carry the same four reasons, but they are drawn
 * differently — desktop uses the designer's multi-colour image icons on tinted
 * discs, mobile single-stroke `currentColor` glyphs that take the disc's tint —
 * so each is written out on its own.
 *
 * Not to be confused with `WhyBarcodesQR`, the dashboard section just above.
 */

const heading = "Why choose BarcodesQR";
const intro = "Everything you need in one professional QR platform.";

const reasons = [
  {
    icon: "/reasons/easy.svg",
    tile: "bg-why-tile-purple",
    alt: "Easy to Use",
    title: "Easy to Use",
    desc: "Create, customize and download your QR code in minutes.",
  },
  {
    icon: "/reasons/quality.svg",
    tile: "bg-why-tile-green",
    alt: "Professional Quality",
    title: "Professional Quality",
    desc: "High-resolution QR codes for digital use, sharing and print.",
  },
  {
    icon: "/reasons/business.svg",
    tile: "bg-why-tile-cyan",
    alt: "Built for Business",
    title: "Built for Business",
    desc: "Manage QR codes, campaigns and scans from one dashboard.",
  },
  {
    icon: "/reasons/secure.svg",
    tile: "bg-why-tile-pink",
    alt: "Reliable and Secure",
    title: "Reliable & Secure",
    desc: "Dependable hosting and controls to keep your QR codes protected.",
  },
];

function ChooseGlyph({ children }: { children: React.ReactNode }) {
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
      className="h-[3.57em] w-[3.57em]"
    >
      {children}
    </svg>
  );
}

/**
 * The mobile file binds each sentence's last two words with &nbsp; (` `
 * here) so the final word never sits alone; mainB.html does not.
 *
 * The fourth glyph is the palette from the old "Custom Branding" card, kept by
 * the designer when they renamed the card "Reliable & Secure". Reproduced as
 * shipped and raised in the handover.
 */
const mobileReasons = [
  {
    title: reasons[0].title,
    desc: "Create, customize and download your QR code in minutes.",
    fg: "#782be4",
    bg: "#f1e9ff",
    glyph: (
      <ChooseGlyph>
        <rect width="5" height="5" x="3" y="3" rx="1"></rect>
        <rect width="5" height="5" x="16" y="3" rx="1"></rect>
        <rect width="5" height="5" x="3" y="16" rx="1"></rect>
        <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
        <path d="M21 21v.01"></path>
        <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
        <path d="M3 12h.01"></path>
        <path d="M12 3h.01"></path>
        <path d="M12 16v.01"></path>
        <path d="M16 12h1"></path>
        <path d="M21 12v.01"></path>
        <path d="M12 21v-1"></path>
      </ChooseGlyph>
    ),
  },
  {
    title: reasons[1].title,
    desc: "High-resolution QR codes for digital use, sharing and print.",
    fg: "#079b63",
    bg: "#e4f8ef",
    glyph: (
      <ChooseGlyph>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
        <path d="M21 3v5h-5"></path>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
        <path d="M8 16H3v5"></path>
      </ChooseGlyph>
    ),
  },
  {
    title: reasons[2].title,
    desc: "Manage QR codes, campaigns and scans from one dashboard.",
    fg: "#078fa9",
    bg: "#e5f8fb",
    glyph: (
      <ChooseGlyph>
        <path d="M4 20V10"></path>
        <path d="M10 20V4"></path>
        <path d="M16 20v-7"></path>
        <path d="M20 20H2"></path>
      </ChooseGlyph>
    ),
  },
  {
    title: reasons[3].title,
    desc: "Dependable hosting and controls to keep your QR codes protected.",
    fg: "#c51d9e",
    bg: "#fbe8f7",
    glyph: (
      <ChooseGlyph>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
      </ChooseGlyph>
    ),
  },
];

export function WhyChoose() {
  return (
    /*
      Mobile takes a 1px rule along its top (main_mobile.html's #mainChoose);
      mainB.html's #mainReasons has none.
    */
    <section
      id="choose"
      className="scroll-mt-[84px] border-t border-hero-line bg-white md:scroll-mt-20 md:border-t-0"
    >
      <div className="container-wide-home py-[48px] to-480:py-[10vw] md:py-[76px]">
        {/* ---------- Mobile: main_mobile.html #mainChoose ---------- */}
        <div className="md:hidden">
          <div className="text-center">
            <h4 className="mx-auto text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] text-black to-480:text-[7.1vw]">
              {heading}
            </h4>
            <p className="mx-auto mt-[0.85em] max-w-[17em] p-0 text-[20px] leading-[1.55] text-muted to-480:text-[4.1vw]">
              {intro}
            </p>
          </div>

          <div>
            <div className="mt-[4.6875vw] grid grid-cols-2 gap-[3.1vw]">
              {mobileReasons.map(({ title, desc, fg, bg, glyph }) => (
                <div
                  key={title}
                  className="flex flex-col items-center rounded-[2em] border border-hero-card-line bg-white px-[1.85em] py-[2.46em] text-center text-[2.1vw] leading-[normal] shadow-[0_1px_2px_rgba(14,19,17,0.04)]"
                >
                  <span
                    className="flex h-[6.9em] w-[6.9em] shrink-0 items-center justify-center rounded-full"
                    style={{ color: fg, background: bg }}
                  >
                    {glyph}
                  </span>
                  <div className="mt-[1.5em]">
                    <h5 className="text-[1.72em] font-bold leading-[normal] text-black">
                      {title}
                    </h5>
                    <p className="mt-[0.5em] p-0 text-[1.48em] leading-[1.45em] text-muted to-576:font-medium">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Desktop: mainB.html #mainReasons ---------- */}
        <div className="hidden text-[10px] leading-[normal] md:block">
          <div className="text-center">
            <p className="p-0 text-[12px] font-extrabold tracking-[0.18em] text-muted">
              WHY CHOOSE US
            </p>
            <h4 className="mt-[0.55em] text-[43px] font-extrabold tracking-[-0.045em] text-why-ink to-768:text-[38px]">
              {heading}
            </h4>
            <p className="mt-[0.8em] p-0 text-[17px] text-why-sub">{intro}</p>
          </div>

          <div>
            <ul className="mt-[3.1em] grid grid-cols-[repeat(4,1fr)] gap-[1.8em] to-992:grid-cols-[repeat(2,1fr)] to-768:grid-cols-[1fr] to-768:gap-[2em]">
              {reasons.map(({ icon, tile, alt, title, desc }) => (
                <li
                  key={title}
                  className="flex flex-col items-center rounded-[14px] border border-why-card-line bg-white px-[1.8em] py-[2.9em] text-center shadow-why-card"
                >
                  <span
                    className={`flex h-[5.2em] w-[5.2em] items-center justify-center rounded-full ${tile}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon} alt={alt} className="block w-[2.3em]" />
                  </span>
                  <h5 className="mt-[1.05em] text-[17px] font-bold tracking-[-0.02em] text-why-ink">
                    {title}
                  </h5>
                  <p className="mt-[0.55em] p-0 text-[15px] leading-[1.55em] text-prose to-992:max-w-[17em]">
                    {desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
