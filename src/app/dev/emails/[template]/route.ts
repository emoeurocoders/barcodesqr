import type { NextRequest } from "next/server";

import { renderPaymentReceiptEmail } from "@/emails/paymentReceipt";
import { renderTrialStartedEmail } from "@/emails/trialStarted";

/**
 * Renders a transactional email in the browser, in development only.
 *
 * This exists for the fidelity check in AGENTS.md. An email cannot be diffed
 * against the mockup while it only exists inside a webhook that does not run
 * yet, so this route is the port's other half:
 *
 *   npm run -s diff:design -- html_files/mailers/trial/index.html \
 *     http://localhost:3000/dev/emails/trial --width 750
 *
 * The sample values below are the mockup's own, exactly — that is what makes
 * the diff mean something. Change them and the comparison stops working.
 *
 * `?format=text` returns the plain-text alternative instead, which is the only
 * way to read it, and it is half of what actually gets delivered.
 */

/** `Intl` and the renderers want Node, not the Edge runtime. */
export const runtime = "nodejs";

/** UTC, to match the renderers' own formatting. */
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

const USD = (amount: number) => ({ amount, currency: "USD" });

const SAMPLES = {
  /** html_files/mailers/trial/index.html */
  trial: (baseUrl: string) =>
    renderTrialStartedEmail({
      baseUrl,
      amountCharged: USD(100), //      "$1.00 USD"
      trialStartsAt: utc("2026-09-07"), // "Sep 7, 2026"
      trialEndsAt: utc("2026-09-14"), //   "Sep 14, 2026"
      nextChargeAmount: USD(3995), //  "$39.95 USD"
    }),

  /** html_files/mailers/receipt/index.html */
  receipt: (baseUrl: string) =>
    renderPaymentReceiptEmail({
      baseUrl,
      amountPaid: USD(3995),
      paymentDate: utc("2026-09-14"),
      billingPeriodStart: utc("2026-09-14"), // "Sep 14 – Oct 11, 2026"
      billingPeriodEnd: utc("2026-10-11"),
      nextRenewalDate: utc("2026-10-12"), //    "Oct 12, 2026"
      nextRenewalAmount: USD(3995),
    }),
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ template: string }> },
) {
  // Not a page that 404s in production — a route that does not exist there.
  // These emails carry billing copy, and nothing outside a dev machine should
  // be able to render one on demand.
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const { template } = await params;
  const sample = SAMPLES[template as keyof typeof SAMPLES];
  if (!sample) {
    return new Response(
      `Unknown template "${template}". Try: ${Object.keys(SAMPLES).join(", ")}`,
      { status: 404 },
    );
  }

  // The images live under this same origin, so the preview resolves them the
  // way a mail client resolves the absolute URLs in a real send.
  const { html, text, subject } = sample(request.nextUrl.origin);

  if (request.nextUrl.searchParams.get("format") === "text") {
    return new Response(`Subject: ${subject}\n\n${text}`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
