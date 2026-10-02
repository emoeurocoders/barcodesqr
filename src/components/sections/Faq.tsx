"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { KeyboardEvent } from "react";

const items = [
  {
    q: "Can I edit my QR code after printing?",
    a: "Yes. If you created a dynamic QR code, you can update the destination or content anytime—without changing the printed code. Your scan experience stays seamless.",
  },
  {
    q: "What file formats can I download?",
    a: "Download your QR codes as PNG or JPG for screens and everyday print, or as vector SVG that stays crisp at any size — from business cards to billboards.",
  },
  {
    q: "Can I track how many people scan my QR code?",
    a: "Yes. Every dynamic code includes built-in analytics showing total and unique scans over time, plus the locations, devices and operating systems behind them.",
  },
  {
    q: "Can I customize my QR code with my logo and colors?",
    a: "Absolutely. Add your logo to the center, pick custom colors and gradients, change the dot and corner shapes, and wrap it all in a framed call-to-action that matches your brand.",
  },
  {
    q: "What’s the difference between a static and dynamic QR code?",
    a: "A static code stores its content permanently and can never be changed once printed. A dynamic code points to an editable destination, so you can update it anytime and track every scan.",
  },
  {
    q: "What happens to my QR codes if my subscription ends?",
    /*
      The two mockups answer this differently: mainB.html has the
      subscription-lapse answer, main_mobile.html still has the older
      "Static QR codes never expire" one. Each breakpoint shows its own file's.
    */
    a: "If your subscription ends, your dynamic QR codes will become inactive and scan analytics will pause. You’ll keep access through the end of any paid billing period. Reactivate your subscription anytime to restore your QR codes without having to reprint them.",
    // Byte for byte, including the missing dash after "expire" — raised.
    aMobile:
      "Static QR codes never expire they keep working forever. Dynamic codes stay active as long as your plan is active, and you can pause or reactivate them anytime.",
  },
];

/** The side panel's checklist, from mainB.html's #mainFaqs .rgt. */
const readyPoints = [
  "Unlimited dynamic QR codes",
  "Full customization & analytics",
  "Edit your QR codes anytime",
  "Download in PNG, SVG and JPEG",
  "Manage QR codes in one dashboard",
];

/**
 * main_mobile.html's #mainFaq, node for node: native <details>, all closed by
 * default (the designer dropped `open` from the first). <summary> brings
 * keyboard and screen-reader support with it, so there is no state here.
 *
 * Item root is 10px, then 2.1vw at 480 and below, as theirs is.
 */
