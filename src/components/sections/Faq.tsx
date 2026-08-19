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
    <section id="faq" className="scroll-mt-20 bg-white">
      <div className="container-page py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Frequently asked&nbsp;questions
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          Answers to the most common questions about creating and managing QR
          codes.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[7fr_4fr] lg:gap-14">
          {/* Accordion */}
          <ul className="space-y-3">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.q}
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen ? "border-line bg-white" : "border-line/70 bg-white"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left"
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors ${
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

                      <span className="flex-1 text-base font-bold text-ink">
                        {item.q}
                      </span>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-muted transition-transform ${
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
                    className="bg-bg-alt/60"
                  >
                    <p className="px-5 py-4 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Side panel */}
          <div className="lg:pl-4">
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
