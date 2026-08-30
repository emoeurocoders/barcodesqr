import Link from "next/link";
import { LiveHelpLink } from "@/components/support/LiveHelpLink";

const links = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms & Conditions" },
];

export function SlimFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line/80 bg-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 text-sm text-muted sm:justify-start">
        <span>© {year} BarcodesQR.</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
        <LiveHelpLink className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-primary" />
      </div>
    </footer>
  );
}
