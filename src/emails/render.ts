import "server-only";

import { env } from "@/lib/env";

/**
 * Shared plumbing for the transactional mailers in this directory.
 *
 * The HTML itself is generated from the designer's files — see
 * `scripts/build-email-templates.mjs`. What lives here is everything the
 * mockup could not carry: how a value becomes a string, and where the
 * placeholder hrefs point.
 *
 * Formatting is deliberately NOT the caller's job. The designer chose
 * "$39.95 USD", "Sep 14, 2026" and "Sep 14 – Oct 11, 2026", and a webhook
 * handler passing its own strings is how those quietly become "39.95 USD" and
 * "2026-09-14". Callers pass minor units and `Date`s; this file owns the
 * shapes.
 */

/** An amount in the currency's MINOR units — 3995 is $39.95, never 39.95. */
export type Money = {
  /** Minor units (cents). Matches what Stripe and friends report. */
  amount: number;
  /** ISO 4217, e.g. "USD". */
  currency: string;
};

/**
 * Where the mockup's `href="#"` placeholders point.
 *
 * Every one is overridable because the real targets are not all decided yet —
 * `manageUrl` in particular becomes a billing-portal session once payments
 * exist. See `docs/EMAILS.md`.
 */
export type EmailLinks = {
  /** Origin the images and routes hang off. Defaults to `APP_URL`. */
  baseUrl?: string;
  /** Both primary "Manage My QR Codes" buttons. */
  dashboardUrl?: string;
  /** Both secondary "Manage or Cancel Subscription" buttons. */
  manageUrl?: string;
};

/** What every renderer in this directory returns, ready for `mail.ts`. */
export type RenderedEmail = { subject: string; html: string; text: string };

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes a value for insertion into the templates.
 *
 * Everything reaching these emails is second-hand — a plan name from a billing
 * dashboard, a statement descriptor someone typed — so nothing is trusted to
 * be inert. Values that must carry markup use the `{{{raw}}}` form instead,
 * and there are only two of those.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/**
 * Substitutes `{{token}}` (escaped) and `{{{token}}}` (raw) in a template.
 *
 * Throws on a token with no value AND on a value with no token. A customer
 * receiving a receipt that reads "Charged today: {{amountCharged}}" is worse
 * than a send that fails and pages someone, and a value silently going
 * nowhere means a designer sync dropped a row nobody noticed.
 */
export function fill(template: string, values: Record<string, string>): string {
  const used = new Set<string>();

  const out = template.replace(
    /\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g,
    (_match, raw: string | undefined, escaped: string | undefined) => {
      const key = (raw ?? escaped) as string;
      const value = values[key];
      if (value === undefined) {
        throw new Error(`Email template: no value for {{${key}}}.`);
      }
      used.add(key);
      return raw ? value : escapeHtml(value);
    },
  );

  const unused = Object.keys(values).filter((k) => !used.has(k));
  if (unused.length) {
    throw new Error(
      `Email template: value(s) with no matching token: ${unused.join(", ")}. ` +
        `The designer's markup probably changed — re-run \`npm run emails:build\` ` +
        `and check html_files/mailers/.`,
    );
  }

  return out;
}

/**
 * "$39.95 USD", or "$39.95" without the code.
 *
 * The designer uses both: the Transaction Details rows carry the ISO code, the
 * renewal notice underneath does not.
 */
export function formatMoney(
  { amount, currency }: Money,
  { withCode = true } = {},
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);

  return withCode ? `${formatted} ${currency.toUpperCase()}` : formatted;
}

/**
 * "Sep 14, 2026".
 *
 * Fixed to UTC rather than the server's zone: the same charge must not render
 * as a different day depending on which region ran the function, and a trial
 * that ends "Sep 14" in the email but Sep 13 in the account is a support
 * ticket. Pick the customer's zone here if that ever becomes known.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * "Sep 14 – Oct 11, 2026" — the year appears once when both ends share it,
 * which is what the mockup shows, and on both when they do not.
 *
 * `dash` is the separator: the HTML template wants the designer's `&ndash;`
 * entity, the plain-text alternative wants the character.
 */
export function formatDateRange(start: Date, end: Date, dash: string): string {
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const from = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" as const }),
    timeZone: "UTC",
  }).format(start);

  return `${from} ${dash} ${formatDate(end)}`;
}

/**
 * "Every 4 weeks" for the details row, "every 4&nbsp;weeks" for the sentence
 * underneath — the designer's non-breaking space keeps the number and its unit
 * on one line, so it survives into the raw token rather than being escaped.
 */
export function billingFrequency(weeks: number) {
  const unit = weeks === 1 ? "week" : "weeks";
  return {
    title: `Every ${weeks} ${unit}`,
    lowerHtml: `every ${weeks}&nbsp;${unit}`,
    lowerText: `every ${weeks} ${unit}`,
  };
}

/**
 * Resolves the link and asset tokens shared by every mailer.
 *
 * Images MUST be absolute — a mail client has no origin to resolve
 * `src="logo.png"` against — so an unset `APP_URL` is a hard failure here
 * rather than an email that arrives with six broken images.
 */
export function resolveLinks(links: EmailLinks = {}) {
  const baseUrl = (links.baseUrl ?? env.APP_URL).replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error(
      "Cannot render an email without APP_URL: the images and links in it must " +
        "be absolute. Set APP_URL in .env.local (see .env.example).",
    );
  }

  return {
    /** `public/emails/` — the designer's PNGs, copied unmodified. */
    assetBase: `${baseUrl}/emails`,
    homeUrl: baseUrl,
    dashboardUrl: links.dashboardUrl ?? `${baseUrl}/dashboard`,
    // The footer's "Cancel Subscription" points at /dashboard too, until a
    // billing portal exists to point at instead.
    manageUrl: links.manageUrl ?? `${baseUrl}/dashboard`,
    helpUrl: `${baseUrl}/help`,
    termsUrl: `${baseUrl}/terms`,
    // Matches the site footer. The route does not exist yet — see LAUNCH.md.
    privacyUrl: `${baseUrl}/legal/privacy`,
  };
}

/** The footer block, identical in both plain-text alternatives. */
export function textFooter(links: ReturnType<typeof resolveLinks>, why: string[]) {
  return [
    "",
    `Help Center: ${links.helpUrl}`,
    `Terms: ${links.termsUrl}`,
    `Privacy: ${links.privacyUrl}`,
    "support@barcodesqr.com",
    "",
    ...why,
  ];
}
