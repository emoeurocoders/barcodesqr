"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, QrCode } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { LoginModal } from "@/components/auth/LoginModal";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/help", label: "Help" },
];

export function Header({
  user,
  openLogin = false,
}: {
  user?: { name?: string | null } | null;
  /** Start with the login modal open — see the home page. */
  openLogin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(openLogin);
  const signedIn = Boolean(user);

  // Pinned, as of the designer's 2026-09-03 sync: #mainHdr gained
  // `position: fixed; width: 100%; left: 0; top: 0`, reversing the earlier
  // decision this port followed when it unpinned the header.
  //
  // The spacer below is ours. Their file compensates with `padding-top: 83px`
  // on #mainHero alone, so on help.html and terms.html the first section slides
  // under the header — verified, and reported upstream. Pushing the page down
  // from inside the component means every page that renders a Header clears it
  // and none can be forgotten.
  //
  // It also reinstates the reason for their `scroll-margin-top: 2em` on the
  // terms sections: under a pinned header an anchor jump lands behind it.
  //
  // z-40, not their z-index: 12. Nothing in their page climbs above 12, but
  // this port's hero was built on Tailwind's scale and floats its dashboard
  // cards at z-20 and z-30 — at 12 those scrolled straight over the header.
  // 40 also clears the login modal, which renders inside this element: a fixed
  // header with a z-index opens a stacking context, so at 12 the z-50 modal
  // was trapped beneath those same z-30 cards. It stays below the create
  // flow's own z-50 overlay, which is outside this context.
  return (
    <>
      <div aria-hidden="true" className="h-[65px]" />
      <header className="fixed left-0 top-0 z-40 w-full border-b border-line bg-white">
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
          {signedIn ? (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <Button variant="ghost" onClick={() => setLogin(true)}>
              Log in
            </Button>
          )}
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
              {signedIn ? (
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="lg" fullWidth>
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setOpen(false);
                    setLogin(true);
                  }}
                >
                  Log in
                </Button>
              )}
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
      {login && <LoginModal onClose={() => setLogin(false)} />}
    </header>
    </>
  );
}
