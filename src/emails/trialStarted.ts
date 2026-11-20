import "server-only";

import {
  TRIAL_STARTED_HTML,
  TRIAL_STARTED_HTML_SUBJECT,
} from "./templates/trialStarted.html";
import {
  fill,
  formatDate,
  formatMoney,
  resolveLinks,
  textFooter,
  type EmailLinks,
  type Money,
  type RenderedEmail,
} from "./render";

/**
 * "Your BarcodesQR 7-Day Trial Is Active – Payment Confirmation" — the
 * receipt for the $1.00 trial charge (JB, 2026-11-20, Monday 5740495302).
 *
 * Ported from `html_files/mailers/trial-v2/index.html`. Sent once per account,
 * when the trial charge succeeds; see `docs/EMAILS.md` for where that call
 * belongs and `checkout()` in `src/app/actions/paywall.ts` for where it is
 * made until a payment processor exists.
 */
export type TrialStartedData = EmailLinks & {
  /** "7-Day Trial" in the mockup. */
  planName?: string;
  /**
   * Taken today, tax included, in the billing currency — $1.00 in the mockup.
   * The designer's note: if tax applies, the template needs "Tax" and "Total
   * charged" rows (and loses the generic tax note). No tax is charged yet.
   */
  amountCharged: Money;
  /** When the trial charge succeeded. */
  trialStartsAt: Date;
  /** The first full charge's date — "First renewal" and the notice below. */
  firstRenewalAt: Date;
  /** The first full charge — "$34.95 / month". */
  renewalAmount: Money;
  /** "month" in the mockup ("$34.95 / month"). */
  renewalInterval?: "month" | "year";
  /**
   * The processor's VERIFIED statement descriptor. A mismatch between this
   * and the card statement is a chargeback — see docs/EMAILS.md.
   */
  statementDescriptor?: string;
};

const DAY_MS = 86_400_000;

/** "Aug 18, 2026" with the designer's non-breaking spaces, for the notice. */
const nbsp = (s: string) => s.replace(/ /g, "&nbsp;");

export function renderTrialStartedEmail(data: TrialStartedData): RenderedEmail {
  const links = resolveLinks(data);

  const planName = data.planName ?? "7-Day Trial";
  // TODO(primer): replace with the descriptor verified in the processor
  // dashboard once Primer (Stripe underneath) is live — see docs/EMAILS.md.
  const statementDescriptor = data.statementDescriptor ?? "BARCODESQR.COM";
  const interval = data.renewalInterval ?? "month";

  const amountCharged = formatMoney(data.amountCharged); // "$1.00 USD"
  const amountChargedShort = formatMoney(data.amountCharged, { withCode: false });
  const price = formatMoney(data.renewalAmount, { withCode: false });
  const renewalPrice = `${price} / ${interval}`; // "$34.95 / month"
  const renewalPriceCompact = `${price}/${interval}`; // preheader: "$34.95/month"

  const days = Math.max(
    0,
    Math.round((data.firstRenewalAt.getTime() - data.trialStartsAt.getTime()) / DAY_MS),
  );
  const unit = days === 1 ? "day" : "days";
  const trialPeriod = `${days} ${unit}`; // "7 days"
  const firstRenewalOn = formatDate(data.firstRenewalAt);

  const html = fill(TRIAL_STARTED_HTML, {
    ...links,
    planName,
    amountCharged,
    amountChargedShort,
    trialPeriod,
    renewalPrice,
    renewalPriceCompact,
    firstRenewalOn,
    firstRenewalIn: `(in&nbsp;${days}&nbsp;${unit})`,
    firstRenewalOnNbsp: nbsp(firstRenewalOn),
    statementDescriptor,
  });

  const text = [
    "Your BarcodesQR 7-Day Trial Is Active",
    "",
    "Thanks for joining BarcodesQR! Your payment was received and your trial " +
      "has started. You now have full access to create, customize and manage " +
      "your QR codes.",
    "",
    "What's included in your trial",
    "- Create unlimited dynamic QR codes",
    "- Access all 23 QR code types",
    "- Customize colors, frames and styles",
    "- Track scans with built-in analytics",
    "- Edit dynamic destinations anytime without reprinting",
    "- Download your QR codes in multiple formats",
    "",
    `Go to My Dashboard: ${links.dashboardUrl}`,
    "",
    "Your transaction receipt",
    `Plan: ${planName}`,
    `Charged today: ${amountCharged}`,
    `Trial period: ${trialPeriod}`,
    `Then renews at: ${renewalPrice}`,
    `First renewal: ${firstRenewalOn} (in ${trialPeriod})`,
    `Billing descriptor: ${statementDescriptor}`,
    "Applicable taxes, if any, are shown at checkout.",
    "",
    "You can cancel anytime before renewal from your dashboard. Unless " +
      `canceled, your trial converts to the ${renewalPrice} subscription on ` +
      `${firstRenewalOn}.`,
    "",
    "Need help? Visit our Help Center or contact support@barcodesqr.com.",
    "",
    `Manage Subscription: ${links.manageUrl}`,
    ...textFooter(links, [
      "This is a transactional email related to your BarcodesQR account.",
    ]),
  ].join("\n");

  return { subject: TRIAL_STARTED_HTML_SUBJECT, html, text };
}
