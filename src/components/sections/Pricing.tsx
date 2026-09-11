import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Plan = {
  name: string;
  price: string;
  period: string;
  /** Small print under the price — the renewal or billing terms. */
  terms: string;
  /** Optional discount pill shown between the price and the terms. */
  save?: string;
  href: string;
  /**
   * The button's own words. Their file gives each plan a different call to
   * action rather than one shared "Get Started".
   *
   * Note the trial reads "$1 Trial" while the card above it prints 1.00 — the
   * designer is inconsistent within their own markup. Theirs is reproduced;
   * raised in the handover.
   */
  cta: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "7-Day Trial",
    price: "1.00",
    period: "/ 7 days",
    terms: "then $39.95 / month",
    href: "/checkout?plan=trial",
    cta: "Start $1 Trial",
    highlighted: true,
    features: [
      "Unlimited QR codes",
      "Full customization",
      "Dynamic & editable codes",
      "Scan analytics",
    ],
  },
  {
    name: "Quarterly",
    price: "29.95",
    period: "/ month",
    save: "Save 25%",
    terms: "billed quarterly $89.85",
    href: "/checkout?plan=quarterly",
    cta: "Start Quarterly Plan",
    features: [
      "Everything in trial",
      "Priority support",
      "Bulk creation",
      "Password protection",
    ],
  },
  {
    name: "Bi-Annual",
    price: "19.95",
    period: "/ month",
    save: "Save 50%",
    terms: "billed bi-annually $119.70",
    href: "/checkout?plan=biannual",
    cta: "Start Bi-Annual Plan",
    badge: "Most popular",
    features: [
      "Everything in quarterly",
      "Best value, billed bi-annually",
      "Team sharing",
      "Advanced exports",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="md:order-2 scroll-mt-[84px] md:scroll-mt-20 bg-bg">
      <div className="container-home pb-16 pt-[59px] md:py-20">
        {/* Two headings: main.html and main_mobile.html genuinely word this
            line differently. The sub-line below is shared, byte for byte. */}
        {/*
          The element keeps its desktop classes verbatim and the mobile styling
          hangs off a `block` span inside it, rather than being layered on with
          `md:` overrides.

          That is deliberate, and the rest of this port follows it: a font-size
          utility in Tailwind v4 also sets `line-height`, so re-stating one at
          `md:` means reproducing the other by hand — `md:leading-10` here came
          out 2px short of what `text-4xl` sets itself, which walked the whole
          page below this point up by two pixels. A block span carries its own
          font-size and leading and leaves the parent's alone.
        */}
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          <span className="mx-auto block max-w-[11.5em] text-[7.9vw] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink md:hidden">
            Start with a $1 trial or save with a longer plan
          </span>
          <span className="hidden md:inline">
            Start your trial today and upgrade anytime
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          <span className="mx-auto -mt-3 block max-w-[22em] pt-[0.85em] text-[4.1vw] leading-[1.55] md:hidden">
            Every plan includes unlimited dynamic codes, analytics and
            customization.
          </span>
          <span className="hidden md:inline">
            Every plan includes unlimited dynamic codes, analytics and
            customization.
          </span>
        </p>

        {/*
          One markup for both. Below `md:` the card is the designer's named-area
          grid (see `plan-grid`); from `md:` up it is the flex column it has
          always been, and every `[grid-area:…]` below goes inert.
        */}
        <div className="mx-auto mt-[4.6875vw] grid max-w-5xl gap-y-0 md:mt-12 md:gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              /*
                `text-[2.1vw]` is the card's own root: every `em` below resolves
                against it, which is how the designer sizes this block. The
                stacking margin is a margin rather than a grid `gap` because
                their `:has(.tag)` rule REPLACES the 1.8rem with 3rem to clear
                the "Most popular" tag — a gap would have added to it instead.
              */
              className={`plan-grid relative grid items-start gap-x-[1.48em] gap-y-0 rounded-[2em] border bg-white p-[2.7em] text-[2.1vw] leading-[normal] shadow-[0_2px_4px_rgba(14,19,17,0.04)] first:mt-0 md:mt-0 md:leading-normal md:flex md:flex-col md:items-stretch md:gap-0 md:rounded-2xl md:p-7 md:text-[1rem] md:shadow-soft ${
                plan.badge ? "mt-[4.6875vw]" : "mt-[2.8125vw]"
              } ${
                plan.highlighted
                  ? "border-2 border-brand md:border md:ring-2 md:ring-brand/30"
                  : "border-line"
              }`}
            >
              {plan.badge && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand px-[1.3em] py-[0.42em] text-[1.35em] font-semibold text-white md:-top-3 md:translate-y-0 md:px-3 md:py-1 md:text-xs">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-[2.34em] font-extrabold text-ink [grid-area:ttl] md:text-lg md:font-bold">
                {plan.name}
              </h3>

              <div className="mt-[0.25em] flex items-baseline gap-0.5 [grid-area:prc] md:mt-3">
                <span className="text-[2.2em] font-bold text-ink md:text-xl">
                  $
                </span>
                <span className="text-[4.3em] font-extrabold leading-none tracking-tight text-ink md:text-5xl md:font-bold">
                  {plan.price}
                </span>
                <span className="ml-1.5 text-[1.23em] text-muted md:text-sm">
                  {plan.period}
                </span>
              </div>

              {plan.save ? (
                <span className="mt-[0.7em] inline-flex w-fit rounded-full bg-brand-soft px-[0.75em] py-[0.33em] text-[1.48em] font-semibold text-brand-dark [grid-area:bdg] md:mt-4 md:px-3 md:py-1 md:text-sm">
                  {plan.save}
                </span>
              ) : (
                /* Keeps the terms line and everything under it on the same
                   baseline as the plans that do show a discount pill. On mobile
                   the named-area grid does that on its own, so the spacer is
                   dropped rather than left to add an empty row. */
                <span aria-hidden="true" className="mt-4 hidden w-fit px-3 py-1 text-sm font-semibold opacity-0 md:inline-flex">
                  &nbsp;
                </span>
              )}

              <p className="mt-[1em] text-[1.35em] leading-[1.4] text-muted [grid-area:ln3] md:mt-4 md:text-sm md:leading-5">
                {plan.terms}
              </p>

              {/* Their `.ln2` loses its rule on mobile: `border-top: 0`. */}
              <hr className="mt-6 hidden border-line md:block" />

              <p className="pt-[0.15em] text-[1.6em] font-extrabold text-ink [grid-area:inc] md:mt-6 md:pt-0 md:text-sm md:font-bold">
                What&apos;s included:
              </p>
              <ul className="mt-[0.9em] space-y-[0.6em] text-[1.48em] [grid-area:lst] md:mt-4 md:flex-1 md:space-y-3 md:text-[1rem]">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-[1em] text-prose md:text-sm md:text-body"
                  >
                    <Check className="mt-[0.18em] h-[1.07em] w-[1.07em] shrink-0 text-brand md:mt-0.5 md:h-4 md:w-4" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-[2em] [grid-area:btn] md:mt-8">
                <Link
                  href={plan.href}
                  className={`flex w-full items-center justify-center rounded-btn py-[1.05em] text-[13px] font-medium leading-none transition-colors md:hidden ${
                    plan.highlighted
                      ? "bg-primary text-on-accent hover:bg-primary-press"
                      : "border border-primary bg-white text-black hover:bg-primary hover:text-on-accent"
                  }`}
                >
                  {plan.cta}
                </Link>
                <Link href={plan.href} className="hidden md:block">
                  <Button
                    variant={plan.highlighted ? "primary" : "outline-fill"}
                    size="lg"
                    fullWidth
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
