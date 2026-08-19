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
    <section id="pricing" className="scroll-mt-20 bg-bg">
      <div className="container-page py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Start your trial today and upgrade anytime
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Every plan includes unlimited dynamic codes, analytics and
          customization.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl items-start gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-soft ${
                plan.highlighted
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-line"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>

              <div className="mt-3 flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-ink">$</span>
                <span className="text-5xl font-bold tracking-tight text-ink">
                  {plan.price}
                </span>
                <span className="ml-1.5 text-sm text-muted">{plan.period}</span>
              </div>

              {plan.save && (
                <span className="mt-4 inline-flex w-fit rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-dark">
                  {plan.save}
                </span>
              )}

              <p className="mt-4 text-sm text-muted">{plan.terms}</p>

              <hr className="mt-6 border-line" />

              <p className="mt-6 text-sm font-bold text-ink">
                What&apos;s included:
              </p>
              <ul className="mt-4 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-body"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link className="mt-8" href={plan.href}>
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  size="lg"
                  fullWidth
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
