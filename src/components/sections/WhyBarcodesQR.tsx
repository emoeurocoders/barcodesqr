/**
 * "Everything you need after creating your QR code".
 *
 * Desktop is mainB.html's `#mainBenefits`: four benefit cards over a mock
 * "Analytics Overview" dashboard. Mobile is main_mobile.html's `#mainWhy`: a
 * 2×2 grid of tinted cards over a screenshot. The two are different
 * compositions rather than one reflowed, so each is written out on its own.
 *
 * The dashboard is illustration, not data. Every number, date and QR code name
 * in it is the designer's sample content, reproduced verbatim — it is a picture
 * of the product built in markup so it stays sharp at any zoom.
 */

const heading = "Everything you need after creating your QR code";
const intro = "Edit, track and manage your QR codes from one simple dashboard.";

const benefits = [
  {
    icon: "/benefits/ico_edit.svg",
    tile: "bg-why-tile-blue",
    alt: "Edit anytime",
    title: "Edit anytime",
    body: "Change the destination after printing without replacing the QR code.",
  },
  {
    icon: "/benefits/ico_track.svg",
    tile: "bg-why-tile-green",
    alt: "Track every scan",
    title: "Track every scan",
    body: "See scans, locations, devices and performance over time.",
  },
  {
    icon: "/benefits/ico_organize.svg",
    tile: "bg-why-tile-purple",
    alt: "Organize everything",
    title: "Organize everything",
    body: "Manage QR codes, folders and campaigns from one dashboard.",
  },
  {
    icon: "/benefits/ico_secure.svg",
    tile: "bg-why-tile-cyan",
    alt: "Secure and reliable",
    title: "Secure & reliable",
    body: "Use password protection, permissions and dependable QR hosting.",
  },
];

const kpis = [
  {
    icon: "/benefits/ico_codes.svg",
    tile: "bg-why-tile-blue",
    value: "11",
    label: "Total QR Codes",
    delta: null,
  },
  {
    icon: "/benefits/ico_scans.svg",
    tile: "bg-dash-tile-teal",
    value: "241",
    label: "Total Scans",
    delta: "18.6%",
  },
  {
    icon: "/benefits/ico_unique.svg",
    tile: "bg-dash-tile-purple",
    value: "67",
    label: "Unique Scans",
    delta: "21.4%",
  },
  {
    icon: "/benefits/ico_rate.svg",
    tile: "bg-why-tile-blue",
    value: "62.9%",
    label: "Scan Rate",
    delta: "8.7%",
  },
];

const axis = ["Jul 21", "Jul 30", "Aug 8", "Aug 14", "Aug 20"];

const topCodes = [
  { dot: "bg-dash-dot-blue", name: "My Website QR Code", scans: "108" },
  { dot: "bg-dash-dot-teal", name: "Social Media", scans: "76" },
  { dot: "bg-dash-dot-purple", name: "TPA Location QR", scans: "57" },
  { dot: "bg-dash-dot-amber", name: "Product Catalog", scans: "42" },
  { dot: "bg-dash-dot-teal", name: "Event Registration", scans: "28" },
];

/* Their chart panel draws four 1px gridlines behind the line image. */
const chartGrid = {
  backgroundImage: Array(4)
    .fill("linear-gradient(var(--color-dash-grid), var(--color-dash-grid))")
    .join(", "),
  backgroundPosition: "0 0, 0 33.33%, 0 66.66%, 0 100%",
  backgroundSize: "100% 1px",
  backgroundRepeat: "no-repeat",
};

function UpArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-[3px] h-[1em] w-[1em] shrink-0"
    >
      <path d="M7 7h10v10"></path>
      <path d="M7 17 17 7"></path>
    </svg>
  );
}

function MobileGlyph({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[2.83em] w-[2.83em]"
    >
      {children}
    </svg>
  );
}

/* main_mobile.html tints each card's disc by position (`:nth-child`). */
const mobileBenefits = [
  {
    ...benefits[0],
    fg: "#1f6fe5",
    bg: "#e9f2ff",
    glyph: (
      <MobileGlyph>
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
      </MobileGlyph>
    ),
  },
  {
    ...benefits[1],
    fg: "#079b63",
    bg: "#e4f8ef",
    glyph: (
      <MobileGlyph>
        <path d="M22 7 13.5 15.5 8.5 10.5 2 17"></path>
        <path d="M16 7h6v6"></path>
      </MobileGlyph>
    ),
  },
  {
    ...benefits[2],
    fg: "#782be4",
    bg: "#f1e9ff",
    glyph: (
      <MobileGlyph>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
      </MobileGlyph>
    ),
  },
  {
    ...benefits[3],
    fg: "#078fa9",
    bg: "#e5f8fb",
    glyph: (
      <MobileGlyph>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        <rect x="9" y="10.5" width="6" height="4.5" rx="1"></rect>
        <path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5"></path>
      </MobileGlyph>
    ),
  },
];