function MobileFaq() {
  return (
    <div className="container-home leading-[normal] text-black md:hidden">
      <div className="text-center">
        <h4 className="text-[31px] font-extrabold tracking-[-0.035em] to-480:text-[6.5vw]">
          Frequently asked&nbsp;questions
        </h4>
        <p className="mx-auto mt-[0.85em] max-w-[19em] p-0 text-[20px] leading-[1.55em] text-muted to-480:text-[4.1vw]">
          Answers to the most common questions about creating and managing QR
          codes.
        </p>
      </div>
      <div className="mt-[min(30px,4.6875vw)]">
        <ul>
          {items.map((item, i) => (
            <li
              key={item.q}
              className={`overflow-hidden rounded-[1.7em] border border-hero-divider bg-white text-[10px] shadow-faq-item to-480:text-[2.1vw] ${
                i > 0 ? "mt-[1.48em]" : ""
              }`}
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center px-[1.85em] py-[1.5em] [&::-webkit-details-marker]:hidden">
                  {/* Their +/− is the toggle's ::before, so it is here too. */}
                  <span
                    aria-hidden="true"
                    className="mr-[0.64em] flex h-[2.04em] w-[2.04em] flex-none items-center justify-center rounded-full bg-faq-tgl text-[2.3em] font-semibold text-primary before:content-['+'] group-open:bg-primary group-open:text-white group-open:before:content-['−']"
                  ></span>
                  <p className="p-0 text-[1.85em] font-semibold leading-[1.3em]">
                    {item.q}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/faq/chevron.svg"
                    alt="Toggle"
                    className="ml-auto w-[2.2em] flex-none group-open:rotate-180"
                  />
                </summary>
                <div>
                  <p className="max-w-[44em] pb-[1.45em] pl-[4.66em] pr-[1.5em] pt-0 text-[1.72em] leading-[1.6em] text-prose to-576:font-medium">
                    {item.aMobile ?? item.a}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
        {/*
          Their side panel is in the mobile markup too, but `.mobHome #mainFaq
          .btm .rgt` hides it — kept, hidden, so the DOM matches node for node.
        */}
        <div className="hidden">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
          </span>
          <h5>
            Questions?
            <br /> We&rsquo;ve got answers.
          </h5>
          <p>
            Everything you need to know about creating, editing and managing QR
            codes.
          </p>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/faq-illustration.svg" alt="ico" />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  jQuery's slideDown/slideUp at 220ms with its default "swing" easing, which
  is 0.5 - cos(πt)/2 — exactly easeInOutSine.
*/
const SLIDE_MS = 220;
const SWING = "cubic-bezier(0.37, 0, 0.63, 1)";

/**
 * mainB.html's #mainFaqs. Their main.js keeps one item open at a time: the
 * first starts open, clicking another closes the open one, and clicking the
 * open one closes it. The `act` class (the toggle's colour and the arrow's
 * turn) flips immediately; only the answer's height animates.
 *
 * `shown` is separate from `act` because a closing answer has to stay
 * displayed until its slide finishes — their CSS hides `.ans` the instant
 * `act` goes, and jQuery holds it open with an inline style meanwhile.
 */
function DesktopFaq() {
  const [act, setAct] = useState<number | null>(0);
  const [shown, setShown] = useState<ReadonlySet<number>>(() => new Set([0]));
  const answers = useRef<(HTMLDivElement | null)[]>([]);
  const running = useRef(new Map<number, Animation>());

  const hide = (i: number) =>
    setShown((s) => {
      const next = new Set(s);
      next.delete(i);
      return next;
    });

  const slide = (i: number, down: boolean) => {
    const el = answers.current[i];
    running.current.get(i)?.cancel();
    running.current.delete(i);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!el || reduce) {
      if (!down) hide(i);
      return;
    }
    const h = el.scrollHeight;
    const anim = el.animate(
      { height: down ? ["0px", `${h}px`] : [`${h}px`, "0px"] },
      { duration: SLIDE_MS, easing: SWING },
    );
    running.current.set(i, anim);
    anim.onfinish = () => {
      running.current.delete(i);
      if (!down) hide(i);
    };
  };

  const toggle = (i: number) => {
    const prev = act;
    // Commit synchronously so an opening answer is displayed — and has a
    // height to measure — before its slide starts.
    flushSync(() => {
      setAct(prev === i ? null : i);
      if (prev !== i) setShown((s) => new Set(s).add(i));
    });
    if (prev !== null) slide(prev, false);
    if (prev !== i) slide(i, true);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(i);
    }
  };

  // Nothing left animating against an unmounted node.
  useEffect(() => {
    const anims = running.current;
    return () => {
      anims.forEach((a) => a.cancel());
      anims.clear();
    };
  }, []);

  return (
    <div className="container-frm hidden py-[76px] text-[10px] leading-[normal] text-black md:block">
      <div className="text-center">
        {/* Their <h4>, kept — the page's heading levels are the designer's. */}
        <h4 className="text-[40px] font-extrabold tracking-heading to-768:text-[36px]">
          Frequently asked questions
        </h4>
        <p className="mt-[0.55em] p-0 text-[18px] text-muted to-768:mx-auto to-768:max-w-[22em]">
          Answers to the most common questions about creating and managing QR
          codes.
        </p>
      </div>

      <div className="mt-[3em] flex items-start to-992:flex-col">
        <ul className="min-w-0 flex-auto to-992:w-full">
          {items.map((item, i) => {
            const isAct = act === i;
            return (
              <li
                key={item.q}
                className={`overflow-hidden rounded-[12px] border border-faq-line bg-white text-[10px] shadow-faq-item ${
                  i > 0 ? "mt-[1.8em]" : ""
                }`}
              >
                {/*
                  Their clickable row is a <div>, kept as one: role, tabIndex
                  and Enter/Space make it a button to the keyboard and to
                  assistive tech without swapping the element.
                */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isAct}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="flex cursor-pointer items-center px-[2em] py-[1.55em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
                >
                  {/* Their +/− is the toggle's ::before, so it is here too. */}
                  <span
                    aria-hidden="true"
                    className={`mr-[1.4em] flex h-[1.76em] w-[1.76em] flex-none items-center justify-center rounded-full text-[1.7em] font-semibold ${
                      isAct
                        ? "bg-primary text-white before:content-['−']"
                        : "bg-faq-tgl text-primary before:content-['+']"
                    }`}
                  ></span>
                  <p className="p-0 text-[1.8em] font-semibold">{item.q}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/faq/toggle.png"
                    alt="Toggle"
                    className={`ml-auto w-[1.8em] flex-none transition-transform duration-200 ease-[ease] ${
                      isAct ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div
                  id={`faq-answer-${i}`}
                  ref={(el) => {
                    answers.current[i] = el;
                  }}
                  hidden={!shown.has(i)}
                  className="overflow-hidden border-t border-faq-answer-line bg-faq-answer"
                >
                  <p className="max-w-[40em] px-[2em] pb-[1.6em] pt-[1.5em] text-[1.5em] leading-[1.65em] text-prose">
                    {item.a}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="ml-[5em] flex-[0_0_340px] rounded-[18px] border border-faq-panel-line bg-white p-[29px] shadow-faq-panel to-992:mx-auto to-992:mt-[3em] to-992:w-full to-992:max-w-full to-992:flex-none">
          <span className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-pricing-note-tile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 23"
              fill="none"
              className="h-[23px] w-[23px]"
              aria-hidden="true"
            >
              <path d="M11.5 1.91667L13.1292 7.95417L19.1667 9.58333L13.1292 11.2125L11.5 17.25L9.87083 11.2125L3.83333 9.58333L9.87083 7.95417L11.5 1.91667Z" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.2083 17.25L18.6875 18.6875L20.125 19.1667L18.6875 19.6458L18.2083 21.0833L17.7292 19.6458L16.2917 19.1667L17.7292 18.6875L18.2083 17.25Z" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h5 className="mt-[0.8em] max-w-[12.7em] text-[22px] font-extrabold leading-[1.18em] tracking-[-0.02em] text-ink">
            Ready to create your QR&nbsp;code?
          </h5>
          <p className="mt-[0.75em] max-w-[18.6em] p-0 text-[15px] leading-[1.5em] text-muted">
            Create, customize, track and manage your QR codes from one simple
            dashboard.
          </p>
          <ul className="mt-[1.3em]">
            {readyPoints.map((point, i) => (
              <li
                key={point}
                className={`flex items-start text-[14px] leading-[1.4em] text-faq-check-ink ${
                  i > 0 ? "mt-[0.8em]" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/faq/check.svg"
                  alt="Check"
                  className="mr-[0.65em] mt-[0.15em] w-[16px] flex-none"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-[84px] bg-white py-[48px] to-480:py-[10vw] md:scroll-mt-20 md:py-0"
    >
      <MobileFaq />
      <DesktopFaq />
    </section>
  );
}
