import Link from "next/link";
import {
  FooterColumn,
  FooterHelpButton,
  FooterLiveHelp,
  footerLinkClass,
} from "./FooterColumn";

type FooterLink = { href: string; label: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "QR Code Types",
    links: [
      { href: "/#types", label: "Website QR" },
      { href: "/#types", label: "PDF QR" },
      { href: "/#types", label: "vCard QR" },
      { href: "/#types", label: "WiFi QR" },
      { href: "/#types", label: "Menu QR" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { href: "/#types", label: "Restaurants" },
      { href: "/#types", label: "Business Cards" },
      { href: "/#types", label: "Packaging" },
      { href: "/#types", label: "Events" },
      { href: "/#types", label: "Real Estate" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/dashboard", label: "Cancel Subscription" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#pricing", label: "Pricing" },
      // "Media" in the designer's file since the 2026-09-11 sync, where the
      // port had carried "Reviews". There is no media page yet, so it points
      // at the route one would live on — see LAUNCH.md.
      { href: "/media", label: "Media" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      // Section 9 of the Terms is the refund policy; there is no separate page.
      { href: "/terms#trmSec9", label: "Refund Policy" },
    ],
  },
];

const payments = [
  { src: "/payments/visa.svg", alt: "Visa" },
  { src: "/payments/mastercard.svg", alt: "Mastercard" },
  { src: "/payments/amex.svg", alt: "American Express" },
  { src: "/payments/applepay.svg", alt: "Apple Pay" },
  { src: "/payments/googlepay.svg", alt: "Google Pay" },
];

/**
 * mainB.html's `#mainFooter`, and main_mobile.html's `.mobHome` restyling of
 * the same markup — the two files share it node for node, apart from the
 * mobile-only Live Help button beside the logo.
 *
 * Their element is a <section>, not a <footer>, and that is kept.
 *
 * Desktop reflows at 1180 and 1080 (`[@media(min-width:768px)_and_…]`, bounded
 * below so those rules cannot leak into the mobile composition, which their
 * `.mobHome` selectors outrank in the mockup). Spelled out in every class
 * rather than interpolated: Tailwind finds classes by scanning the source
 * text, and a `${…}:flex-col` never appears in it. Their em values resolve
 * against a 10px body, hence text-[10px] on the container.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <section className="mt-auto border-t border-hero-divider bg-white pb-[5.4vw] pt-[10vw] md:border-t-0 md:py-[25px]">
      <div className="container-wide-home text-[10px] leading-[normal]">
        <div
          className={`pb-[25px] md:flex md:pb-0 [@media(min-width:768px)_and_(max-width:1080px)]:flex-col`}
        >
          <div
            className={`relative pr-[120px] md:flex-[0_0_300px] md:pr-0 [@media(min-width:1081px)_and_(max-width:1180px)]:basis-[250px] [@media(min-width:768px)_and_(max-width:1080px)]:flex-none`}
          >
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark.svg" alt="BarcodesQR" className="w-[30px]" />
              <span className="ml-[0.45em] text-[21px] font-extrabold text-black">
                Barcodes<b className="font-extrabold text-primary">QR</b>
              </span>
            </div>
            <p
              className={`mb-[1em] mt-[1em] max-w-[17em] p-0 text-[14.5px] leading-[1.55em] text-prose md:mt-[1.4em] md:max-w-[16em] min-[1081px]:mb-0 [@media(min-width:768px)_and_(max-width:1080px)]:mt-[1.1em] [@media(min-width:768px)_and_(max-width:1080px)]:max-w-full`}
            >
              {/* The 1em under it is their 1080px rule, which the mobile file's
                  `.mobHome` overrides never undo — so it applies on phones too. */}
              Create, customize and manage QR codes for web, print and business.
            </p>
            <FooterHelpButton />
          </div>

          <div
            className={`md:ml-[5em] md:flex md:flex-auto md:justify-between [@media(min-width:768px)_and_(max-width:1080px)]:ml-0 [@media(min-width:768px)_and_(max-width:1080px)]:flex-wrap [@media(min-width:768px)_and_(max-width:1080px)]:justify-start`}
          >
            {columns.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                {col.title === "Support" && <FooterLiveHelp />}
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                ))}
                {col.title === "QR Code Types" && (
                  <Link
                    href="/#types"
                    className="hidden min-h-[40px] items-center text-[14px] font-semibold text-primary transition-colors hover:text-primary-press group-data-[open=true]:flex md:mt-[1.3em] md:flex md:min-h-0 md:text-[14.5px]"
                  >
                    View All QR Types
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="ml-[0.4em] h-[1.1em] w-[1.1em] flex-none"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </FooterColumn>
            ))}
          </div>
        </div>

        {/* Mobile reorders this row: the payment marks first, then a ruled
            copyright line, and the language picker is dropped. */}
        <div
          className={`flex flex-col items-center md:mt-[3.4em] md:flex-row md:justify-between md:border-t md:border-footer-rule md:pt-[1.7em] [@media(min-width:768px)_and_(max-width:1080px)]:flex-col`}
        >
          <p
            className={`order-2 mt-[24px] min-w-full border-t border-hero-divider p-0 pt-[22px] text-center text-[13px] text-muted md:order-none md:mt-0 md:min-w-0 md:border-t-0 md:pt-0 md:text-start md:text-[14px] [@media(min-width:768px)_and_(max-width:1080px)]:py-[0.7em]`}
          >
            © {year} BarcodesQR. All rights reserved.
          </p>

          <ul
            className={`order-1 grid grid-cols-5 gap-[0.8em] md:order-none md:flex md:gap-0 [@media(min-width:768px)_and_(max-width:1080px)]:mt-[1.5em]`}
          >
            {payments.map((p) => (
              <li
                key={p.alt}
                className="flex min-h-[3.8em] items-center justify-center rounded-[6px] border border-footer-pay-line bg-white px-[0.7em] md:min-h-0 md:px-[0.6em] md:py-[0.3em] md:[&+&]:ml-[0.7em]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className="w-[4em] max-w-[86%] md:w-[34px] md:max-w-none" />
              </li>
            ))}
          </ul>

          {/* Display-only until i18n is wired up; their mobile file hides it. */}
          <div
            className={`hidden items-center rounded-[8px] border border-footer-lang-line bg-white px-[1.15em] py-[0.55em] text-[14px] text-body md:flex [@media(min-width:768px)_and_(max-width:1080px)]:mt-[1.6em]`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mr-[0.5em] h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>English</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="ml-[0.5em] h-3 w-3"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
