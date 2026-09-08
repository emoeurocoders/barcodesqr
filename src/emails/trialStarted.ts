import "server-only";

import {
  TRIAL_STARTED_HTML,
  TRIAL_STARTED_HTML_SUBJECT,
} from "./templates/trialStarted.html";
import {
  billingFrequency,
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
 * "Your 7-Day Trial Is Active" — the receipt for the $1 trial charge, and the
 * confirmation that the account now exists.
 *
 * Ported from `html_files/mailers/trial/index.html`. Sent once, when the trial
 * charge succeeds; see `docs/EMAILS.md` for where that call belongs.
 */
export type TrialStartedData = EmailLinks & {
  /** "7-Day Full Access Trial" in the mockup. */
  planName?: string;
  /** Taken today — $1.00 in the mockup. */
  amountCharged: Money;
  trialStartsAt: Date;
  /** Also the date named in the renewal notice, so it is passed once. */
  trialEndsAt: Date;
  /** What the first full charge will be once the trial lapses. */
  nextChargeAmount: Money;
  /** Weeks between charges. 4 in the mockup — "Every 4 weeks". */
  billingIntervalWeeks?: number;
  /** What the customer will see on their card statement. */
  statementDescriptor?: string;
};

export function renderTrialStartedEmail(data: TrialStartedData): RenderedEmail {
  const links = resolveLinks(data);
  const frequency = billingFrequency(data.billingIntervalWeeks ?? 4);

  const planName = data.planName ?? "7-Day Full Access Trial";
  const statementDescriptor = data.statementDescriptor ?? "BARCODESQR.COM";
  const amountCharged = formatMoney(data.amountCharged);
  const nextChargeAmount = formatMoney(data.nextChargeAmount);
  const trialStartedOn = formatDate(data.trialStartsAt);
  const trialEndsOn = formatDate(data.trialEndsAt);
  // The notice under the table drops the ISO code: "$39.95 every 4 weeks".
  const renewalAmount = formatMoney(data.nextChargeAmount, { withCode: false });

  const html = fill(TRIAL_STARTED_HTML, {
    ...links,
    planName,
    amountCharged,
    trialStartedOn,
    trialEndsOn,
    nextChargeAmount,
    billingFrequency: frequency.title,
    billingFrequencyLower: frequency.lowerHtml,
    renewalAmount,
    statementDescriptor,
  });

  const text = [
    "Your 7-Day Trial Is Active",
    "",
    "Your QR code is ready and your BarcodesQR account has been created.",
    "",
    `Manage my QR codes: ${links.dashboardUrl}`,
    "",
    "Transaction Details — Trial Active",
    `Plan: ${planName}`,
    `Charged today: ${amountCharged}`,
    `Trial started: ${trialStartedOn}`,
    `Trial ends: ${trialEndsOn}`,
    `Next charge: ${nextChargeAmount}`,
    `Billing frequency: ${frequency.title}`,
    `Statement descriptor: ${statementDescriptor}`,
    "",
    `Unless you cancel before ${trialEndsOn}, your subscription will ` +
      `automatically continue at ${renewalAmount} ${frequency.lowerText}.`,
    "",
    "What's included",
    "- Unlimited QR code creation",
    "- QR customization & download formats",
    "- Unlimited scans",
    "- Scan analytics & reporting",
    "",
    `Manage or cancel your subscription: ${links.manageUrl}`,
    ...textFooter(links, [
      "You're receiving this email because you created a BarcodesQR account",
      "and completed a trial purchase.",
      "Thank you for choosing BarcodesQR!",
    ]),
  ].join("\n");

  return { subject: TRIAL_STARTED_HTML_SUBJECT, html, text };
}
