import Link from "next/link";
import { ArrowRight, Globe, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LiveHelpLink } from "@/components/support/LiveHelpLink";
import { FooterColumn } from "./FooterColumn";

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
      { href: "/reviews", label: "Reviews" },
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
  { src: "/payments/visa.svg", alt: "Visa", className: "h-[22px] w-auto" },
  {
    src: "/payments/mastercard.svg",
    alt: "Mastercard",
    className: "h-[22px] w-auto",
  },
  {
    src: "/payments/amex.svg",
    alt: "American Express",
    className: "h-[22px] w-auto",
  },
  { src: "/payments/applepay.svg", alt: "Apple Pay", className: "h-3.5 w-auto" },
  {
    src: "/payments/googlepay.svg",
    alt: "Google Pay",
    className: "h-3.5 w-auto",
  },
];

const linkClass = "text-sm text-muted transition-colors hover:text-ink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-hero-divider bg-white md:border-line">
      <div className="container-home pb-[26px] pt-[42px] md:py-14">
        <div className="grid gap-0 pb-[25px] md:gap-10 md:pb-0 lg:grid-cols-[1.6fr_repeat(5,1fr)]">
          {/* Brand. On mobile their `.lgo` reserves 120px on the right and hangs
              the Live Help button in it; on desktop that button lives in the
              Support column instead, which is where their main.html puts it. */}
          <div className="relative pr-[120px] md:pr-0">
            <span className="inline-flex items-center gap-2">
              <Logo />
              {/* Their footer wordmark is 21px/800 on mobile against the
                  header's 18px/700; desktop keeps the 18. */}
              <span className="text-[21px] font-extrabold leading-[normal] tracking-tight text-ink md:text-lg md:font-bold md:leading-7">
                Barcodes<span className="text-primary">QR</span>
              </span>
            </span>
            <p className="mt-[1em] max-w-[17em] text-sm leading-relaxed text-muted md:mt-4 md:max-w-[15rem]">
              Create, customize and manage QR codes for web, print and business.
            </p>

            {/* `flex-row-reverse` because their button leads with the glyph and
                LiveHelpLink renders it after the label. */}
            <LiveHelpLink className="absolute right-0 top-0 inline-flex h-[44px] flex-row-reverse items-center gap-[7px] rounded-[10px] border border-primary bg-white px-[13px] text-[13px] font-bold text-primary [&>svg]:h-5 [&>svg]:w-5 md:hidden" />
          </div>

          {columns.map((col) => (
            <FooterColumn key={col.title} title={col.title}>
              {col.title === "Support" && (
                <li className="hidden md:block">
                  <LiveHelpLink className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary" />
                </li>
              )}
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    className={`flex min-h-[40px] items-center text-[14px] md:inline md:min-h-0 md:text-sm ${linkClass}`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {col.title === "QR Code Types" && (
                <li className="md:pt-1">
                  <Link
                    href="/#types"
                    className="inline-flex min-h-[40px] items-center gap-1.5 text-[14px] font-semibold text-primary transition-colors hover:text-primary-dark md:min-h-0 md:text-sm"
                  >
                    View All QR Types
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              )}
            </FooterColumn>
          ))}
        </div>

        {/* Mobile reorders this row: the payment marks come first, then a ruled
            copyright line, and the language picker is dropped. */}
        <div className="mt-0 flex flex-col items-center justify-between gap-0 border-t-0 pt-0 md:mt-12 md:gap-6 md:border-t md:border-line md:pt-6 sm:flex-row">
          <p className="order-2 mt-[24px] w-full border-t border-hero-divider pt-[22px] text-center text-[13px] text-muted md:order-none md:mt-0 md:w-auto md:border-0 md:pt-0 md:text-left md:text-sm">
            © {year} BarcodesQR. All rights reserved.
          </p>

          <div className="order-1 grid w-full grid-cols-5 items-center gap-2 md:order-none md:flex md:w-auto md:flex-wrap md:justify-center">
            {payments.map((p) => (
              <span
                key={p.alt}
                className="flex min-h-[44px] items-center justify-center rounded-md border border-line bg-white px-[0.4em] py-[0.3em] md:h-8 md:min-h-0 md:px-3 md:py-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.alt}
                  className={`w-10 max-w-[86%] md:w-auto md:max-w-none ${p.className}`}
                />
              </span>
            ))}
          </div>

          {/* Language is display-only until i18n is wired up, and their mobile
              file drops it outright. */}
          <span className="hidden items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink md:inline-flex">
            <Globe className="h-4 w-4 text-muted" aria-hidden="true" />
            English
            <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}
