/**
 * Help Center copy, lifted from the designer's help.html.
 *
 * Strings are pasted rather than retyped — including the curly apostrophes in
 * "isn’t" and "Can’t", which are `&rsquo;` in their file. `href: null` marks a
 * link the designer left as `href="#"` and for which no page exists yet; the
 * renderer keeps the anchor so the markup still matches, and the handover
 * lists them.
 */

export type IconKey =
  | "sparkles"
  | "download"
  | "pencil"
  | "circle-question"
  | "circle-user"
  | "credit-card"
  | "rocket"
  | "qr-code"
  | "chart"
  | "user"
  | "wallet"
  | "wrench";

export type HelpLink = {
  label: string;
  icon: IconKey;
  /** Real route, or null while the destination does not exist. */
  href: string | null;
};

export const hero = {
  title: "Help Center",
  intro:
    "Find answers about creating QR codes, managing your account, scan analytics, subscriptions, and more.",
  searchPlaceholder: "Search the Help Center",
} as const;

export const popularHeading = "Popular Articles";

export const popular: HelpLink[] = [
  {
    label: "How to create your first QR code",
    icon: "sparkles",
    href: null,
  },
  {
    // The one article that exists — see /help/getting-started/download-and-test.
    label: "How to download and test your QR code",
    icon: "download",
    href: "/help/getting-started/download-and-test",
  },
  {
    label: "Can I edit a QR code after creating it?",
    icon: "pencil",
    href: null,
  },
  {
    label: "Why isn’t my QR code scanning?",
    icon: "circle-question",
    href: null,
  },
  {
    label: "How do I log in to my BarcodesQR account?",
    icon: "circle-user",
    href: null,
  },
  {
    label: "How do I cancel my subscription?",
    icon: "credit-card",
    href: null,
  },
];

export const topicsHeading = "Browse Help Topics";

export type Topic = {
  title: string;
  desc: string;
  count: string;
  icon: IconKey;
  href: string | null;
};

export const topics: Topic[] = [
  {
    title: "Getting Started",
    desc: "Create, customize, and download your first QR code.",
    count: "5 articles",
    icon: "rocket",
    href: "/help/getting-started",
  },
  {
    title: "Creating & Managing QR Codes",
    desc: "Edit, organize, and manage your saved QR codes.",
    count: "5 articles",
    icon: "qr-code",
    href: null,
  },
  {
    title: "Analytics & Scans",
    desc: "Understand scan activity and performance insights.",
    count: "4 articles",
    icon: "chart",
    href: null,
  },
  {
    title: "Account & Login",
    desc: "Access your account and manage login issues.",
    count: "4 articles",
    icon: "user",
    href: null,
  },
  {
    title: "Plans & Billing",
    desc: "Trials, renewals, cancellations, and payment questions.",
    count: "6 articles",
    icon: "wallet",
    href: null,
  },
  {
    title: "Troubleshooting",
    desc: "Fix common QR code, download, and account problems.",
    count: "5 articles",
    icon: "wrench",
    href: null,
  },
];

export const stillNeedHelp = {
  title: "Still Need Help?",
  body: "Can’t find what you’re looking for? Our support team is available 24/7 to help with your QR codes, account, billing, or technical questions.",
  primary: "Contact Support",
  secondary: "Browse All Articles",
} as const;
