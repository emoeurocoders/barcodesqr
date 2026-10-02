"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, QrCode } from "lucide-react";
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
 * The ids are this port's, not the mockup's: the port named these sections
 * before this file arrived (#features is their #mainWhy, #types their
 * #mainTypes). The labels, their order and the 1.8-stroke glyphs are theirs —
 * the glyphs copied verbatim rather than matched to lucide, whose versions of
 * several (the star, the scan frame) are drawn differently.
 */
const drawerLinks = [
  {
    href: "/#hero",
    label: "Home",
    icon: (
      <>
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
  },
  {
    href: "/#steps",
    label: "Create a QR Code",
    icon: (
      <>
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </>
    ),
  },
  {
    href: "/#types",
    label: "QR Code Types",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h.01" />
        <path d="M21 14h.01" />
        <path d="M17.5 17.5h.01" />
        <path d="M14 21h.01" />
        <path d="M21 21h.01" />
      </>
    ),
  },
  {
    href: "/#features",
    label: "Manage & Track",
    icon: (
      <>
        <path d="M6 20v-5" />
        <path d="M12 20V9" />
        <path d="M18 20v-8" />
      </>
    ),
  },
  {
    href: "/#choose",
    label: "Why BarcodesQR",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </>
    ),
  },
  {
    href: "/#pricing",
    label: "Pricing",
    icon: (
      <path d="M12 3.5l2.65 5.62 6.15.78-4.52 4.28 1.16 6.1L12 17.32l-5.44 2.96 1.16-6.1L3.2 9.9l6.15-.78z" />
    ),
  },
  {
    href: "/#faq",
    label: "FAQ",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h4" />
      </>
    ),
  },
];

/** Their `.genBtn1`: 14px/500 label, 0.65em x 1.1em padding, 0.7em corners. */
const hdrBtn =
  "inline-block rounded-[0.7em] px-[1.1em] py-[0.65em] text-[14px] font-medium leading-[1.1em]";

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
  // The spacer below is ours. Their file pushes the page down with a
  // `#mainHdr + section` margin; a spacer inside the component does the same
  // for every page that renders a Header, whatever follows it.
  //
  // It also reinstates the reason for their `scroll-margin-top: 2em` on the
  // terms sections: under a pinned header an anchor jump lands behind it.
  //
  // z-40, not their z-index: 12. The login modal renders inside this
  // element, and a fixed header with a z-index opens a stacking context — at
  // 12 the z-50 modal was trapped beneath page content stacked at z-20/z-30.
  // 40 keeps it above anything a section floats, while staying below the
  // create flow's own z-50 overlay, which is outside this context.
  return (
    <>
      {/* Their `#mainHdr + section { margin-top }`, as a spacer so every page
          clears the bar. 83px at 1300 and up, 71px below — note that between
          1025 and 1299 their bar is 74px tall against that 71px margin, so the
          first section tucks 3px under it. Reproduced, and reported upstream.

          On mobile their sections do not follow the header directly (the
          drawer sits between), so the 71 never applies; their hero pads itself
          by calc(70px + 10vw) instead, and this spacer is that 70. */}
      <div aria-hidden="true" className="h-[70px] [@media(min-width:768px)_and_(max-width:1299px)]:h-[71px] min-[1300px]:h-[83px]" />
      <header className="fixed left-0 top-0 z-40 w-full border-b border-line bg-white md:py-px">
      {/*
        Their `.ctr` has no max-width: the logo and the buttons sit against the
        viewport's edges, not a centred column. Its gutter steps three times —
        20px of padding at 1300 and up, 20px of margin PLUS 20px of padding
        from 1025 to 1299, and margin alone at 1024 and below — measured from
        the mockup at 768, 1024, 1100, 1250 and 1300.
      */}
      <div className="flex h-[70px] items-center justify-between gap-4 px-[3.125vw] md:h-auto [@media(min-width:768px)_and_(max-width:1024px)]:px-0 [@media(min-width:768px)_and_(max-width:1299px)]:mx-5 min-[1025px]:px-5">
        {/* Their `h1#mainLogo > a`: the wordmark is a background image and the
            link's own text is pushed off-screen, so it is still what assistive
            tech reads. 80px tall at 1300 and up, 68px below. */}
        <h1>
          <Link
            href="/"
            className="block h-[68px] w-[153px] overflow-hidden whitespace-nowrap bg-[url(/brand/logo.svg)] bg-contain bg-left bg-no-repeat -indent-[8000px] text-[20px] font-bold min-[1300px]:h-[80px]"
          >
            BarcodesQR
          </Link>
        </h1>

        {/* Their `#mainLoginNav`: two genBtn1 buttons — btnC0 (plain black
            label) and btnC1 (filled blue) — 10px apart. */}
        <nav className="hidden md:block">
          <ul className="flex items-center py-[10px] min-[1025px]:py-[18px]">
            <li className="inline-flex whitespace-nowrap pr-[5px] text-[14px] leading-[44px]">
              {signedIn ? (
                <Link href="/dashboard" className={hdrBtn + " text-black"}>
                  Dashboard
                </Link>
              ) : (
                // Their link opens the login lightbox. `?signin=` is the
                // home page's own way of arriving with it open, so the href
                // still does the right thing without JavaScript.
                <Link
                  href="/?signin=1"
                  onClick={(e) => {
                    e.preventDefault();
                    setLogin(true);
                  }}
                  className={hdrBtn + " text-black"}
                >
                  Log In
                </Link>
              )}
            </li>
            <li className="inline-flex whitespace-nowrap pl-[5px] text-[14px] leading-[44px]">
              <Link
                href="/create"
                className={
                  hdrBtn +
                  " inline-flex items-center gap-[0.8em] bg-primary text-on-accent transition-colors hover:bg-primary-press"
                }
              >
                <QrCode className="h-[1.2em] w-[1.2em]" aria-hidden="true" />
                Create QR Code
              </Link>
            </li>
          </ul>
        </nav>

        {/* Their `.brg`: 48px square, 12px radius, 25px glyph. */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-xl border border-nav-line bg-white text-ink transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:hidden"
        >
          {/* Theirs, not lucide's `Menu`: the installed version draws the
              bars at y 5/12/19, the mockup's at 6/12/18. */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-[25px] w-[25px]"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
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

        <ul className="flex-[0_1_auto] overflow-y-auto px-2.5 pb-[60px] pt-2.5">
          {drawerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-center rounded-[10px] px-3 py-[13px] text-[15.5px] font-medium text-body transition-colors hover:bg-nav-hover hover:text-primary"
              >
                <i className="mr-[15px] flex shrink-0 not-italic">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    {link.icon}
                  </svg>
                </i>
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
            <Link
              href="/?signin=1"
              tabIndex={open ? undefined : -1}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                setLogin(true);
              }}
              className="flex w-full cursor-pointer items-center justify-center rounded-btn border border-primary bg-white py-[13px] text-[13px] font-medium leading-none text-black transition-colors hover:bg-primary hover:text-on-accent"
            >
              Log In
            </Link>
          )}
          <Link
            href="/create"
            onClick={() => setOpen(false)}
            tabIndex={open ? undefined : -1}
            className="mt-2.5 flex w-full items-center justify-center rounded-btn bg-primary py-[13px] text-[13px] font-medium leading-none text-on-accent transition-colors hover:bg-primary-press"
          >
            Create Your QR Code
          </Link>
        </div>
      </nav>

      {login && <LoginModal onClose={() => setLogin(false)} />}
    </header>
    </>
  );
}
