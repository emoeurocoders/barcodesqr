import Link from "next/link";
import { Headphones } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Customer Support",
    links: [
      { href: "/dashboard", label: "Cancel Subscription" },
      { href: "/help", label: "Contact Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy & Cookie Policy" },
      { href: "/legal/terms", label: "Terms & Conditions" },
      { href: "/legal/terms#refunds", label: "Refund Policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#pricing", label: "Pricing" },
      { href: "/reviews", label: "Reviews" },
      { href: "/help", label: "Help Center" },
    ],
  },
  {
    title: "Features",
    links: [
      { href: "/#features", label: "Full QR Customization" },
      { href: "/#features", label: "Dynamic & Editable QR Codes" },
      { href: "/#features", label: "Advanced QR Analytics" },
      { href: "/#features", label: "High-Quality QR Downloads" },
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
  {
    src: "/payments/applepay.svg",
    alt: "Apple Pay",
    className: "h-3.5 w-auto",
  },
  {
    src: "/payments/googlepay.svg",
    alt: "Google Pay",
    className: "h-3.5 w-auto",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-bg-alt">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <span className="inline-flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold tracking-tight text-ink">
                BarcodesQR
              </span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Create, customize and track QR codes that work everywhere.
            </p>
            <p className="mt-4 max-w-[16rem] text-xs text-muted">
              100 Example Ave, Suite 200, Wilmington, DE 19801, USA
            </p>
            <p className="mt-1 text-xs text-muted">
              © {year} BarcodesQR. All rights reserved.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-sm text-muted transition-colors hover:text-ink"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.title === "Customer Support" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-white p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Headphones className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-ink">
                    Reach our team 24/7
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-line pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p.alt}
                className="flex h-7 items-center justify-center rounded-md border border-line bg-white px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className={p.className} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
