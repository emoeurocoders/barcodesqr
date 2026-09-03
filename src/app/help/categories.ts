/**
 * The six Help Center categories, lifted from the designer's
 * help_category-*.html. Strings are pasted, not retyped.
 *
 * `href: null` marks a link the mockup writes as `href="#"` — the renderer
 * keeps the anchor so the markup matches, but it goes nowhere yet.
 *
 * TWO THINGS THE DESIGNER'S FILES DO THAT LOOK LIKE TEMPLATE ARTEFACTS, both
 * reproduced and both raised in the handover rather than fixed here:
 *
 *  1. Every category reuses the SAME icon sequence for its article rows
 *     (qr-code, circle-question, copy-minus, pencil, download), so "How to log
 *     in to your account" is marked with a QR-code glyph.
 *  2. Creating & Managing's "How to archive or delete a QR code" still points
 *     at the retired help_article.html, whose content is "How to download and
 *     test your QR code". A stale link to a mismatched page, so it is left
 *     inert rather than opening an article about something else.
 */

import type { IconKey } from "./content";

export type CategoryArticle = {
  title: string;
  desc: string;
  icon: IconKey;
  href: string | null;
  /**
   * The glyph in the trailing slot of an "Explore more help topics" card,
   * where every card uses an arrow — except the Troubleshooting one on the
   * Analytics & Scans and Account & Login pages, which repeats the wrench from
   * its own leading slot. That reads as a copy-paste slip in the designer's
   * files; it is reproduced rather than corrected, and raised in the handover.
   */
  trailing?: IconKey;
};

export type Category = {
  slug: string;
  tag: string;
  title: string;
  intro: string;
  count: string;
  articles: CategoryArticle[];
  explore: CategoryArticle[];
};

