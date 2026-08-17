"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  {
    q: "What is BarcodesQR?",
    a: "BarcodesQR is an online platform for creating dynamic, customizable QR codes you can edit anytime and track with built-in analytics.",
  },
  {
    q: "Why use BarcodesQR instead of a free QR generator?",
    a: "Free tools produce static codes you can never change. With BarcodesQR your codes are editable after printing, fully branded, and come with scan analytics.",
  },
  {
    q: "Do I need to install any software?",
    a: "No. Everything runs in your browser — design, download and manage your codes from any device.",
  },
  {
    q: "Can I edit my QR code after printing?",
    a: "Yes. Dynamic codes can be repointed to a new destination at any time without changing the printed image.",
  },
  {
    q: "Is BarcodesQR free?",
    a: "You can design and preview a code for free. Downloading and unlocking dynamic features is included with an affordable trial or plan.",
  },
  {
    q: "How do I create a BarcodesQR account?",
    a: "Enter your email at checkout or on the sign-up page and your account is created automatically — no lengthy forms.",
  },
  {
    q: "How does automatic renewal work?",
    a: "Your plan renews automatically at the end of each billing period so your codes keep working. You can turn off renewal anytime.",
  },
  {
    q: "Why was I charged after my trial?",
    a: "Trials convert to a paid plan automatically when they end, unless you cancel beforehand. Cancel anytime from your dashboard to avoid the charge.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Open your dashboard and cancel in a couple of clicks. Your codes keep working through the end of the current billing period.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "Renewals stop and you keep full access until the period you've paid for ends. Your dynamic codes stay active until then.",
  },
  {
    q: "What happens if my subscription expires?",
    a: "Editing and analytics pause, and dynamic codes show a friendly notice on scan. Reactivate anytime to bring them back instantly.",
  },
  {
    q: "I don't recognize this charge. What should I do?",
    a: "Charges appear as BarcodesQR on your statement. If something looks wrong, contact our team with your account email and we'll sort it out.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If you're not satisfied, reach out within 14 days of a charge and we'll review your refund request.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 bg-bg">
      <div className="container-page py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Answers for your full QR-code journey.
        </p>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium text-ink hover:bg-bg-alt"
                  >
                    {item.q}
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  hidden={!isOpen}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
