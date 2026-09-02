/**
 * The press-logo scroller that replaced the "Trusted by" people strip.
 *
 * The designer animates this with jQuery: it clones the eight logos, measures
 * one set's width, then moves the track by 40px per second on
 * requestAnimationFrame, pausing on hover. Vendor scripts are never ported, so
 * this is the same outcome in CSS — the set is duplicated in the markup, the
 * track translates exactly one set width, and `animation-play-state` handles
 * the hover pause. No JavaScript and nothing to clean up.
 *
 * The duration is the set width divided by their 40px/s, so the speed matches
 * rather than merely looking similar. One set is 87.6em of logos plus eight
 * 3.4em gaps at the section's fixed 10px base = 1148px, hence 28.7s. Below
 * 768px the gap tightens to 2.4em, giving 1068px and 26.7s.
 */

const logos = [
  { src: "/press/newsweek.svg", alt: "Newsweek", w: "13.8em" },
  { src: "/press/usatoday.svg", alt: "USA Today", w: "11.8em" },
  { src: "/press/yahoofinance.svg", alt: "Yahoo Finance", w: "9.4em" },
  { src: "/press/businessinsider.svg", alt: "Business Insider", w: "9.0em" },
  { src: "/press/digitaltrends.svg", alt: "Digital Trends", w: "12.0em" },
  { src: "/press/benzinga.svg", alt: "Benzinga", w: "10.8em" },
  { src: "/press/techradar.svg", alt: "TechRadar", w: "10.8em" },
  { src: "/press/barchart.svg", alt: "Barchart", w: "10.0em" },
];

const disclaimer =
  "Publication logos identify media references to BarcodesQR and do not imply endorsement, sponsorship, or approval.";

export function PressScroll() {
  return (
    <section
      /*
        Their ::before / ::after: a dotted 88x176 panel inset 3vw on each side,
        hidden below 1400px. Kept as pseudo-elements rather than spans so the
        DOM matches the mockup node for node.
      */
      className="relative border-y border-hero-line bg-[#f8f9fb]
        before:absolute before:left-[3vw] before:top-1/2 before:h-[176px] before:w-[88px] before:-translate-y-1/2 before:bg-[radial-gradient(circle,#d2d8e2_2.5px,transparent_2.5px)] before:[background-size:22px_22px] before:content-['']
        after:absolute after:right-[3vw] after:top-1/2 after:h-[176px] after:w-[88px] after:-translate-y-1/2 after:bg-[radial-gradient(circle,#d2d8e2_2.5px,transparent_2.5px)] after:[background-size:22px_22px] after:content-['']
        to-1400:before:hidden to-1400:after:hidden"
    >
      <div className="container-frm py-[76px]">
        <div
          className="group overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <ul className="flex w-max flex-nowrap items-center gap-x-[3.4em] text-[10px] animate-press-scroll group-hover:[animation-play-state:paused] motion-reduce:animate-none to-768:gap-x-[2.4em] to-768:animate-press-scroll-sm">
            {/* The second pass is the designer's clone, and is decorative. */}
            {[0, 1].map((pass) =>
              logos.map((l) => (
                <li
                  key={`${pass}-${l.alt}`}
                  className="shrink-0"
                  style={{ width: l.w }}
                  aria-hidden={pass === 1 ? "true" : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} alt={pass === 1 ? "" : l.alt} className="block w-full" />
                </li>
              )),
            )}
          </ul>
        </div>

        <p className="pt-[2.2em] text-center text-[15px] leading-[1.6em] text-muted to-1180:mx-auto to-1180:max-w-[42em] to-768:max-w-[27em] to-576:font-medium to-440:text-[3.4vw]">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}
