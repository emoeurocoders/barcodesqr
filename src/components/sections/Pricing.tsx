import Link from "next/link";

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
      "Team sharing",
      "Advanced exports",
      "Best value",
    ],
  },
];

/** Their arrow, on every desktop plan button. */
function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}

/** The three-up strip under the desktop cards. Path data is theirs. */
const notes = [
  {
    title: "Start for $1",
    body: "7 days of full access before monthly billing.",
    icon: (
      <>
        <path d="M11.5 21.0833C11.5 21.0833 19.1667 17.25 19.1667 11.5V4.79167L11.5 1.91667L3.83333 4.79167V11.5C3.83333 17.25 11.5 21.0833 11.5 21.0833Z" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.625 11.5L10.5417 13.4167L14.375 9.58333" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Upgrade anytime",
    body: "Change plans or cancel at any time.",
    icon: (
      <path d="M12.4583 1.91667L3.83333 12.4583H10.5417L9.58333 21.0833L19.1667 9.58333H12.4583V1.91667Z" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Friendly support",
    body: "Get help whenever you need it.",
    icon: (
      <>
        <path d="M2.875 13.4167V10.5417C2.875 8.25417 3.7837 6.06037 5.4012 4.44287C7.01871 2.82537 9.21251 1.91667 11.5 1.91667C13.7875 1.91667 15.9813 2.82537 17.5988 4.44287C19.2163 6.06037 20.125 8.25417 20.125 10.5417V13.4167" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.75 14.375C5.75 13.3165 4.89188 12.4583 3.83333 12.4583C2.77479 12.4583 1.91667 13.3165 1.91667 14.375V17.25C1.91667 18.3085 2.77479 19.1667 3.83333 19.1667C4.89188 19.1667 5.75 18.3085 5.75 17.25V14.375Z" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.0833 14.375C21.0833 13.3165 20.2252 12.4583 19.1667 12.4583C18.1081 12.4583 17.25 13.3165 17.25 14.375V17.25C17.25 18.3085 18.1081 19.1667 19.1667 19.1667C20.2252 19.1667 21.0833 18.3085 21.0833 17.25V14.375Z" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.1667 19.1667C18.2083 21.0833 15.3333 21.0833 12.4583 21.0833" stroke="#2563EB" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

/**
 * main_mobile.html's #mainPlans, node for node. Each card is their named-area
 * grid (see `plan-grid`): name/price/badge/terms left, "What's included" and
 * its list right, the button spanning both.
 *
 * Sized in em against the card's root, as theirs is: 10px, then 2.1vw at 480
 * and below. Their `rem` gaps (1.8rem between cards, 3rem above the list and
 * above a tagged card) are against a root that is viewport/64 below 640px,
 * hence the `min(px, vw)` pairs.
 */
function MobilePlans() {
  return (
    <div className="container-home leading-[normal] text-black md:hidden">
      <div className="text-center">
        <h4 className="mx-auto max-w-[11.5em] text-[38px] font-extrabold leading-[1.08em] tracking-[-0.035em] to-480:text-[7.9vw]">
          Start with a $1 trial or save with a longer plan
        </h4>
        <p className="mx-auto mt-[0.85em] max-w-[22em] p-0 text-[20px] leading-[1.55em] text-muted to-480:text-[4.1vw]">
          Every plan includes unlimited dynamic codes, analytics and
          customization.
        </p>
      </div>
      <div>
        <div className="mt-[min(30px,4.6875vw)] flex flex-col items-stretch">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`plan-grid relative grid flex-none grow items-start gap-x-[1.48em] gap-y-0 rounded-[2em] bg-white p-[2.7em] text-[10px] shadow-plans-card to-480:text-[2.1vw] ${
                i === 0
                  ? ""
                  : plan.badge
                    ? "mt-[min(30px,4.6875vw)]"
                    : "mt-[min(18px,2.8125vw)]"
              } ${
                plan.highlighted
                  ? "border-2 border-brand"
                  : "border border-help-card-line"
              }`}
            >
              {plan.badge && (
                <span className="absolute left-1/2 top-0 block w-max -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand px-[1.3em] py-[0.42em] text-[1.35em] font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              <h5 className="text-[2.34em] font-extrabold [grid-area:ttl]">
                {plan.name}
              </h5>
              <div className="mt-[0.25em] flex items-baseline [grid-area:prc]">
                <span className="text-[2.2em] font-bold">$</span>
                <span className="text-[4.3em] font-extrabold leading-[1em] tracking-[-0.02em]">
                  {plan.price}
                </span>
                <span className="ml-[0.35em] text-[1.23em] text-muted">
                  {plan.period}
                </span>
              </div>
              {plan.save && (
                <span className="mt-[0.7em] self-start rounded-full bg-plans-save px-[0.75em] py-[0.33em] text-[1.48em] font-semibold text-brand-dark [grid-area:bdg]">
                  {plan.save}
                </span>
              )}
              <p className="mt-[1em] p-0 text-[1.35em] leading-[1.4em] text-muted [grid-area:ln3]">
                {plan.terms}
              </p>
              <p className="pt-[0.15em] text-[1.6em] font-extrabold text-ink [grid-area:inc]">
                What&apos;s included:
              </p>
              <ul className="mt-[0.9em] [grid-area:lst]">
                {plan.features.map((feature, j) => (
                  <li
                    key={feature}
                    className={`flex items-start text-[1.48em] text-prose ${
                      j > 0 ? "mt-[0.6em]" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/pricing/plans-check.svg"
                      alt="Check"
                      className="mr-[0.55em] mt-[0.18em] w-[1.1em]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-[2em] [grid-area:btn]">
                {/*
                  Their genBtn9, under `#mainPlans .btnWrp .btn`'s 1.05em
                  vertical padding. 16px, then 4.1vw below 390 — `min()` is the
                  same switch without a breakpoint. The outline is a ring rather
                  than a border because theirs is drawn on the ::after behind
                  the label, so it does not add to the button's height.
                */}
                <Link
                  href={plan.href}
                  className={`flex w-full items-center justify-center gap-[0.7em] rounded-[0.7em] px-[1.1em] py-[1.05em] text-center text-[min(16px,4.1vw)] font-semibold leading-[1.3em] transition-colors ${
                    plan.highlighted
                      ? "bg-primary text-on-accent hover:bg-primary-press"
                      : "bg-white text-black ring-1 ring-inset ring-primary hover:bg-primary hover:text-on-accent"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * mainB.html's #mainPricing: each card is a row — name, price and terms on
 * the left, "What's included" on the right of a rule — with the button
 * spanning the foot. Sized in em against the card's 10px root, as theirs is,
 * so their 1220px rule (card root 0.81vw) scales the whole card at once.
 */
function DesktopPlans() {
  return (
    <div className="container-frm hidden py-[76px] text-[10px] leading-[normal] text-black md:block">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-pricing-badge px-[1.4em] py-[0.6em] text-[12px] font-extrabold tracking-[0.06em] text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-[0.55em] h-[0.9em] w-[0.9em] flex-none"
            aria-hidden="true"
          >
            <path d="M12 0Q13.6 10.4 24 12Q13.6 13.6 12 24Q10.4 13.6 0 12Q10.4 10.4 12 0Z"></path>
          </svg>
          SIMPLE PRICING
        </span>
        {/* Their <h4>, kept — the page's heading levels are the designer's. */}
        <h4 className="mt-[0.6em] text-[43px] font-extrabold tracking-[-0.045em] text-pricing-ink to-992:mx-auto to-992:max-w-[14em] to-768:text-[38px]">
          Start with a $1 trial or save with a longer plan
        </h4>
        <p className="mt-[0.85em] p-0 text-[17px] text-pricing-sub">
          Every plan includes unlimited dynamic codes, analytics and
          customization.
        </p>
      </div>

      <div>
        <div className="mt-[3.9em] flex items-stretch to-992:flex-col">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              /*
                Their 1220px rule shrinks the card root to 0.81vw, and their
                992px rule puts it back to 10px when the cards stack. As a
                range it cannot lose an ordering race with `to-992:`.
              */
              className={`relative flex min-w-0 flex-[1_0_0] flex-col rounded-[1.7em] bg-white px-[2.4em] pb-[2.3em] pt-[2.7em] text-[10px] shadow-pricing-card [@media(min-width:993px)_and_(max-width:1220px)]:text-[0.81vw] to-992:flex-none ${
                i > 0 ? "ml-[1.7em] to-992:ml-0 to-992:mt-[3em]" : ""
              } ${
                plan.highlighted
                  ? "border-2 border-pricing-act"
                  : "border border-pricing-card-line"
              }`}
            >
              {plan.badge && (
                <span className="absolute left-1/2 top-[-1.3em] -translate-x-1/2 whitespace-nowrap rounded-full bg-pricing-tag px-[1.4em] py-[0.5em] text-[1.2em] font-bold text-white">
                  {plan.badge}
                </span>
              )}
              <div className="flex flex-[1_0_auto] items-stretch">
                <div className="flex-[0_0_44%] pr-[1.6em]">
                  <h5 className="text-[2em] font-bold tracking-[-0.03em] text-pricing-ink">
                    {plan.name}
                  </h5>
                  <div className="mb-[4em] mt-[0.5em] flex items-baseline">
                    <span className="text-[2.2em] font-extrabold text-pricing-ink">
                      $
                    </span>
                    <span className="text-[3.5em] font-extrabold leading-[1em] tracking-[-0.05em] text-pricing-ink">
                      {plan.price}
                    </span>
                    <span className="ml-[0.4em] whitespace-nowrap text-[1.2em] font-medium text-pricing-per">
                      {plan.period}
                    </span>
                  </div>
                  {plan.save && (
                    <span className="mt-[1.1em] inline-block self-start rounded-full bg-pricing-save px-[0.85em] py-[0.28em] text-[1.2em] font-bold text-pricing-save-ink">
                      {plan.save}
                    </span>
                  )}
                  <p className="mt-[1.05em] p-0 text-[1.25em] tracking-[-0.02em] text-pricing-terms">
                    {plan.terms}
                  </p>
                </div>
                <div className="min-w-0 flex-auto border-l border-pricing-rule pl-[1.7em]">
                  <p className="p-0 text-[1.5em] font-semibold text-pricing-ink">
                    What&apos;s included:
                  </p>
                  <ul className="mt-[0.9em]">
                    {plan.features.map((feature, j) => (
                      <li
                        key={feature}
                        className={`flex items-start text-[1.4em] leading-[1.35em] text-prose ${
                          j > 0 ? "mt-[0.6em]" : ""
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/pricing/check.svg"
                          alt="Check"
                          className="mr-[0.55em] mt-[0.15em] w-[1em] flex-none"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-[2.4em]">
                {/*
                  genBtn4 under their `#mainPricing .btnWrp .btn`: 17px/600,
                  1.15em tall padding. The outline plans letter in blue here,
                  unlike the mobile card's black.
                */}
                <Link
                  href={plan.href}
                  className={`flex w-full items-center justify-center gap-[0.5em] text-center rounded-[0.7em] px-[2.2em] py-[1.15em] text-[1.7em] font-semibold leading-[1em] transition-colors ${
                    plan.highlighted
                      ? "bg-primary text-on-accent hover:bg-primary-press"
                      : "bg-white text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-on-accent"
                  }`}
                >
                  {plan.cta}
                  <ArrowGlyph className="h-[1.15em] w-[1.15em] flex-none" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-[3.7em] grid grid-cols-3 gap-[30px] to-992:grid-cols-1 to-992:gap-[18px]">
          {notes.map((note) => (
            <li key={note.title} className="flex items-center">
              <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-pricing-note-tile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23 23"
                  fill="none"
                  className="h-[23px] w-[23px]"
                  aria-hidden="true"
                >
                  {note.icon}
                </svg>
              </span>
              <div className="ml-[12px]">
                <h5 className="text-[16px] font-semibold text-pricing-note-ink">
                  {note.title}
                </h5>
                <p className="mt-[0.15em] p-0 text-[14px] leading-[1.45em] text-pricing-sub">
                  {note.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    /*
      main_mobile.html's #mainPlans keeps the base rule's #f8f9fb and hairline
      top and bottom; mainB.html's #mainPricing replaces both with a plain
      #fbfdff.
    */
    <section
      id="pricing"
      className="scroll-mt-[84px] border-y border-hero-line bg-plans-bg py-[48px] to-480:py-[10vw] md:scroll-mt-20 md:border-y-0 md:bg-pricing-bg md:py-0"
    >
      <MobilePlans />
      <DesktopPlans />
    </section>
  );
}
