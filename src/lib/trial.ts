import "server-only";

import { sendTrialStartedEmail } from "@/lib/mail";

/**
 * The trial's terms, as the paywall states them ("7-day trial for $1.00.
 * Renews at $34.95/month until canceled.") and the trial email repeats them.
 * Amounts in cents.
 *
 * TODO(primer): once payments exist these come from the processor — the
 * amount actually charged (tax included), the subscription's real first
 * renewal date and price — not from constants. See docs/EMAILS.md.
 */
export const TRIAL = {
  days: 7,
  charge: { amount: 100, currency: "USD" },
  renewal: { amount: 3495, currency: "USD" },
  interval: "month",
} as const;

/**
 * Send "Your BarcodesQR 7-Day Trial Is Active – Payment Confirmation" (JB,
 * 2026-11-20). Never throws: the account exists and the trial is granted
 * whether or not Resend answers, so a failure is logged, not surfaced.
 *
 * TODO(primer): THIS IS CALLED FROM CHECKOUT ONLY BECAUSE NO PAYMENT
 * PROCESSOR EXISTS YET, so testers can see the email in the real flow.
 * Primer (Stripe underneath) is to be integrated later. When it is:
 *   1. Call this from Primer's payment-succeeded webhook for the $1.00 trial
 *      charge instead — never from checkout. Only the processor knows money
 *      moved; a declined card must not get a "payment confirmed" email.
 *   2. Make it once-only: record the processor's payment/event id in a table
 *      and skip if seen. Webhooks are retried, and this email must go out
 *      exactly once per trial (JB: "even if Stripe retries a webhook").
 *   3. Pass the real charged amount, first renewal date and the VERIFIED
 *      statement descriptor from the processor.
 *   4. Delete the calls in actions/paywall.ts and auth/paywall-complete.
 */
export async function sendTrialEmail(to: string, startedAt = new Date()) {
  try {
    await sendTrialStartedEmail(to, {
      amountCharged: TRIAL.charge,
      trialStartsAt: startedAt,
      firstRenewalAt: new Date(startedAt.getTime() + TRIAL.days * 86_400_000),
      renewalAmount: TRIAL.renewal,
      renewalInterval: TRIAL.interval,
    });
  } catch (e) {
    console.error("[mail] trial email failed", { error: String(e) });
  }
}
