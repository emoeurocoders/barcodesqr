import Link from "next/link";
import { MessageCircle, ArrowRight, Globe, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

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
    <footer className="mt-auto border-t border-line bg-white">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_repeat(5,1fr)]">
          {/* Brand */}
          <div>
            <span className="inline-flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold tracking-tight text-ink">
                Barcodes<span className="text-primary">QR</span>
              </span>
            </span>
            <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-muted">
              Create, customize and manage QR codes for web, print and business.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-ink">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.title === "Support" && (
                  <li>
                    <Link
                      href="/help"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary"
                    >
                      Live Help
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </Link>
                  </li>
                )}
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link className={linkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                {col.title === "QR Code Types" && (
                  <li className="pt-1">
                    <Link
                      href="/#types"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      View All QR Types
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-line pt-6 sm:flex-row">
          <p className="text-sm text-muted">
            © {year} BarcodesQR. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {payments.map((p) => (
              <span
                key={p.alt}
                className="flex h-8 items-center justify-center rounded-md border border-line bg-white px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className={p.className} />
              </span>
            ))}
          </div>

          {/* Language is display-only until i18n is wired up. */}
          <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink">
            <Globe className="h-4 w-4 text-muted" aria-hidden="true" />
            English
            <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}
