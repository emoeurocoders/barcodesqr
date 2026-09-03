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
  | "wrench"
  | "copy-minus";

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
    href: "/help/getting-started/create-your-first-qr-code",
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
    href: "/help/creating-managing/edit-after-creating",
  },
  {
    label: "Why isn’t my QR code scanning?",
    icon: "circle-question",
    href: "/help/troubleshooting/not-scanning",
  },
  {
    label: "How do I log in to my BarcodesQR account?",
    icon: "circle-user",
    href: "/help/account-login/logging-in",
  },
  {
    label: "How do I cancel my subscription?",
    icon: "credit-card",
    href: "/help/plans-billing/cancel-subscription",
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
    href: "/help/creating-managing",
  },
  {
    title: "Analytics & Scans",
    desc: "Track scan activity and understand QR code performance.",
    count: "4 articles",
    icon: "chart",
    href: "/help/analytics-scans",
  },
  {
    title: "Account & Login",
    desc: "Access your account and manage your login details.",
    count: "4 articles",
    icon: "user",
    href: "/help/account-login",
  },
  {
    title: "Plans & Billing",
    desc: "Learn about plans, subscriptions, payments, and billing.",
    count: "5 articles",
    icon: "wallet",
    href: "/help/plans-billing",
  },
  {
    title: "Troubleshooting",
    desc: "Find quick solutions to common QR code and account issues.",
    count: "4 articles",
    icon: "wrench",
    href: "/help/troubleshooting",
  },
];

export const stillNeedHelp = {
  title: "Still Need Help?",
  body: "Can’t find what you’re looking for? Our support team is available 24/7 to help with your QR codes, account, billing, or technical questions.",
  primary: "Contact Support",
  secondary: "Browse All Articles",
} as const;

/* --- Getting Started category ------------------------------------------- */

export type Article = {
  title: string;
  desc: string;
  icon: IconKey;
  href: string | null;
};

export const gettingStarted = {
  tag: "Getting Started",
  title: "Getting Started",
  intro:
    "Everything you need to create, customize, and download your first QR code.",
  count: "5 articles",
} as const;

export const gettingStartedArticles: Article[] = [
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
    // The designer already points this one at help_article.html.
    title: "How to download and test your QR code",
    desc: "Download your QR code and test it to make sure it works perfectly.",
    icon: "download",
    href: "/help/getting-started/download-and-test",
  },
];

export const exploreHeading = "Explore more help topics";

export const exploreTopics: Article[] = [
  {
    title: "Creating & Managing QR Codes",
    desc: "Create, edit, organize, and manage QR codes from your account.",
    icon: "qr-code",
    href: null,
  },
  {
    title: "Analytics & Scans",
    desc: "Understand how your QR codes are scanned and how to read your statistics.",
    icon: "chart",
    href: null,
  },
  {
    title: "Account & Login",
    desc: "Get help accessing and managing your BarcodesQR account.",
    icon: "user",
    href: null,
  },
];

/* --- Shared sidebar ------------------------------------------------------ */

export const sidebar = {
  searchPlaceholder: "Search Help Center...",
  categoriesHeading: "Other categories",
  helpHeading: "Need more help?",
  helpBody:
    "Our support team is here for you. We typically reply within a few hours.",
  helpCta: "Contact Support",
} as const;

/** "Other categories" — every topic except the one being viewed. */
export const otherCategories: { title: string; icon: IconKey }[] = [
  { title: "Creating & Managing QR Codes", icon: "qr-code" },
  { title: "Analytics & Scans", icon: "chart" },
  { title: "Account & Login", icon: "user" },
  { title: "Plans & Billing", icon: "credit-card" },
  { title: "Troubleshooting", icon: "wrench" },
];

export const supportPoints = [
  "24/7 Email Support",
  "Real People, Real Help",
  "We’re Here to Help",
] as const;

/** The band above the footer on the category and article pages. */
export const helpCta = {
  title: "Still need help?",
  body: "Our support team is available 24/7 to help with your BarcodesQR account, QR codes, billing, or technical questions.",
  cta: "Contact Support",
} as const;

/* --- The one article that exists ----------------------------------------- */

export const article = {
  tag: "Getting Started",
  title: "How to download and test your QR code",
  updated: "Updated 2 days ago",
  readTime: "3 min read",
  intro:
    "Once your QR code is created, you can download it in the format you need and test it to make sure it works perfectly everywhere.",
  note: "Testing your QR code before sharing or printing helps ensure a smooth experience for your audience.",
  shot: {
    src: "/help/download-and-test.png",
    alt: "Downloading a QR code in BarcodesQR",
  },
} as const;

/** Numbered steps. The ids are the designer's own anchor targets. */
export const articleSections = [
  {
    id: "artSec1",
    heading: "1. Choose your download settings",
    toc: "Choose your download settings",
    body: "On the QR code page, click the Download button. Choose your preferred file format (PNG, SVG, PDF, or EPS) and select the size and error correction level that fits your use case.",
  },
  {
    id: "artSec2",
    heading: "2. Download your QR code",
    toc: "Download your QR code",
    body: "Click Download to save your QR code to your device. We recommend using PNG for digital use and SVG or PDF for print to ensure the best quality at any size.",
  },
  {
    id: "artSec3",
    heading: "3. Test your QR code",
    toc: "Test your QR code",
    body: "Open your phone’s camera or a QR code scanner app and scan the code. Make sure it opens the correct content or destination. Test on multiple devices if possible to confirm reliability.",
    /** Only this step carries the screenshot. */
    shot: true,
  },
  {
    id: "artSec4",
    heading: "4. Make adjustments if needed",
    toc: "Make adjustments if needed",
    body: "If the QR code doesn’t scan or leads to the wrong place, go back to the editor, update your content or design, and download a new version.",
  },
] as const;

export const bestPractices = {
  id: "artBest",
  heading: "Best practices",
  items: [
    "Use a high error correction level for printed materials.",
    "Leave clear space around your QR code.",
    "Test your code in different lighting and distances.",
    "Re-test if you update the destination or content.",
  ],
} as const;

export const relatedArticles = {
  id: "artRel",
  heading: "Related articles",
  items: [
    "Can I edit a QR code after creating it?",
    "What file format should I use?",
    "Why isn’t my QR code scanning?",
    "How to track QR code scans",
    "Best practices for QR code design",
  ],
} as const;

export const vote = {
  title: "Was this article helpful?",
  body: "Your feedback helps us improve our Help Center.",
  yes: "Yes",
  no: "No",
} as const;

export const articleSidebar = {
  tocHeading: "In this article",
  relatedHeading: "Related articles",
  popularHeading: "Popular articles",
  viewAll: "View all articles",
} as const;

/** The sidebar's "Popular articles" list — titles only, all still unbuilt. */
export const sidebarPopular = [
  "How to create your first QR code",
  "Can I edit a QR code after creating it?",
  "Why isn’t my QR code scanning?",
  "How do I log in to my BarcodesQR account?",
  "How do I cancel my subscription?",
] as const;