function Sparkle({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0Q13.6 10.4 24 12Q13.6 13.6 12 24Q10.4 13.6 0 12Q10.4 10.4 12 0Z"></path>
    </svg>
  );
}

export function WhyBarcodesQR() {
  return (
    <section
      id="features"
      className="scroll-mt-[84px] bg-white md:scroll-mt-20 md:bg-[linear-gradient(180deg,var(--color-why-wash),var(--color-white))]"
    >
      <div className="container-wide-home py-[48px] to-480:py-[10vw] md:py-[76px]">
        {/* ---------- Mobile: main_mobile.html #mainWhy ---------- */}
        <div className="md:hidden">
          <div className="text-center">
            {/* Their `.bdg` is in the mobile markup but `display: none`. */}
            <span className="hidden">
              <Sparkle className="h-[1.1em] w-[1.1em]" />
              Why BarcodesQR
            </span>
            <h4 className="mx-auto max-w-[9.2em] text-[38px] font-extrabold leading-[1.08] tracking-[-0.035em] text-black to-480:text-[7.9vw]">
              {heading}
            </h4>
            <p className="mx-auto mt-[0.85em] max-w-[17em] p-0 text-[20px] leading-[1.55] text-prose to-576:font-medium to-480:text-[4.1vw]">
              {intro}
            </p>
            <ul className="mt-[4.6875vw] grid grid-cols-2 gap-[3.1vw] text-left">
              {mobileBenefits.map(({ title, body, fg, bg, glyph }) => (
                <li
                  key={title}
                  className="flex flex-col items-start rounded-[1.85em] border border-hero-card-line bg-white p-[1.97em] text-[2.1vw] leading-[normal] shadow-[0_2px_4px_rgba(14,19,17,0.04)]"
                >
                  <span
                    className="flex h-[5.4em] w-[5.4em] shrink-0 items-center justify-center rounded-full"
                    style={{ color: fg, background: bg }}
                  >
                    {glyph}
                  </span>
                  <div className="mt-[1.5em]">
                    <h5 className="text-[1.72em] font-bold text-black">
                      {title}
                    </h5>
                    <p className="mt-[0.5em] p-0 text-[1.48em] leading-[1.45em] text-muted to-576:font-medium">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* A separate, taller crop from the designer — not the desktop
              dashboard rescaled. */}
          <div className="mt-[3.4375vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/why-mobile.jpg"
              alt="BarcodesQR dashboard overview"
              className="block w-full rounded-[3.125vw] border border-hero-divider bg-white shadow-[0_2px_6px_rgba(14,19,17,0.08)]"
            />
          </div>
        </div>

        {/* ---------- Desktop: mainB.html #mainBenefits ---------- */}
        <div className="hidden text-[10px] md:block">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-why-badge px-[1.4em] py-[0.6em] text-[12px] font-extrabold leading-[normal] tracking-[0.06em] text-primary">
              <Sparkle className="mr-[0.55em] h-[0.9em] w-[0.9em] shrink-0" />
              WHY BARCODESQR
            </span>
            <h4 className="mx-auto mt-[0.55em] max-w-[13.2em] text-[43px] font-extrabold leading-[1.16em] tracking-[-0.045em] text-why-ink to-768:text-[38px]">
              Everything you need after creating your QR&nbsp;code
            </h4>
            <p className="mt-[0.85em] p-0 text-[17px] leading-[normal] text-why-sub">
              {intro}
            </p>
          </div>

          <div>
            <ul className="mt-[3.1em] grid grid-cols-[repeat(4,1fr)] gap-[1.6em] to-992:grid-cols-[repeat(2,1fr)] to-768:grid-cols-[1fr] to-768:gap-[2em]">
              {benefits.map(({ icon, tile, alt, title, body }) => (
                <li
                  key={title}
                  className="rounded-[14px] border border-why-card-line bg-white p-[2.2em] shadow-why-card"
                >
                  <span
                    className={`flex h-[4.3em] w-[4.3em] items-center justify-center rounded-full ${tile}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon} alt={alt} className="block w-[2.3em]" />
                  </span>
                  <h5 className="mt-[1em] text-[17px] font-bold leading-[normal] tracking-[-0.02em] text-why-ink">
                    {title}
                  </h5>
                  <p className="mt-[0.5em] p-0 text-[15px] leading-[1.5em] text-prose">
                    {body}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-[2.7em] rounded-[18px] border border-dash-line bg-white p-[25px] leading-[normal] shadow-why-dash">
              <div className="flex items-start justify-between to-992:flex-col">
                <div>
                  <h5 className="text-[18px] font-bold text-why-ink">
                    Analytics Overview
                  </h5>
                  <p className="mt-[0.25em] p-0 text-[13px] text-dash-sub">
                    See how your QR codes perform
                  </p>
                </div>
                <div className="flex shrink-0 to-992:mt-[1em]">
                  <span className="inline-flex items-center whitespace-nowrap rounded-[7px] border border-dash-chip-line px-[10px] py-[7px] text-[12px] font-semibold text-dash-chip">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="mr-[8px] h-[14px] w-[14px]"
                    >
                      <path
                        d="M11.0833 2.91667H2.91667C2.27233 2.91667 1.75 3.439 1.75 4.08333V11.0833C1.75 11.7277 2.27233 12.25 2.91667 12.25H11.0833C11.7277 12.25 12.25 11.7277 12.25 11.0833V4.08333C12.25 3.439 11.7277 2.91667 11.0833 2.91667Z"
                        stroke="#5D6879"
                        strokeWidth="1.05"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.08333 1.75V4.08333M9.91667 1.75V4.08333M1.75 5.83333H12.25"
                        stroke="#5D6879"
                        strokeWidth="1.05"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Jul 21 &ndash; Aug 20, 2025
                    <svg
                      className="ml-[6px] h-[12px] w-[12px]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="#5D6879"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {/* The one icon is both :first-child and :last-child in
                      their CSS, so it takes both 8px margins. */}
                  <span className="ml-[10px] inline-flex items-center whitespace-nowrap rounded-[7px] border border-dash-chip-line px-[10px] py-[7px] text-[12px] font-semibold text-dash-chip">
                    Export
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="mx-[8px] h-[14px] w-[14px]"
                    >
                      <path
                        d="M7 1.75V8.75M4.66667 6.41667L7 8.75L9.33333 6.41667M2.33333 9.91667V11.6667H11.6667V9.91667"
                        stroke="#5D6879"
                        strokeWidth="1.05"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <ul className="mt-[18px] grid grid-cols-[repeat(4,1fr)] gap-[12px] to-992:grid-cols-[repeat(2,1fr)]">
                {kpis.map(({ icon, tile, value, label, delta }) => (
                  <li
                    key={label}
                    className="flex min-h-[82px] items-center rounded-[9px] border border-dash-panel-line p-[10px]"
                  >
                    <span
                      className={`flex h-[39px] w-[39px] shrink-0 items-center justify-center rounded-[9px] ${tile}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={icon} alt={label} className="block w-[22px]" />
                    </span>
                    <div className="ml-[9px] min-w-0">
                      <p className="p-0 text-[21px] font-semibold leading-[1.1em] text-why-ink">
                        {value}
                      </p>
                      <p className="mt-[4px] whitespace-nowrap p-0 text-[11px] text-dash-kpi-label">
                        {label}
                      </p>
                    </div>
                    {delta && (
                      <div className="ml-auto shrink-0 pl-[8px]">
                        <p className="flex items-center p-0 text-[12px] font-bold text-dash-up">
                          <UpArrow />
                          {delta}
                        </p>
                        <p className="mt-[2px] whitespace-nowrap p-0 text-[10.5px] text-dash-kpi-note">
                          vs previous 30 days
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-[17px] grid grid-cols-[2.2fr_1fr] gap-[15px] to-992:grid-cols-[1fr]">
                <div className="min-w-0 rounded-[9px] border border-dash-panel-line p-[14px]">
                  <div className="flex items-center justify-between">
                    <p className="p-0 text-[12px] font-semibold text-why-ink">
                      Scans Over Time
                    </p>
                    <p className="p-0 text-[11px] text-dash-tabs">
                      Day Week Month
                    </p>
                  </div>
                  <div className="mt-[8px]" style={chartGrid}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/benefits/chart.svg"
                      alt="Scans over time chart"
                      className="block w-full"
                    />
                  </div>
                  <div className="mt-[2px] flex justify-between text-[11px] text-dash-axis">
                    {axis.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-[9px] border border-dash-panel-line p-[14px]">
                  <div className="flex items-center justify-between">
                    <p className="p-0 text-[12px] font-semibold text-why-ink">
                      Top QR Codes
                    </p>
                    <p className="p-0 text-[11px] font-semibold text-primary">
                      View all
                    </p>
                  </div>
                  <ul className="mt-[8px] block">
                    {topCodes.map(({ dot, name, scans }) => (
                      <li
                        key={name}
                        className="flex items-center whitespace-nowrap border-t border-dash-row-line py-[8px] text-[11px] text-dash-row"
                      >
                        <span
                          className={`mr-[7px] h-[9px] w-[9px] shrink-0 rounded-[3px] ${dot}`}
                        ></span>
                        {name}
                        <b className="ml-auto pl-[8px] font-bold text-body">
                          {scans}
                        </b>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
