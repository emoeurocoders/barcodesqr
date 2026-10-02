"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mobileCtaClass } from "./Hero";

/**
 * main_mobile.html's `#mobCta`: a "Create Your QR Code" bar pinned to the
 * bottom of the screen at 576px and below. It slides up once the hero's own
 * CTA has scrolled out of view and slides away again while
 *
 *   - the closing panel's CTA is on screen (two identical buttons at once),
 *   - the drawer or a modal is open, or
 *   - a form field has focus (the on-screen keyboard would push it up).
 *
 * Their main.js reads the first two from the DOM — IntersectionObservers on
 * `#mainHero .btnWrp .btn` and `#mainReady .rgt .btn`, MutationObservers on
 * the classes their drawer and remodal put on <body> and <html>. The same
 * signals here: the two buttons carry `data-mob-cta`, and both the drawer and
 * every lightbox (they all go through PaywallShell) lock scrolling with
 * `body.style.overflow = "hidden"` for exactly as long as they are open, so
 * that lock is the "something is covering the page" flag.
 *
 * It is a <button> in their file; here it is a link, because it navigates and
 * the hero CTA it stands in for is one.
 */
export function MobileCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [covered, setCovered] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const watch = (selector: string, onChange: (inView: boolean) => void) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const io = new IntersectionObserver((entries) =>
        onChange(entries[0].isIntersecting),
      );
      io.observe(el);
      observers.push(io);
    };
    watch('[data-mob-cta="hero"]', (inView) => setHeroGone(!inView));
    watch('[data-mob-cta="end"]', setEndVisible);

    const syncCovered = () =>
      setCovered(document.body.style.overflow === "hidden");
    syncCovered();
    const mo = new MutationObserver(syncCovered);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    const isField = (el: Element | null) =>
      !!el && el.matches("input, textarea, select");
    let blurTimer: ReturnType<typeof setTimeout> | undefined;
    const onFocusIn = (e: FocusEvent) => {
      if (isField(e.target as Element)) setTyping(true);
    };
    // Their 80ms wait: focus moving straight from one field to the next
    // should not flash the bar in between.
    const onFocusOut = (e: FocusEvent) => {
      if (!isField(e.target as Element)) return;
      clearTimeout(blurTimer);
      blurTimer = setTimeout(
        () => setTyping(isField(document.activeElement)),
        80,
      );
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      observers.forEach((io) => io.disconnect());
      mo.disconnect();
      clearTimeout(blurTimer);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const show = heroGone && !endVisible && !covered && !typing;

  return (
    <div
      aria-hidden={!show}
      className={`fixed bottom-0 left-0 right-0 z-30 hidden border-t border-line bg-white px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-[10px] shadow-mob-cta transition-transform duration-300 ease-in-out will-change-transform to-576:block ${
        show ? "translate-y-0" : "pointer-events-none translate-y-[110%]"
      }`}
    >
      <div className="mx-auto max-w-[85%]">
        <Link
          href="/create"
          tabIndex={show ? undefined : -1}
          className={`${mobileCtaClass} py-[1.15em]`}
        >
          Create Your QR Code
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-[1.3em] w-[1.3em]"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
