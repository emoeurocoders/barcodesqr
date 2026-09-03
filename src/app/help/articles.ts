/**
 * The six Help Center articles, lifted from the designer's
 * help_article-*.html. Strings are pasted, never retyped.
 *
 * Every article shares one template: a tag, a title, meta, an intro, a tinted
 * note, numbered steps (one of which carries a screenshot), best practices,
 * related articles, and a helpfulness vote. Only the copy differs, so the
 * markup lives in [category]/[article]/page.tsx and the words live here.
 *
 * URL slugs are shortened from the designer's filenames, which are the whole
 * title. `download-and-test` keeps the slug it already shipped with rather
 * than being renamed out from under anything linking to it.
 *
 * `href: null` marks a link the mockup leaves as "#" — an article that does
 * not exist yet. The anchor is still rendered, so the markup matches.
 */

export type ArticleSection = {
  /** The designer's own anchor id, which the contents list targets. */
  id: string;
  heading: string;
  /** The contents-list label, which drops the heading's leading number. */
  toc: string;
  /**
   * True when the designer lists this section BELOW the contents separator as
   * a plain link rather than inside the numbered <ol> — an FAQ or a "need
   * help?" aside rather than a step in the procedure.
   */
  aside?: boolean;
  paras: string[];
  img?: { src: string; alt: string };
};

export type ArticleLink = { title: string; href: string | null };

export type Article = {
  slug: string;
  /** Slug of the category this article sits under. */
  category: string;
  title: string;
  updated: string;
  readTime: string;
  intro: string;
  note: string | null;
  sections: ArticleSection[];
  best: { id: string; heading: string; items: string[] } | null;
  relId: string;
  related: ArticleLink[];
  /** The sidebar's "Popular articles" list, which varies per article. */
  popular: ArticleLink[];
};

