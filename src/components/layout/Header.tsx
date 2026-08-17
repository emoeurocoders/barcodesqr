"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, QrCode } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/help", label: "Help" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link aria-label="BarcodesQR home" href="/">
          <span className="inline-flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold tracking-tight text-ink">
              BarcodesQR
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/create">
            <Button>
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Create QR Code
            </Button>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav-panel"
          className="border-t border-line bg-white md:hidden"
        >
          <nav className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-alt"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="lg" fullWidth>
                  Log in
                </Button>
              </Link>
              <Link href="/create" onClick={() => setOpen(false)}>
                <Button size="lg" fullWidth>
                  <QrCode className="h-4 w-4" aria-hidden="true" />
                  Create QR Code
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