export const categories: Category[] = [
  {
    slug: "getting-started",
    tag: "Getting Started",
    title: "Getting Started",
    intro:
      "Everything you need to create, customize, and download your first QR code.",
    count: "5 articles",
    articles: [
      {
        title: "How to create your first QR code",
        desc: "Learn how to create a QR code in just a few simple steps.",
        icon: "qr-code",
        href: "/help/getting-started/create-your-first-qr-code",
      },
      {
        title: "Which QR code type should I choose?",
        desc: "Compare QR code types and find the best one for your needs.",
        icon: "circle-question",
        href: null,
      },
      {
        title: "Static vs. dynamic QR codes",
        desc: "Understand the key differences and when to use each type.",
        icon: "copy-minus",
        href: null,
      },
      {
        title: "How to customize your QR code",
        desc: "Add colors, logos, frames, and more to match your brand.",
        icon: "pencil",
        href: null,
      },
      {
        title: "How to download and test your QR code",
        desc: "Download your QR code and test it to make sure it works perfectly.",
        icon: "download",
        href: "/help/getting-started/download-and-test",
      },
    ],
    explore: [
      {
        title: "Creating & Managing QR Codes",
        desc: "Create, edit, organize, and manage QR codes from your account.",
        icon: "qr-code",
        href: "/help/creating-managing",
      },
      {
        title: "Analytics & Scans",
        desc: "Understand how your QR codes are scanned and how to read your statistics.",
        icon: "chart",
        href: "/help/analytics-scans",
      },
      {
        title: "Account & Login",
        desc: "Get help accessing and managing your BarcodesQR account.",
        icon: "user",
        href: "/help/account-login",
      },
    ],
  },
  {
    slug: "creating-managing",
    tag: "CREATING & MANAGING QR CODES",
    title: "Creating & Managing QR Codes",
    intro:
      "Everything you need to edit, organize, and manage your saved QR codes.",
    count: "5 articles",
    articles: [
      {
        title: "How to edit a saved QR code",
        desc: "Update the design, settings, and other details of an existing QR code.",
        icon: "qr-code",
        href: null,
      },
      {
        title: "How to update a dynamic QR code",
        desc: "Change where your QR code points without creating or printing a new code.",
        icon: "circle-question",
        href: null,
      },
      {
        title: "How to rename and organize your QR codes",
        desc: "Keep your saved QR codes easy to identify and manage.",
        icon: "copy-minus",
        href: null,
      },
      {
        title: "How to duplicate a QR code",
        desc: "Create a copy of an existing QR code to quickly reuse its design and settings.",
        icon: "pencil",
        href: null,
      },
      {
        title: "How to archive or delete a QR code",
        desc: "Remove QR codes you no longer need and keep your account organized.",
        icon: "download",
        href: null,
      },
    ],
    explore: [
      {
        title: "Plans & Billing",
        desc: "Learn about plans, subscriptions, payments, and billing.",
        icon: "wallet",
        href: "/help/plans-billing",
      },
      {
        title: "Analytics & Scans",
        desc: "Understand how your QR codes are scanned and how to read your statistics.",
        icon: "chart",
        href: "/help/analytics-scans",
      },
      {
        title: "Account & Login",
        desc: "Get help accessing and managing your BarcodesQR account.",
        icon: "user",
        href: "/help/account-login",
      },
    ],
  },
  {
    slug: "analytics-scans",
    tag: "Analytics & Scans",
    title: "Analytics & Scans",
    intro:
      "Understand how your QR codes are being scanned and track their performance over time.",
    count: "4 articles",
    articles: [
      {
        title: "How to view QR code scan analytics",
        desc: "See scan activity and performance for any of your saved QR codes.",
        icon: "qr-code",
        href: null,
      },
      {
        title: "Understanding your QR code statistics",
        desc: "Learn what total scans, unique scans, locations, devices, and other metrics mean.",
        icon: "circle-question",
        href: null,
      },
      {
        title: "How to track scans over time",
        desc: "View scan trends by day, week, or date range to understand QR code activity.",
        icon: "copy-minus",
        href: null,
      },
      {
        title: "Why QR code scan numbers may differ",
        desc: "Understand duplicate scans, reporting delays, and other reasons scan totals can vary.",
        icon: "pencil",
        href: null,
      },
    ],
    explore: [
      {
        title: "Creating & Managing QR Codes",
        desc: "Create, edit, organize, and manage QR codes from your account.",
        icon: "qr-code",
        href: "/help/creating-managing",
      },
      {
        title: "Troubleshooting",
        desc: "Find quick solutions to common QR code and account issues.",
        icon: "wrench",
        href: "/help/troubleshooting",
        trailing: "wrench",
      },
      {
        title: "Account & Login",
        desc: "Get help accessing and managing your BarcodesQR account.",
        icon: "user",
        href: "/help/account-login",
      },
    ],
  },
  {
    slug: "account-login",
    tag: "Account & Login",
    title: "Account & Login",
    intro:
      "Learn how to access your account, manage your login details, and get back in if you’re having trouble.",
    count: "4 articles",
    articles: [
      {
        title: "How to log in to your BarcodesQR account",
        desc: "Access your saved QR codes, analytics, billing, and account settings.",
        icon: "qr-code",
        href: "/help/account-login/logging-in",
      },
      {
        title: "How your BarcodesQR account is created",
        desc: "Learn how your account is automatically created using the email address from checkout.",
        icon: "circle-question",
        href: null,
      },
      {
        title: "What to do if you can’t access your account",
        desc: "Troubleshoot login issues, missing emails, and problems accessing your account.",
        icon: "copy-minus",
        href: null,
      },
      {
        title: "How to update your account email",
        desc: "Learn how to change the email address associated with your BarcodesQR account.",
        icon: "pencil",
        href: null,
      },
    ],
    explore: [
      {
        title: "Creating & Managing QR Codes",
        desc: "Create, edit, organize, and manage QR codes from your account.",
        icon: "qr-code",
        href: "/help/creating-managing",
      },
      {
        title: "Analytics & Scans",
        desc: "Understand how your QR codes are scanned and how to read your statistics.",
        icon: "chart",
        href: "/help/analytics-scans",
      },
      {
        title: "Troubleshooting",
        desc: "Find quick solutions to common QR code and account issues.",
        icon: "wrench",
        href: "/help/troubleshooting",
        trailing: "wrench",
      },
    ],
  },
  {
    slug: "plans-billing",
    tag: "Plans & Billing",
    title: "Plans & Billing",
    intro:
      "Learn about your subscription, trial, payments, renewals, and billing options.",
    count: "5 articles",
    articles: [
      {
        title: "Understanding BarcodesQR plans and pricing",
        desc: "Learn what’s included with each subscription option and how billing works.",
        icon: "qr-code",
        href: null,
      },
      {
        title: "How the $1 trial works",
        desc: "Understand your 7-day trial, what’s included, and what happens when the trial ends.",
        icon: "circle-question",
        href: null,
      },
      {
        title: "How subscription renewals work",
        desc: "Learn when your subscription renews and how recurring payments are processed.",
        icon: "copy-minus",
        href: null,
      },
      {
        title: "How to update your payment method",
        desc: "Change the payment method used for your BarcodesQR subscription.",
        icon: "pencil",
        href: null,
      },
      {
        title: "How to cancel your subscription",
        desc: "Learn how to cancel your subscription and what happens to your account afterward.",
        icon: "download",
        href: "/help/plans-billing/cancel-subscription",
      },
    ],
    explore: [
      {
        title: "Creating & Managing QR Codes",
        desc: "Create, edit, organize, and manage QR codes from your account.",
        icon: "qr-code",
        href: "/help/creating-managing",
      },
      {
        title: "Analytics & Scans",
        desc: "Understand how your QR codes are scanned and how to read your statistics.",
        icon: "chart",
        href: "/help/analytics-scans",
      },
      {
        title: "Account & Login",
        desc: "Get help accessing and managing your BarcodesQR account.",
        icon: "user",
        href: "/help/account-login",
      },
    ],
  },
  {
    slug: "troubleshooting",
    tag: "Troubleshooting",
    title: "Troubleshooting",
    intro:
      "Find quick solutions to common QR code, download, and account issues.",
    count: "4 articles",
    articles: [
      {
        title: "Why isn’t my QR code scanning?",
        desc: "Check the most common reasons a QR code may be difficult to scan and how to fix them.",
        icon: "qr-code",
        href: "/help/troubleshooting/not-scanning",
      },
      {
        title: "Why isn’t my QR code opening the correct destination?",
        desc: "Troubleshoot incorrect links, outdated destinations, and other redirect issues.",
        icon: "circle-question",
        href: null,
      },
      {
        title: "What to do if you can’t download your QR code",
        desc: "Fix common problems when downloading or saving your QR code.",
        icon: "copy-minus",
        href: null,
      },
      {
        title: "Why aren’t my QR code changes showing?",
        desc: "Learn what to check if recent edits or updates don’t appear as expected.",
        icon: "pencil",
        href: null,
      },
    ],
    explore: [
      {
        title: "Creating & Managing QR Codes",
        desc: "Create, edit, organize, and manage QR codes from your account.",
        icon: "qr-code",
        href: "/help/creating-managing",
      },
      {
        title: "Analytics & Scans",
        desc: "Understand how your QR codes are scanned and how to read your statistics.",
        icon: "chart",
        href: "/help/analytics-scans",
      },
      {
        title: "Account & Login",
        desc: "Get help accessing and managing your BarcodesQR account.",
        icon: "user",
        href: "/help/account-login",
      },
    ],
  },
];

export const bySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

/** The sidebar lists every category except the one being read. */
export const otherThan = (slug: string) =>
  categories.filter((c) => c.slug !== slug);