export const articles: Article[] = [
  {
    slug: "edit-after-creating",
    category: "creating-managing",
    title: "Can I edit a QR code after creating it?",
    updated: "Updated 2 days ago",
    readTime: "3 min read",
    intro:
      "Yes. QR codes that support editing can be updated from your BarcodesQR account without needing to create or print a new QR code.",
    note:
      "When an editable QR code is updated, the QR image itself stays the same. Existing printed or shared copies can continue to be used.",
    sections: [
      {
        id: "artSec1",
        heading: "1. Log in to your account",
        toc: "Log in to your account",
        paras: [
          "Log in to BarcodesQR and open your QR code dashboard.",
          "Your saved QR codes will appear in your account.",
        ],
      },
      {
        id: "artSec2",
        heading: "2. Select the QR code you want to edit",
        toc: "Select the QR code you want to edit",
        paras: [
          "Find the QR code you want to update and open it.",
          "Select Edit to view the information and settings associated with that QR code.",
        ],
      },
      {
        id: "artSec3",
        heading: "3. Make your changes",
        toc: "Make your changes",
        paras: [
          "Update the destination, content, or other available settings.",
          "Depending on the QR code type, you may also be able to update design and display options.",
        ],
      },
      {
        id: "artSec4",
        heading: "4. Save your changes",
        toc: "Save your changes",
        paras: [
          "Click Save when you are finished.",
          "Your changes will be applied to the QR code.",
          "You do not need to replace QR codes that have already been printed or shared when only the destination or editable content has changed.",
        ],
      },
      {
        id: "artSec5",
        heading: "What if my QR code cannot be edited?",
        toc: "What if my QR code cannot be edited?",
        aside: true,
        paras: [
          "Some QR codes contain their information directly inside the QR image. These are commonly called static QR codes.",
          "Because the information is permanently encoded into the image, changing the destination requires creating a new QR code.",
        ],
      },
    ],
    best: {
      id: "artBest",
      heading: "Best practices",
      items: [
        "Review your changes after saving and scan the QR code again to confirm that it opens the correct destination.",
        "For QR codes used on printed materials or long-term campaigns, editable QR codes provide more flexibility if your content changes later.",
      ],
    },
    relId: "artRel",
    related: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "How to download and test your QR code", href: "/help/getting-started/download-and-test" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
    ],
    popular: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
    ],
  },
  {
    slug: "cancel-subscription",
    category: "plans-billing",
    title: "How do I cancel my subscription?",
    updated: "Updated 2 days ago",
    readTime: "3 min read",
    intro:
      "You can manage and cancel your BarcodesQR subscription from your account. Canceling stops future subscription renewals.",
    note:
      "Cancel your subscription before your next renewal date if you do not want your plan to renew.",
    sections: [
      {
        id: "artSec1",
        heading: "1. Log in to your account",
        toc: "Log in to your account",
        paras: [
          "Log in to BarcodesQR using the email address associated with your subscription.",
        ],
      },
      {
        id: "artSec2",
        heading: "2. Open your subscription settings",
        toc: "Open your subscription settings",
        paras: [
          "Go to your account or billing settings and locate your current subscription.",
          "Here you can review your plan and billing information.",
        ],
      },
      {
        id: "artSec3",
        heading: "3. Select Cancel Subscription",
        toc: "Select Cancel Subscription",
        paras: [
          "Click Cancel Subscription and follow the instructions shown.",
          "BarcodesQR may send a secure cancellation link to the email address associated with your account.",
        ],
      },
      {
        id: "artSec4",
        heading: "4. Confirm your cancellation",
        toc: "Confirm your cancellation",
        paras: [
          "Complete the cancellation process using the instructions provided.",
          "Once completed, you will receive confirmation that your subscription has been canceled.",
        ],
      },
      {
        id: "artSec5",
        heading: "5. Keep your confirmation",
        toc: "Keep your confirmation",
        paras: [
          "Keep the cancellation confirmation for your records.",
          "If you do not receive confirmation, check your spam or junk folder or contact BarcodesQR Support.",
        ],
      },
      {
        id: "artSec6",
        heading: "What happens to my QR codes?",
        toc: "What happens to my QR codes?",
        aside: true,
        paras: [
          "Canceling prevents future subscription renewals.",
          "Some account features, editable QR codes, analytics, or other subscription functionality may become unavailable when your paid access ends.",
          "Your account will show the applicable status of your QR codes and features.",
        ],
      },
      {
        id: "artSec7",
        heading: "Need help canceling?",
        toc: "Need help canceling?",
        aside: true,
        paras: [
          "If you cannot access your account or have trouble completing the cancellation process, contact BarcodesQR Support.",
          "Use the email address associated with your subscription whenever possible so we can locate your account more quickly.",
        ],
      },
    ],
    best: {
      id: "artBest",
      heading: "Best practices",
      items: [
        "Do not wait until the last minute before a renewal if you intend to cancel.",
        "Always complete all cancellation steps and verify that you have received confirmation.",
      ],
    },
    relId: "artRel",
    related: [
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "Plans and billing", href: null },
      { title: "Troubleshooting account access", href: null },
    ],
    popular: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
    ],
  },
  {
    slug: "logging-in",
    category: "account-login",
    title: "How do I log in to my BarcodesQR account?",
    updated: "Updated 2 days ago",
    readTime: "3 min read",
    intro:
      "You can log in to your BarcodesQR account using the email address associated with your account.",
    note:
      "Use the same email address you provided when creating your BarcodesQR account or completing your subscription.",
    sections: [
      {
        id: "artSec1",
        heading: "1. Open the login page",
        toc: "Open the login page",
        paras: [
          "Click Log In in the top navigation of BarcodesQR.",
          "The login window will appear.",
        ],
      },
      {
        id: "artSec2",
        heading: "2. Enter your email address",
        toc: "Enter your email address",
        paras: [
          "Enter the email address connected to your BarcodesQR account.",
          "Follow the instructions shown to securely access your account.",
        ],
      },
      {
        id: "artSec3",
        heading: "3. Open your dashboard",
        toc: "Open your dashboard",
        paras: [
          "Once logged in, you can access your saved QR codes, statistics, account information, and subscription settings.",
        ],
      },
      {
        id: "artSec4",
        heading: "I can’t access my account",
        toc: "I can’t access my account",
        aside: true,
        paras: [
          "First, confirm that you are entering the same email address originally used with BarcodesQR.",
          "Also check your spam or junk folder if you are waiting for a login email.",
          "If you still cannot access your account, contact BarcodesQR Support for assistance.",
        ],
      },
      {
        id: "artSec5",
        heading: "I used the wrong email address",
        toc: "I used the wrong email address",
        aside: true,
        paras: [
          "If you believe you entered an incorrect email address when creating your account or purchasing a subscription, contact Support.",
          "Include any information that can help us locate the account, but never send your full payment card number.",
        ],
      },
    ],
    best: {
      id: "artBest",
      heading: "Best practices",
      items: [
        "Use an email address you regularly have access to and keep your account information current.",
        "If you use multiple email addresses, make a note of which one is associated with BarcodesQR.",
      ],
    },
    relId: "artRel",
    related: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
      { title: "Troubleshooting account access", href: null },
    ],
    popular: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
    ],
  },
  {
    slug: "create-your-first-qr-code",
    category: "getting-started",
    title: "How to create your first QR code",
    updated: "Updated 2 days ago",
    readTime: "3 min read",
    intro:
      "Creating a QR code with BarcodesQR only takes a few steps. Choose what you want your QR code to do, add your content, customize the design, and generate your code.",
    note:
      "You can preview your QR code while creating it so you can see your changes before downloading.",
    sections: [
      {
        id: "artSec1",
        heading: "1. Choose your QR code type",
        toc: "Choose your QR code type",
        paras: [
          "Go to the Create QR Code page and select the type of QR code you want to create.",
          "BarcodesQR supports QR codes for websites, contact information, social media, WiFi, reviews, menus, files, and more.",
        ],
      },
      {
        id: "artSec2",
        heading: "2. Add your content",
        toc: "Add your content",
        paras: [
          "Enter the information your QR code should contain.",
          "For example, a Website QR code requires the URL you want visitors to open when they scan it.",
          "Make sure your information is correct before continuing.",
        ],
      },
      {
        id: "artSec3",
        heading: "3. Customize your QR code",
        toc: "Customize your QR code",
        paras: [
          "Personalize your QR code using the available design options.",
          "Depending on the QR code type, you can customize elements such as colors, frames, patterns, and branding.",
          "Keep enough contrast between the QR code and its background so it remains easy to scan.",
        ],
      },
      {
        id: "artSec4",
        heading: "4. Preview your QR code",
        toc: "Preview your QR code",
        paras: [
          "Review the QR code preview before creating it.",
          "Check your content, design, spelling, and destination to make sure everything looks correct.",
        ],
      },
      {
        id: "artSec5",
        heading: "5. Create and download your QR code",
        toc: "Create and download your QR code",
        paras: [
          "Click Create QR Code to generate your code.",
          "You can then download it in the available file format and use it online, in print, on packaging, signage, marketing materials, or anywhere else you need it.",
        ],
      },
    ],
    best: {
      id: "artBest",
      heading: "Best practices",
      items: [
        "Always scan and test your QR code before publishing or printing it.",
        "Use a high-resolution or vector file for printed materials, and avoid making your QR code too small.",
      ],
    },
    relId: "artRel",
    related: [
      { title: "How to download and test your QR code", href: "/help/getting-started/download-and-test" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
    ],
    popular: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
    ],
  },
  {
    slug: "download-and-test",
    category: "getting-started",
    title: "How to download and test your QR code",
    updated: "Updated 2 days ago",
    readTime: "3 min read",
    intro:
      "Once your QR code is created, you can download it in the format you need and test it to make sure it works perfectly everywhere.",
    note:
      "Testing your QR code before sharing or printing helps ensure a smooth experience for your audience.",
    sections: [
      {
        id: "artSec1",
        heading: "1. Choose your download settings",
        toc: "Choose your download settings",
        paras: [
          "On the QR code page, click the Download button. Choose your preferred file format (PNG, SVG, PDF, or EPS) and select the size and error correction level that fits your use case.",
        ],
      },
      {
        id: "artSec2",
        heading: "2. Download your QR code",
        toc: "Download your QR code",
        paras: [
          "Click Download to save your QR code to your device. We recommend using PNG for digital use and SVG or PDF for print to ensure the best quality at any size.",
        ],
      },
      {
        id: "artSec3",
        heading: "3. Test your QR code",
        toc: "Test your QR code",
        paras: [
          "Open your phone’s camera or a QR code scanner app and scan the code. Make sure it opens the correct content or destination. Test on multiple devices if possible to confirm reliability.",
        ],
        img: { src: "/help/download-and-test.png", alt: "Downloading a QR code in BarcodesQR" },
      },
      {
        id: "artSec4",
        heading: "4. Make adjustments if needed",
        toc: "Make adjustments if needed",
        paras: [
          "If the QR code doesn’t scan or leads to the wrong place, go back to the editor, update your content or design, and download a new version.",
        ],
      },
    ],
    best: {
      id: "artBest",
      heading: "Best practices",
      items: [
        "Use a high error correction level for printed materials.",
        "Leave clear space around your QR code.",
        "Test your code in different lighting and distances.",
        "Re-test if you update the destination or content.",
      ],
    },
    relId: "artRel",
    related: [
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "What file format should I use?", href: null },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How to track QR code scans", href: null },
      { title: "Best practices for QR code design", href: null },
    ],
    popular: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
    ],
  },
  {
    slug: "not-scanning",
    category: "troubleshooting",
    title: "Why isn’t my QR code scanning?",
    updated: "Updated 2 days ago",
    readTime: "3 min read",
    intro:
      "Most QR code scanning problems are caused by size, contrast, image quality, placement, or an issue with the destination. The steps below can help identify the problem.",
    note:
      "Always test your QR code using more than one device before publishing or printing it.",
    sections: [
      {
        id: "artSec1",
        heading: "1. Check the QR code size",
        toc: "Check the QR code size",
        paras: [
          "Make sure your QR code is large enough to scan easily.",
          "QR codes that are printed too small can become difficult for phone cameras to recognize, especially when viewed from a distance.",
        ],
      },
      {
        id: "artSec2",
        heading: "2. Check the color contrast",
        toc: "Check the color contrast",
        paras: [
          "Your QR code should have strong contrast against its background.",
          "Dark QR code elements on a light background generally provide the most reliable scanning.",
          "Avoid using similar foreground and background colors.",
        ],
      },
      {
        id: "artSec3",
        heading: "3. Check the image quality",
        toc: "Check the image quality",
        paras: [
          "A blurry, stretched, compressed, or low-resolution QR code may not scan correctly.",
          "Download a high-quality version from BarcodesQR and avoid resizing the image in a way that distorts its proportions.",
        ],
      },
      {
        id: "artSec4",
        heading: "4. Keep space around the QR code",
        toc: "Keep space around the QR code",
        paras: [
          "QR codes need clear space around their edges so scanners can identify the code.",
          "Avoid placing text, graphics, borders, or other design elements too close to the QR code.",
        ],
      },
      {
        id: "artSec5",
        heading: "5. Test the destination",
        toc: "Test the destination",
        paras: [
          "If the QR code scans but the page does not open correctly, test the destination link directly in your browser.",
          "Make sure the page is active and the URL is correct.",
        ],
      },
      {
        id: "artSec6",
        heading: "6. Try another device",
        toc: "Try another device",
        paras: [
          "Test the QR code with another phone or QR scanner.",
          "Camera quality, lighting, reflections, and scanning distance can sometimes affect individual devices.",
        ],
      },
      {
        id: "artSec7",
        heading: "Still having trouble?",
        toc: "Still having trouble?",
        aside: true,
        paras: [
          "If your QR code still does not scan after checking these items, contact BarcodesQR Support and include the QR code or a photo showing how it is being used.",
        ],
      },
    ],
    best: {
      id: "artBest",
      heading: "Best practices",
      items: [
        "Test QR codes at their actual intended size and under conditions similar to where customers will scan them.",
        "For printed materials, test a physical proof before producing large quantities.",
      ],
    },
    relId: "artRel",
    related: [
      { title: "How to download and test your QR code", href: "/help/getting-started/download-and-test" },
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
    ],
    popular: [
      { title: "How to create your first QR code", href: "/help/getting-started/create-your-first-qr-code" },
      { title: "Can I edit a QR code after creating it?", href: "/help/creating-managing/edit-after-creating" },
      { title: "Why isn’t my QR code scanning?", href: "/help/troubleshooting/not-scanning" },
      { title: "How do I log in to my BarcodesQR account?", href: "/help/account-login/logging-in" },
      { title: "How do I cancel my subscription?", href: "/help/plans-billing/cancel-subscription" },
    ],
  },
];

export const articleAt = (category: string, slug: string) =>
  articles.find((a) => a.category === category && a.slug === slug);

/** The route for an article named exactly this, or null if unwritten. */
export const articleHref = (title: string) => {
  const a = articles.find((x) => x.title === title);
  return a ? `/help/${a.category}/${a.slug}` : null;
};
