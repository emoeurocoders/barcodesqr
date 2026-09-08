import "server-only";

import {
  PAYMENT_RECEIPT_HTML,
  PAYMENT_RECEIPT_HTML_SUBJECT,
} from "./templates/paymentReceipt.html";
import {
  billingFrequency,
  fill,
  formatDate,
  formatDateRange,
  formatMoney,
  resolveLinks,
  textFooter,
  type EmailLinks,
  type Money,
  type RenderedEmail,
} from "./render";

/**
 * "Payment Received" — the receipt for a full subscription charge.
 *
 * Ported from `html_files/mailers/receipt/index.html`. Sent on every
 * successful renewal, including the first one after the trial converts; see
 * `docs/EMAILS.md`.
 */
export type PaymentReceiptData = EmailLinks & {
  /** "BarcodesQR Full Access" in the mockup. */
  planName?: string;
  /** What was actually taken — $39.95 in the mockup. */
  amountPaid: Money;
  paymentDate: Date;
  /** The window this payment covers: "Sep 14 – Oct 11, 2026". */
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  /** The day AFTER the period ends, in the mockup — Oct 11 covered, Oct 12 charged. */
  nextRenewalDate: Date;
  /** Usually the same as `amountPaid`; separate so a price change can be shown. */
  nextRenewalAmount: Money;
  /** Weeks between charges. 4 in the mockup. */
  billingIntervalWeeks?: number;
  statementDescriptor?: string;
};

export function renderPaymentReceiptEmail(
  data: PaymentReceiptData,
): RenderedEmail {
  const links = resolveLinks(data);
  const frequency = billingFrequency(data.billingIntervalWeeks ?? 4);

  const planName = data.planName ?? "BarcodesQR Full Access";
  const statementDescriptor = data.statementDescriptor ?? "BARCODESQR.COM";
  const amountPaid = formatMoney(data.amountPaid);
  const paymentDate = formatDate(data.paymentDate);
  const nextRenewalDate = formatDate(data.nextRenewalDate);
  const nextRenewalAmount = formatMoney(data.nextRenewalAmount);
  // The notice under the table drops the ISO code: "at $39.95 unless canceled".
  const renewalAmount = formatMoney(data.nextRenewalAmount, { withCode: false });

  const html = fill(PAYMENT_RECEIPT_HTML, {
    ...links,
    planName,
    amountPaid,
    paymentDate,
    // Raw token: keeps the designer's `&ndash;` rather than a plain hyphen.
    billingPeriod: formatDateRange(
      data.billingPeriodStart,
      data.billingPeriodEnd,
      "&ndash;",
    ),
    nextRenewalDate,
    nextRenewalAmount,
    billingFrequencyLower: frequency.lowerHtml,
    renewalAmount,
    statementDescriptor,
  });

  const text = [
    "Payment Received",
    "",
    "Thanks. Your BarcodesQR subscription is active and your QR codes will",
    "continue working without interruption.",
    "",
    `Manage my QR codes: ${links.dashboardUrl}`,
    "",
    "Transaction Details — Active subscription",
    `Amount paid: ${amountPaid}`,
    `Plan: ${planName}`,
    `Payment date: ${paymentDate}`,
    `Billing period: ${formatDateRange(
      data.billingPeriodStart,
      data.billingPeriodEnd,
      "–",
    )}`,
    `Next renewal: ${nextRenewalDate}`,
    `Next renewal amount: ${nextRenewalAmount}`,
    `Statement descriptor: ${statementDescriptor}`,
    "",
    `Your subscription renews automatically ${frequency.lowerText} at ` +
      `${renewalAmount} unless canceled.`,
    "",
    "You can manage or cancel your subscription anytime from your account.",
    `Manage or cancel your subscription: ${links.manageUrl}`,
    ...textFooter(links, [
      "You're receiving this email because you have an active BarcodesQR",
      "subscription.",
    ]),
  ].join("\n");

  return { subject: PAYMENT_RECEIPT_HTML_SUBJECT, html, text };
}
