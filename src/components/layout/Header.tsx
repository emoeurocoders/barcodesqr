"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, QrCode } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { LoginModal } from "@/components/auth/LoginModal";

/**
 * The drawer's links, from `#mobNav` in the designer's main_mobile.html. They
 * are section anchors on the home page, not the site nav the old dropdown
 * carried — the designer replaced one with the other, so Features/Reviews/Help
 * are deliberately gone from here.
 *
 * Their hrefs are absolute (`/#steps`, not `#steps`) because this Header also
 * renders on /help, /terms and the creator, where those sections do not exist.
 * The designer only mocked the drawer on the home page; from anywhere else a
 * bare fragment would scroll to nothing. Flagged as unmocked in the handover.
 *
 * The id on the right of each pair is this port's, not the mockup's: the port
 * named these sections before this file arrived (#features is their #mainWhy,
 * #types their #mainTypes). The labels are theirs, byte for byte.
 */
const drawerLinks = [
  { href: "/#hero", label: "Home" },
  { href: "/#steps", label: "Create a QR Code" },
  { href: "/#features", label: "Manage & Track" },
  { href: "/#types", label: "QR Code Types" },
  { href: "/#choose", label: "Why BarcodesQR" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
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

  // `.mobHome.mobNavOpen { overflow: hidden }` in their stylesheet. Restoring
  // the previous value rather than clearing it keeps this from stomping on the
  // create flow's own lock if the two ever overlap, and the cleanup runs on
  // unmount too — a client-side navigation away with the drawer open would
  // otherwise leave the page unscrollable.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
      {/* 70px on mobile is theirs: a 48px hamburger with 10px above and below.
          Their #mainHero compensates with calc(70px + 10.8vw), so this spacer
          has to be that same 70 or the hero starts a pixel low. Desktop keeps
          the 65px it has always had. */}
      <div aria-hidden="true" className="h-[70px] md:h-[65px]" />
      <header className="fixed left-0 top-0 z-40 w-full border-b border-line bg-white">
      {/* Spelled out rather than `container-page` because the designer's mobile
          gutter is 2rem against their fluid root (3.125vw), not the 20px the
          utility hard-codes. Everything from `md:` up reproduces the utility
          exactly — same 1200px cap, same 1.25rem inline padding. */}
      <div className="mx-auto flex h-[70px] w-full max-w-[1200px] items-center justify-between gap-4 px-[3.125vw] md:h-16 md:px-5">
        {/* Their `#mainLogo a` is a 153px-wide background image on mobile
            against 140px on desktop, so the mark and wordmark are scaled up
            together here to land on the same 153. This port draws the logo as
            an SVG plus live text rather than one background image — a
            divergence that predates this branch — so the width is reached by
            sizing both halves rather than by setting it outright. */}
        <Link aria-label="BarcodesQR home" href="/">
          <span className="inline-flex items-center gap-[9px] md:gap-2">
            <Logo className="h-[30px] w-[30px] text-primary md:h-7 md:w-7" />
            <span className="text-[19.8px] font-bold tracking-tight text-ink md:text-lg">
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

        {/* Their `.brg`: 48px square, 12px radius, 25px glyph. */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-xl border border-nav-line bg-white text-ink transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:hidden"
        >
          <Menu className="h-[25px] w-[25px]" aria-hidden="true" />
        </button>
      </div>

      {/* The drawer and its scrim. Both sit inside the header, which is already
          a stacking context at z-40, so their z-indexes only have to order them
          against each other and the modal — their 990/1000 would read as 30/40
          here and would put the drawer OVER the z-50 login modal, which opens
          from the drawer's own Log In button. */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-ink/45 transition-opacity duration-[250ms] ease-out md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <nav
        id="mobile-nav-panel"
        aria-label="Site"
        aria-hidden={!open}
        className={`fixed bottom-0 right-0 top-0 z-40 flex w-[300px] max-w-[84vw] flex-col bg-white shadow-drawer transition-transform duration-300 ease-out will-change-transform md:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-[340px]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line py-[13px] pl-5 pr-3.5">
          <span className="text-[15px] font-bold text-ink">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-[10px] border border-nav-line text-body transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-2.5">
          {drawerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-center rounded-[10px] px-3 py-[13px] text-[15.5px] font-medium text-body transition-colors hover:bg-nav-hover hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Their `.btm`: two full-width buttons, 10px apart. Written out instead
            of reusing <Button> because these are 39px tall — padding-driven off
            a 13px label — and Button's sizes are fixed heights that an
            arbitrary `h-[39px]` cannot be relied on to beat without
            tailwind-merge, which this project does not carry. */}
        <div className="border-t border-line px-5 pb-5 pt-4">
          {signedIn ? (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              className="flex w-full items-center justify-center rounded-btn border border-primary bg-white py-[13px] text-[13px] font-medium leading-none text-black transition-colors hover:bg-primary hover:text-on-accent"
            >
              Dashboard
            </Link>
          ) : (
            <button
              type="button"
              tabIndex={open ? undefined : -1}
              onClick={() => {
                setOpen(false);
                setLogin(true);
              }}
              className="flex w-full cursor-pointer items-center justify-center rounded-btn border border-primary bg-white py-[13px] text-[13px] font-medium leading-none text-black transition-colors hover:bg-primary hover:text-on-accent"
            >
              Log In
            </button>
          )}
          <Link
            href="/create"
            onClick={() => setOpen(false)}
            tabIndex={open ? undefined : -1}
            className="mt-2.5 flex w-full items-center justify-center rounded-btn bg-primary py-[13px] text-[13px] font-medium leading-none text-on-accent transition-colors hover:bg-primary-press"
          >
            Create QR Code
          </Link>
        </div>
      </nav>

      {login && <LoginModal onClose={() => setLogin(false)} />}
    </header>
    </>
  );
}
