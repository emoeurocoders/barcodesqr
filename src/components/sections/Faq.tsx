"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus, MessageCircle } from "lucide-react";

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
    a: "Static QR codes never expire — they keep working forever. Dynamic codes stay active as long as your plan is active, and you can pause or reactivate them anytime.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="md:order-2 scroll-mt-[84px] md:scroll-mt-20 bg-white">
      <div className="container-home pb-[30px] pt-[59px] md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          <span className="block text-[6.5vw] tracking-[-0.035em] md:hidden">
            Frequently asked&nbsp;questions
          </span>
          <span className="hidden md:inline">
            Frequently asked&nbsp;questions
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          <span className="mx-auto -mt-3 block max-w-[19em] pt-[0.85em] text-[4.1vw] leading-[1.55] md:hidden">
            Answers to the most common questions about creating and managing QR
            codes.
          </span>
          <span className="hidden md:inline">
            Answers to the most common questions about creating and managing QR
            codes.
          </span>
        </p>

        <div className="mt-[4.6875vw] grid gap-0 md:mt-12 md:gap-10 lg:grid-cols-[7fr_4fr] lg:gap-14">
          {/* Accordion */}
          <ul className="space-y-0 md:space-y-3">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.q}
                  className={`mt-[1.48em] overflow-hidden rounded-[1.7em] border bg-white text-[2.1vw] leading-[normal] shadow-[0_2px_6px_rgba(14,19,17,0.04)] transition-colors first:mt-0 md:leading-normal md:mt-0 md:rounded-2xl md:text-[1rem] md:shadow-none ${
                    isOpen
                      ? "border-hero-divider md:border-line"
                      : "border-hero-divider md:border-line/70"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full cursor-pointer items-center gap-[1.47em] px-[1.85em] py-[1.5em] text-left md:gap-4 md:px-5 md:py-4"
                    >
                      <span
                        className={`grid h-[2.04em] w-[2.04em] shrink-0 place-items-center rounded-full text-[2.3em] transition-colors md:h-7 md:w-7 md:text-[1rem] ${
                          isOpen
                            ? "bg-primary text-white"
                            : "bg-primary-soft text-primary"
                        }`}
                        aria-hidden="true"
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>

                      <span className="flex-1 text-[1.85em] font-bold leading-[1.3] text-ink md:text-base md:leading-normal">
                        {item.q}
                      </span>

                      <ChevronDown
                        className={`h-[2.2em] w-[2.2em] shrink-0 text-muted transition-transform md:h-5 md:w-5 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    hidden={!isOpen}
                    className="bg-transparent md:bg-bg-alt/60"
                  >
                    <p className="pb-[1.45em] pl-[4.66em] pr-[1.5em] pt-0 text-[1.72em] leading-[1.6] text-muted md:px-5 md:py-4 md:text-sm md:leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Side panel */}
          <div className="hidden md:block lg:pl-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>

            <h3 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-ink">
              Questions?
              <br />
              We&rsquo;ve got answers.
            </h3>

            <p className="mt-4 max-w-sm leading-relaxed text-muted">
              Everything you need to know about creating, editing and managing
              QR codes.
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/faq-illustration.svg"
              alt=""
              aria-hidden="true"
              className="mt-10 w-full max-w-xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
