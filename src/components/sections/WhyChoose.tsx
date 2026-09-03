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

export function WhyChoose() {
  return (
    <section className="border-b border-hero-line bg-white">
      {/*
        The designer gives both this section and #mainWhy a full genPad1
        (76px top and bottom), so the two stack into a ~152px trough. The PM
        asked for it tightened, so the bottom half is cut to 40px here and the
        top of WhyBarcodesQR matches. A deliberate divergence from the mockup,
        recorded in LAUNCH.md so the next sync does not read it as drift.
      */}
      <div className="container-frm pb-[40px] pt-[76px]">
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
    </section>
  );
}
