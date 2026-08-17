import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Plan = {
  name: string;
  price: string;
  period: string;
  href: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "7-Day Trial",
    price: "1.00",
    period: "/7 days",
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
    price: "29.99",
    period: "/month",
    href: "/checkout?plan=quarterly",
    features: [
      "Everything in trial",
      "Priority support",
      "Bulk creation",
      "Password protection",
    ],
  },
  {
    name: "Annual",
    price: "19.99",
    period: "/month",
    href: "/checkout?plan=annual",
    badge: "Most popular",
    features: [
      "Everything in quarterly",
      "Best value, billed yearly",
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
          Start your trial today, upgrade when you need
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Every plan includes unlimited dynamic codes, analytics and
          customization.
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
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
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>

              <div className="mt-3 flex items-baseline gap-0.5">
                <span className="text-lg font-semibold text-muted">$</span>
                <span className="text-4xl font-bold text-ink">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-muted">{plan.period}</span>
              </div>

              <p className="mt-5 text-sm font-medium text-ink">
                What&apos;s included:
              </p>
              <ul className="mt-3 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-body"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link className="mt-6" href={plan.href}>
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
