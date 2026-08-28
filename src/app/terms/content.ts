// GENERATED from html_files/terms.html by scripts/extract-terms.mjs.
// Do not hand-edit: re-run the script after a design sync so the legal
// copy keeps coming across by machine rather than being retyped.

export type Run = { t?: string; strong?: boolean; href?: string; br?: boolean };

export type Block =
  | { kind: "p"; body: Run[] }
  | { kind: "h3"; text: string }
  | { kind: "list"; ticked: boolean; items: Run[][] }
  | { kind: "note"; body: Run[] }
  | {
      kind: "cards";
      cards: { shapes: string[]; title: string; paras: Run[][] }[];
    };

export type Section = { id: string; heading: string; blocks: Block[] };

export const hero = {
  "cap": "Legal",
  "title": "Terms & Conditions",
  "lead": "These Terms & Conditions govern your access to and use of BarcodesQR.com and the QR code creation and management services we provide.",
  "updated": "Last Updated: August 27, 2026"
};

export const ask = {
  "title": "Questions?",
  "desc": "We’re here to help.",
  "email": "help@barcodesqr.com"
};

export const toc: { id: string; label: string }[] = [
  {
    "id": "trmSec1",
    "label": "About BarcodesQR"
  },
  {
    "id": "trmSec2",
    "label": "Static and Dynamic QR Codes"
  },
  {
    "id": "trmSec3",
    "label": "Eligibility"
  },
  {
    "id": "trmSec4",
    "label": "Accounts and Email-Based Access"
  },
  {
    "id": "trmSec5",
    "label": "Trial Access"
  },
  {
    "id": "trmSec6",
    "label": "Subscription Plans and Automatic Renewal"
  },
  {
    "id": "trmSec7",
    "label": "Cancellation"
  },
  {
    "id": "trmSec8",
    "label": "Billing and Payment"
  },
  {
    "id": "trmSec9",
    "label": "Refunds"
  },
  {
    "id": "trmSec10",
    "label": "Your Content"
  },
  {
    "id": "trmSec11",
    "label": "Ownership of QR Codes and BarcodesQR"
  },
  {
    "id": "trmSec12",
    "label": "Third-Party Names, Brands, and Services"
  },
  {
    "id": "trmSec13",
    "label": "Prohibited Uses"
  },
  {
    "id": "trmSec14",
    "label": "Scan Analytics"
  },
  {
    "id": "trmSec15",
    "label": "QR Code Testing and Printing"
  },
  {
    "id": "trmSec16",
    "label": "High-Risk Uses"
  },
  {
    "id": "trmSec17",
    "label": "Security"
  },
  {
    "id": "trmSec18",
    "label": "Availability and Service Changes"
  },
  {
    "id": "trmSec19",
    "label": "Suspension and Termination"
  },
  {
    "id": "trmSec20",
    "label": "Third-Party Destinations"
  },
  {
    "id": "trmSec21",
    "label": "Disclaimer of Warranties"
  },
  {
    "id": "trmSec22",
    "label": "Limitation of Liability"
  },
  {
    "id": "trmSec23",
    "label": "Indemnification"
  },
  {
    "id": "trmSec24",
    "label": "Force Majeure"
  },
  {
    "id": "trmSec25",
    "label": "Consumer Rights"
  },
  {
    "id": "trmSec26",
    "label": "Disputes and Informal Resolution"
  },
  {
    "id": "trmSec27",
    "label": "Governing Law and Venue"
  },
  {
    "id": "trmSec28",
    "label": "Changes to These Terms"
  },
  {
    "id": "trmSec29",
    "label": "Communications"
  },
  {
    "id": "trmSec30",
    "label": "General Provisions"
  },
  {
    "id": "trmSec31",
    "label": "Contact Us"
  }
];

export const intro: Run[][] = [
  [
    {
      "t": "These Terms & Conditions (“Terms”) govern your access to and use of BarcodesQR.com and the QR code creation, customization, hosting, analytics, account, subscription, and related services we provide (collectively, the “Service”)."
    }
  ],
  [
    {
      "t": "These Terms form a legally binding agreement between you and [LEGAL ENTITY NAME], the operator of BarcodesQR (“BarcodesQR,” “we,” “us,” or “our”)."
    }
  ],
  [
    {
      "t": "Please read these Terms carefully before using the Service."
    }
  ],
  [
    {
      "t": "By creating a QR code, providing your email address, creating or accessing an account, starting a trial, purchasing a subscription, or otherwise using the Service, you agree to these Terms and our Privacy Policy."
    }
  ],
  [
    {
      "t": "If you do not agree, do not use the Service."
    }
  ]
];

export const sections: Section[] = [
  {
    "id": "trmSec1",
    "heading": "1. About BarcodesQR",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR provides tools that allow users to create, customize, download, manage, and track QR codes."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Depending on the QR type and subscription plan, the Service may include:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": true,
        "items": [
          [
            {
              "t": "Static and dynamic QR codes;"
            }
          ],
          [
            {
              "t": "Editable QR destinations;"
            }
          ],
          [
            {
              "t": "Custom colors, shapes, frames, logos, and branding;"
            }
          ],
          [
            {
              "t": "QR codes for websites, PDFs, images, videos, social media, Wi-Fi, vCards, reviews, events, locations, email, SMS, phone, multi-link pages, and other uses;"
            }
          ],
          [
            {
              "t": "Hosted landing pages or uploaded content;"
            }
          ],
          [
            {
              "t": "Scan analytics and reporting;"
            }
          ],
          [
            {
              "t": "Password protection;"
            }
          ],
          [
            {
              "t": "High-resolution QR code downloads;"
            }
          ],
          [
            {
              "t": "Bulk QR code tools; and"
            }
          ],
          [
            {
              "t": "Other features that we may add or modify from time to time."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The availability of particular features may depend on your subscription plan, account status, location, or other factors."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may improve, modify, replace, or discontinue features as the Service evolves."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec2",
    "heading": "2. Static and Dynamic QR Codes",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR may provide both static and dynamic QR codes."
          }
        ]
      },
      {
        "kind": "cards",
        "cards": [
          {
            "shapes": [
              "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" />",
              "<path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />"
            ],
            "title": "Static QR Codes",
            "paras": [
              [
                {
                  "t": "A static QR code directly contains the destination or information encoded in the QR code itself."
                }
              ],
              [
                {
                  "t": "Once downloaded, a properly created static QR code generally does not require an active BarcodesQR subscription to continue functioning."
                }
              ],
              [
                {
                  "t": "However, we cannot guarantee that a static QR code will remain useful if the destination URL, telephone number, website, third-party service, or other information encoded in the QR code later changes or becomes unavailable."
                }
              ]
            ]
          },
          {
            "shapes": [
              "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" />",
              "<path d=\"M21 3v5h-5\" />",
              "<path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" />",
              "<path d=\"M8 16H3v5\" />"
            ],
            "title": "Dynamic QR Codes",
            "paras": [
              [
                {
                  "t": "Dynamic QR codes use BarcodesQR infrastructure to redirect a person scanning the QR code to the destination you have configured."
                }
              ],
              [
                {
                  "t": "Dynamic QR codes may allow you to change the destination after the QR code has been printed and may provide analytics and other features."
                }
              ],
              [
                {
                  "t": "Because dynamic QR codes depend on BarcodesQR infrastructure and an active account, dynamic QR codes and related hosted services may become inactive or stop redirecting if your applicable subscription expires, is cancelled, is suspended, or is otherwise no longer active."
                }
              ]
            ]
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You are responsible for determining whether a static or dynamic QR code is appropriate for your particular use."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec3",
    "heading": "3. Eligibility",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "You must be at least 18 years old, or the age of legal majority where you live if higher, to purchase a subscription or create a BarcodesQR account."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "By using the Service, you represent that you have the legal capacity to enter into these Terms."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you use BarcodesQR on behalf of a company, organization, or other legal entity, you represent that you have authority to bind that entity to these Terms."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec4",
    "heading": "4. Accounts and Email-Based Access",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "Certain BarcodesQR features require an account."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You agree to provide accurate and current information, including a valid email address."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "When you provide an email address during checkout, we may automatically create or associate a BarcodesQR account with that email address so that you can access the QR codes and subscription you purchased."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR may use secure email links, verification codes, magic links, or similar passwordless authentication methods to provide account access."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You are responsible for maintaining the security of your email account and any authentication link or code sent to you."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You are responsible for activity conducted through your BarcodesQR account unless the activity results directly from a security failure by BarcodesQR."
          }
        ]
      },
      {
        "kind": "note",
        "body": [
          {
            "t": "Important:",
            "strong": true
          },
          {
            "t": " If you believe your account or email-based login credentials have been compromised, contact us promptly at "
          },
          {
            "t": "help@barcodesqr.com",
            "href": "mailto:help@barcodesqr.com"
          },
          {
            "t": "."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec5",
    "heading": "5. Trial Access",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR may offer new customers a paid introductory trial."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Our standard introductory offer is currently:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "7-Day Trial",
              "strong": true
            },
            {
              "t": " — $1.00 USD"
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The exact trial price, trial duration, features included, subscription that follows the trial, and amount you will be charged after the trial are displayed at checkout before you complete your purchase."
          }
        ]
      },
      {
        "kind": "note",
        "body": [
          {
            "t": "Please Note:",
            "strong": true
          },
          {
            "t": " Unless you cancel before the trial ends, your trial automatically converts to the paid subscription disclosed at checkout, and the payment method you provided will automatically be charged."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The trial fee provides immediate access to the Service and is non-refundable except where a refund is required by applicable law."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Trial eligibility may be limited to new customers. We may restrict multiple trials created by the same person, household, business, email account, payment method, device, or other reasonably related identifier."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec6",
    "heading": "6. Subscription Plans and Automatic Renewal",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR is a subscription service."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Standard subscription options may include:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Monthly Plan",
              "strong": true
            },
            {
              "t": " — $39.95 per month"
            }
          ],
          [
            {
              "t": "Quarterly Plan",
              "strong": true
            },
            {
              "t": " — $89.85 every three months"
            }
          ],
          [
            {
              "t": "Half-Year Plan",
              "strong": true
            },
            {
              "t": " — $119.70 every six months"
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may offer other plans, introductory prices, regional pricing, promotions, discounts, or alternative billing intervals."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The price and billing interval clearly displayed to you at checkout immediately before purchase control your transaction."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If an effective monthly price is displayed for a prepaid quarterly, half-year, annual, or other multi-month plan, that monthly figure may be provided for comparison. You will be charged the full prepaid amount disclosed at checkout."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Subscriptions automatically renew at the end of each billing period unless cancelled before the next renewal."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "By starting a subscription, you authorize BarcodesQR and its payment providers to automatically charge your selected payment method for:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "The applicable trial or introductory charge;"
            }
          ],
          [
            {
              "t": "The subscription amount disclosed at checkout when the trial ends; and"
            }
          ],
          [
            {
              "t": "Each subsequent renewal charge until you cancel."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Renewal charges will generally be made using the same payment method used for your initial purchase unless you update your payment method."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec7",
    "heading": "7. Cancellation",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "You may cancel your BarcodesQR subscription at any time."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Cancellation may be available through your BarcodesQR account, our cancellation page or Cancellation Hub, or another cancellation method identified in the Service."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Cancelling During a Trial"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you cancel before your trial expires, your subscription will not convert to the paid recurring subscription."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Cancelling a Paid Subscription"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you cancel after a paid subscription period has begun, cancellation stops future automatic renewal."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Unless otherwise stated at the time of cancellation, you may continue using your paid subscription until the end of the billing period you have already paid for."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "After your paid subscription ends, subscription-dependent functionality may be disabled, including:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Dynamic QR redirects;"
            }
          ],
          [
            {
              "t": "Editing of dynamic QR destinations;"
            }
          ],
          [
            {
              "t": "Hosted QR landing pages or files;"
            }
          ],
          [
            {
              "t": "Scan analytics;"
            }
          ],
          [
            {
              "t": "Password-protected or other cloud-based features; and"
            }
          ],
          [
            {
              "t": "Access to subscription features in your account."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Cancelling a subscription does not automatically entitle you to a refund of charges already processed."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Deleting a payment card, asking your financial institution to block a payment, or initiating a chargeback does not constitute cancellation of your BarcodesQR subscription."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec8",
    "heading": "8. Billing and Payment",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "You agree to provide valid payment information and authorize us and our payment service providers to process charges associated with your purchase."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Payment processing may be provided by third-party payment providers and acquiring banks. BarcodesQR generally does not store complete payment card numbers."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If a payment fails, is declined, is reversed, or cannot be processed, we may:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Retry the payment where permitted;"
            }
          ],
          [
            {
              "t": "Ask you to update your payment information;"
            }
          ],
          [
            {
              "t": "Restrict paid functionality;"
            }
          ],
          [
            {
              "t": "Suspend dynamic QR redirects; or"
            }
          ],
          [
            {
              "t": "Suspend or terminate the applicable subscription."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You are responsible for applicable sales, use, VAT, GST, or similar taxes unless we are required to collect and remit them directly."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Currency-conversion charges or foreign transaction fees imposed by your card issuer, bank, wallet provider, or other financial institution are not charges imposed by BarcodesQR."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec9",
    "heading": "9. Refunds",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "Except where otherwise stated in our Refund Policy or required by applicable law, payments are generally non-refundable once processed."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The introductory trial fee is non-refundable except where required by law."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may issue refunds or credits in appropriate circumstances, including:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Duplicate charges;"
            }
          ],
          [
            {
              "t": "Incorrect charges caused by a BarcodesQR billing error;"
            }
          ],
          [
            {
              "t": "Unauthorized transactions for which BarcodesQR is responsible;"
            }
          ],
          [
            {
              "t": "Other circumstances expressly covered by our Refund Policy; or"
            }
          ],
          [
            {
              "t": "Situations where applicable law requires a refund."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you believe you were charged incorrectly, please contact "
          },
          {
            "t": "support@barcodesqr.com",
            "href": "mailto:support@barcodesqr.com"
          },
          {
            "t": " promptly and include the email address associated with your account and the relevant transaction information."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Approved refunds are normally returned to the original payment method. Bank or card processing times may vary."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Our separate Refund Policy, where published, forms part of these Terms. If there is a conflict concerning refund eligibility, the Refund Policy will control unless applicable law requires otherwise."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec10",
    "heading": "10. Your Content",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "You retain ownership of the content you provide through BarcodesQR."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "“Your Content” may include:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Destination URLs;"
            }
          ],
          [
            {
              "t": "Website information;"
            }
          ],
          [
            {
              "t": "Uploaded PDFs and documents;"
            }
          ],
          [
            {
              "t": "Images;"
            }
          ],
          [
            {
              "t": "Videos;"
            }
          ],
          [
            {
              "t": "Logos;"
            }
          ],
          [
            {
              "t": "Business information;"
            }
          ],
          [
            {
              "t": "Contact information;"
            }
          ],
          [
            {
              "t": "Social media links;"
            }
          ],
          [
            {
              "t": "Menu information;"
            }
          ],
          [
            {
              "t": "Event information;"
            }
          ],
          [
            {
              "t": "Reviews or feedback content;"
            }
          ],
          [
            {
              "t": "Landing-page content; and"
            }
          ],
          [
            {
              "t": "Other information you enter, upload, or connect to a QR code."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You grant BarcodesQR a worldwide, non-exclusive, royalty-free license to host, store, process, reproduce, transmit, display, and otherwise use Your Content solely as reasonably necessary to operate, secure, maintain, and improve the Service."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "For example, this license allows us to:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Generate your QR code;"
            }
          ],
          [
            {
              "t": "Host an uploaded file;"
            }
          ],
          [
            {
              "t": "Redirect someone who scans your dynamic QR code;"
            }
          ],
          [
            {
              "t": "Display a QR landing page;"
            }
          ],
          [
            {
              "t": "Generate scan analytics;"
            }
          ],
          [
            {
              "t": "Back up your information; and"
            }
          ],
          [
            {
              "t": "Detect fraud, malware, phishing, or misuse."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You represent that you have the necessary rights and permissions to use Your Content with BarcodesQR."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec11",
    "heading": "11. Ownership of QR Codes and BarcodesQR",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "Subject to these Terms, you may use QR codes you create through BarcodesQR for your personal or commercial purposes, including on websites, advertisements, printed materials, packaging, signage, menus, business cards, and marketing campaigns."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Your right to use an exported QR code does not give you ownership of the BarcodesQR platform."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR and its licensors retain all rights in the Service, including:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Software;"
            }
          ],
          [
            {
              "t": "Source code;"
            }
          ],
          [
            {
              "t": "QR generation technology;"
            }
          ],
          [
            {
              "t": "Redirect infrastructure;"
            }
          ],
          [
            {
              "t": "Analytics systems;"
            }
          ],
          [
            {
              "t": "Templates;"
            }
          ],
          [
            {
              "t": "User-interface designs;"
            }
          ],
          [
            {
              "t": "Documentation;"
            }
          ],
          [
            {
              "t": "Databases;"
            }
          ],
          [
            {
              "t": "Trademarks;"
            }
          ],
          [
            {
              "t": "Logos; and"
            }
          ],
          [
            {
              "t": "Other BarcodesQR intellectual property."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Except where permitted by applicable law, you may not:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Reverse engineer, decompile, or disassemble the Service;"
            }
          ],
          [
            {
              "t": "Attempt to obtain BarcodesQR source code;"
            }
          ],
          [
            {
              "t": "Copy or reproduce substantial portions of the platform;"
            }
          ],
          [
            {
              "t": "Scrape or systematically extract platform data;"
            }
          ],
          [
            {
              "t": "Resell or sublicense BarcodesQR without authorization;"
            }
          ],
          [
            {
              "t": "Circumvent usage restrictions or security measures; or"
            }
          ],
          [
            {
              "t": "Use BarcodesQR technology or proprietary data to build a substantially competing service."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "trmSec12",
    "heading": "12. Third-Party Names, Brands, and Services",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR may allow QR codes to connect with or link to third-party services such as websites, social networks, messaging services, map services, app stores, review platforms, payment services, and other online destinations."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Third-party names and trademarks displayed within BarcodesQR are the property of their respective owners and may be used solely to identify compatible destinations or functionality."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Unless expressly stated otherwise, BarcodesQR is not affiliated with, endorsed by, sponsored by, or approved by those third parties."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Third-party services are governed by their own terms, policies, availability, and technical requirements."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We are not responsible for a third-party service changing its URLs, APIs, QR compatibility, policies, functionality, availability, or access requirements."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec13",
    "heading": "13. Prohibited Uses",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "You may not use BarcodesQR to create, host, distribute, redirect to, facilitate, or promote content or activity that:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Violates applicable law;"
            }
          ],
          [
            {
              "t": "Infringes copyright, trademark, privacy, publicity, or other rights;"
            }
          ],
          [
            {
              "t": "Facilitates fraud, phishing, identity theft, credential theft, or financial deception;"
            }
          ],
          [
            {
              "t": "Distributes viruses, malware, ransomware, spyware, or malicious software;"
            }
          ],
          [
            {
              "t": "Impersonates a person, business, government agency, financial institution, or other organization without authorization;"
            }
          ],
          [
            {
              "t": "Exploits, sexualizes, or endangers children;"
            }
          ],
          [
            {
              "t": "Contains unlawful sexual or exploitative material;"
            }
          ],
          [
            {
              "t": "Incites terrorism, violence, or other serious physical harm;"
            }
          ],
          [
            {
              "t": "Contains unlawful hate speech or unlawful harassment;"
            }
          ],
          [
            {
              "t": "Unlawfully exposes another person’s private or confidential information;"
            }
          ],
          [
            {
              "t": "Facilitates spam or unsolicited bulk messaging;"
            }
          ],
          [
            {
              "t": "Attempts to hide or disguise a malicious destination;"
            }
          ],
          [
            {
              "t": "Circumvents BarcodesQR security controls or rate limits;"
            }
          ],
          [
            {
              "t": "Interferes with or overloads the Service;"
            }
          ],
          [
            {
              "t": "Probes or scans BarcodesQR systems without authorization; or"
            }
          ],
          [
            {
              "t": "Uses BarcodesQR infrastructure as an unauthorized resale or generic redirect service."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may investigate suspected misuse and may disable QR codes, remove content, restrict functionality, or suspend or terminate accounts where we reasonably believe these Terms or applicable law have been violated."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may cooperate with law-enforcement authorities when legally required or where necessary to address unlawful activity."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec14",
    "heading": "14. Scan Analytics",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "Certain BarcodesQR plans may provide information about QR code scans."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Analytics may include information such as:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Total scans;"
            }
          ],
          [
            {
              "t": "Unique or estimated unique scans;"
            }
          ],
          [
            {
              "t": "Date and time;"
            }
          ],
          [
            {
              "t": "Approximate geographic location;"
            }
          ],
          [
            {
              "t": "Device category;"
            }
          ],
          [
            {
              "t": "Browser;"
            }
          ],
          [
            {
              "t": "Operating system; and"
            }
          ],
          [
            {
              "t": "Other technical or campaign-related information."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Analytics are provided as informational estimates and may not be perfectly accurate or complete."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Factors such as browser privacy controls, network configuration, VPNs, proxies, repeat scans, automated traffic, device settings, and technical limitations may affect reported data."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You should not rely on BarcodesQR analytics as an audited measurement system or as the sole basis for financial, legal, safety-critical, or compliance decisions."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Our collection and processing of scan-related information is described in our Privacy Policy."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec15",
    "heading": "15. QR Code Testing and Printing",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "You are responsible for testing QR codes before distributing or printing them."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "QR code scanning may be affected by:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Print quality;"
            }
          ],
          [
            {
              "t": "QR code size;"
            }
          ],
          [
            {
              "t": "Contrast;"
            }
          ],
          [
            {
              "t": "Colors;"
            }
          ],
          [
            {
              "t": "Logos or design customization;"
            }
          ],
          [
            {
              "t": "Physical damage;"
            }
          ],
          [
            {
              "t": "Lighting;"
            }
          ],
          [
            {
              "t": "Camera quality;"
            }
          ],
          [
            {
              "t": "Device software;"
            }
          ],
          [
            {
              "t": "Network connectivity;"
            }
          ],
          [
            {
              "t": "Printing surfaces;"
            }
          ],
          [
            {
              "t": "Placement; and"
            }
          ],
          [
            {
              "t": "Changes to the destination."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We strongly recommend testing a QR code using multiple devices before committing to a large print run."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR is not responsible for printing, manufacturing, advertising, packaging, signage, or other costs resulting from a QR code that was not adequately tested before production or distribution, except where applicable law provides otherwise."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec16",
    "heading": "16. High-Risk Uses",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR is designed as a general-purpose marketing, information, communication, and convenience tool."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The Service is not designed for situations where failure of a QR code or redirect could reasonably cause death, bodily injury, substantial property damage, or other serious harm."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You must not rely on BarcodesQR as the sole means of delivering:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Emergency alerts;"
            }
          ],
          [
            {
              "t": "Medical instructions;"
            }
          ],
          [
            {
              "t": "Life-safety information;"
            }
          ],
          [
            {
              "t": "Critical infrastructure commands;"
            }
          ],
          [
            {
              "t": "Industrial safety controls;"
            }
          ],
          [
            {
              "t": "Security credentials requiring guaranteed availability; or"
            }
          ],
          [
            {
              "t": "Other safety-critical information."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "trmSec17",
    "heading": "17. Security",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "We use reasonable administrative, technical, and organizational measures designed to protect BarcodesQR and customer information."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "However, no internet-based system can be guaranteed to be completely secure or continuously available."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You are responsible for protecting your email account, devices, authentication links, and other means of accessing your BarcodesQR account."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you discover a suspected vulnerability or security issue, please report it to "
          },
          {
            "t": "help@barcodesqr.com",
            "href": "mailto:help@barcodesqr.com"
          },
          {
            "t": " and do not exploit or publicly disclose it in a manner that could place customers or the Service at risk."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec18",
    "heading": "18. Availability and Service Changes",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "We work to keep BarcodesQR available and reliable, but we do not guarantee uninterrupted or error-free operation."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The Service may occasionally be unavailable because of:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Maintenance;"
            }
          ],
          [
            {
              "t": "Software updates;"
            }
          ],
          [
            {
              "t": "Security incidents;"
            }
          ],
          [
            {
              "t": "Internet or telecommunications failures;"
            }
          ],
          [
            {
              "t": "Hosting or cloud-provider failures;"
            }
          ],
          [
            {
              "t": "DNS or certificate failures;"
            }
          ],
          [
            {
              "t": "Third-party service outages;"
            }
          ],
          [
            {
              "t": "Excessive traffic;"
            }
          ],
          [
            {
              "t": "Government action; or"
            }
          ],
          [
            {
              "t": "Events outside our reasonable control."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may modify, add, remove, replace, or discontinue features as the Service evolves."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Where a material change significantly affects an active paid subscription, we will provide notice where reasonably practicable and where required by law."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec19",
    "heading": "19. Suspension and Termination",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "We may restrict, suspend, or terminate an account or individual QR code if we reasonably believe:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "These Terms have been violated;"
            }
          ],
          [
            {
              "t": "The Service is being used unlawfully;"
            }
          ],
          [
            {
              "t": "A QR code presents a security, phishing, fraud, malware, or abuse risk;"
            }
          ],
          [
            {
              "t": "Payment remains outstanding;"
            }
          ],
          [
            {
              "t": "A transaction has been fraudulently disputed or charged back;"
            }
          ],
          [
            {
              "t": "The account has been compromised; or"
            }
          ],
          [
            {
              "t": "Suspension is necessary to comply with law or protect BarcodesQR, its customers, scanners, or third parties."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Where reasonably appropriate, we may give you an opportunity to correct a violation before terminating your account."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "When a subscription or account ends, access to dynamic QR services, hosted content, analytics, and other account-dependent functionality may cease."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Data associated with terminated accounts is handled according to our Privacy Policy and applicable retention requirements."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec20",
    "heading": "20. Third-Party Destinations",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR allows users to create QR codes that point to destinations selected by those users."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We generally do not control, operate, endorse, or verify those destinations."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you scan a QR code created using BarcodesQR, you may be redirected to a third-party website or service with its own privacy practices, security standards, terms, products, and content."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR is not responsible for third-party destinations, transactions, products, services, content, or security."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Users who create QR codes are responsible for ensuring that the destinations they select are lawful, accurate, authorized, and appropriate."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec21",
    "heading": "21. Disclaimer of Warranties",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.”"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "BARCODESQR DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, AND AVAILABILITY."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "WE DO NOT GUARANTEE THAT:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "EVERY QR CODE WILL SCAN ON EVERY DEVICE;"
            }
          ],
          [
            {
              "t": "EVERY QR CODE WILL CONTINUE TO RESOLVE IN EVERY CIRCUMSTANCE;"
            }
          ],
          [
            {
              "t": "THE SERVICE WILL ALWAYS BE AVAILABLE OR ERROR-FREE;"
            }
          ],
          [
            {
              "t": "ANALYTICS WILL BE COMPLETE OR PERFECTLY ACCURATE;"
            }
          ],
          [
            {
              "t": "THIRD-PARTY DESTINATIONS WILL REMAIN AVAILABLE;"
            }
          ],
          [
            {
              "t": "YOUR USE OF A QR CODE WILL PRODUCE A PARTICULAR BUSINESS OR MARKETING RESULT; OR"
            }
          ],
          [
            {
              "t": "EVERY DEFECT WILL BE CORRECTED WITHIN A PARTICULAR PERIOD."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Nothing in these Terms excludes warranties or consumer rights that cannot legally be excluded."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec22",
    "heading": "22. Limitation of Liability",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BARCODESQR AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AGENTS, LICENSORS, AND SERVICE PROVIDERS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "THIS INCLUDES LOSS OF PROFITS, REVENUE, BUSINESS, GOODWILL, DATA, USE, ADVERTISING EXPENDITURE, PRINTING COSTS, OR BUSINESS INTERRUPTION ARISING FROM OR RELATING TO THE SERVICE."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE TOTAL AMOUNT YOU PAID TO BARCODESQR DURING THE 12 MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you have not paid BarcodesQR, our aggregate liability will not exceed $100 USD, except where applicable law requires otherwise."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Nothing in these Terms limits liability where such limitation is prohibited by law."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec23",
    "heading": "23. Indemnification",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "To the extent permitted by law, you agree to defend, indemnify, and hold harmless BarcodesQR, its affiliates, officers, directors, employees, contractors, agents, licensors, and service providers from third-party claims, liabilities, damages, judgments, losses, costs, and reasonable legal fees arising from or relating to:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Your Content;"
            }
          ],
          [
            {
              "t": "QR codes you create;"
            }
          ],
          [
            {
              "t": "Destinations to which your QR codes link;"
            }
          ],
          [
            {
              "t": "Your violation of these Terms;"
            }
          ],
          [
            {
              "t": "Your violation of applicable law;"
            }
          ],
          [
            {
              "t": "Your infringement of another person’s intellectual-property, privacy, publicity, or contractual rights;"
            }
          ],
          [
            {
              "t": "Fraud or intentional misconduct by you; or"
            }
          ],
          [
            {
              "t": "Your misuse of the Service."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may assume control of the defense of a matter subject to indemnification, in which case you agree to reasonably cooperate with us."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec24",
    "heading": "24. Force Majeure",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR will not be liable for delay, interruption, or failure caused by events beyond our reasonable control, including:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Natural disasters;"
            }
          ],
          [
            {
              "t": "Fire or flood;"
            }
          ],
          [
            {
              "t": "War or terrorism;"
            }
          ],
          [
            {
              "t": "Civil unrest;"
            }
          ],
          [
            {
              "t": "Epidemics or pandemics;"
            }
          ],
          [
            {
              "t": "Government restrictions;"
            }
          ],
          [
            {
              "t": "Labor disputes;"
            }
          ],
          [
            {
              "t": "Power failures;"
            }
          ],
          [
            {
              "t": "Internet failures;"
            }
          ],
          [
            {
              "t": "Cloud infrastructure failures;"
            }
          ],
          [
            {
              "t": "Telecommunications outages;"
            }
          ],
          [
            {
              "t": "DNS failures;"
            }
          ],
          [
            {
              "t": "Payment-network failures; or"
            }
          ],
          [
            {
              "t": "Similar events outside our reasonable control."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "trmSec25",
    "heading": "25. Consumer Rights",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "These Terms are intended to apply globally."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Nothing in these Terms limits rights you may have under mandatory consumer-protection laws that cannot legally be waived."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If the law where you reside provides stronger rights concerning cancellation, refunds, warranties, dispute resolution, or digital services, those mandatory rights continue to apply."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec26",
    "heading": "26. Disputes and Informal Resolution",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "Before bringing a formal legal claim relating to the Service, you agree to first contact us and provide a reasonable opportunity to resolve the issue informally."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Billing matters should be sent to:"
          },
          {
            "br": true
          },
          {
            "t": " "
          },
          {
            "t": "support@barcodesqr.com",
            "href": "mailto:support@barcodesqr.com"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "General or legal-support matters should be sent to:"
          },
          {
            "br": true
          },
          {
            "t": " "
          },
          {
            "t": "help@barcodesqr.com",
            "href": "mailto:help@barcodesqr.com"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We will attempt in good faith to resolve disputes informally before either party begins formal proceedings."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec27",
    "heading": "27. Governing Law and Venue",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "These Terms are governed by the laws of the State of [STATE], United States, without regard to conflict-of-law principles."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Subject to mandatory consumer-protection laws that may apply where you reside, legal proceedings arising out of or relating to these Terms or the Service will be brought in the state or federal courts located in [COUNTY, STATE], and each party consents to the jurisdiction of those courts."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Individual Proceedings"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "To the maximum extent permitted by law, you and BarcodesQR agree that claims will be brought only in an individual capacity and not as part of a class, collective, consolidated, representative, or private-attorney-general proceeding."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Jury Trial Waiver"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "To the extent permitted by applicable law, you and BarcodesQR waive the right to a trial by jury for disputes arising from these Terms or the Service."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Mandatory consumer rights that prohibit or restrict these provisions are not waived."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec28",
    "heading": "28. Changes to These Terms",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "We may update these Terms as the Service, our business practices, or applicable laws change."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "For material changes that significantly affect your subscription, payment obligations, or legal rights, we will provide reasonable advance notice by email, through the Service, or by another appropriate method where required by law."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "The “Last Updated” date at the beginning of these Terms identifies the current version."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If you do not agree to a material change, you may stop using the Service and cancel your subscription before the change becomes effective."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Continuing to use the Service after updated Terms take effect constitutes acceptance of the updated Terms to the extent permitted by law."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec29",
    "heading": "29. Communications",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "By creating an account, starting a trial, or purchasing a subscription, you agree that we may send transactional and service-related communications to the email address associated with your account."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "These communications may include:"
          }
        ]
      },
      {
        "kind": "list",
        "ticked": false,
        "items": [
          [
            {
              "t": "Account-access links;"
            }
          ],
          [
            {
              "t": "Verification messages;"
            }
          ],
          [
            {
              "t": "Receipts;"
            }
          ],
          [
            {
              "t": "Billing notices;"
            }
          ],
          [
            {
              "t": "Subscription confirmations;"
            }
          ],
          [
            {
              "t": "Renewal information;"
            }
          ],
          [
            {
              "t": "Cancellation confirmations;"
            }
          ],
          [
            {
              "t": "Security alerts;"
            }
          ],
          [
            {
              "t": "Material changes to the Service or Terms; and"
            }
          ],
          [
            {
              "t": "Customer-support communications."
            }
          ]
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Marketing communications are subject to applicable law and any marketing preferences we provide."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec30",
    "heading": "30. General Provisions",
    "blocks": [
      {
        "kind": "h3",
        "text": "Entire Agreement"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "These Terms, our Privacy Policy, our Refund Policy, and the plan and pricing information disclosed at checkout constitute the agreement between you and BarcodesQR concerning the Service."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Checkout Disclosures"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If these Terms conflict with a specific price, billing interval, trial length, renewal date, or promotional offer expressly presented to you at checkout, the checkout disclosure controls that transaction."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Severability"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "If any provision of these Terms is held invalid or unenforceable, the remaining provisions remain in effect."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "No Waiver"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Our failure to enforce any provision does not waive our right to enforce it later."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Assignment"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "You may not assign these Terms without our prior written consent."
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "We may assign these Terms to an affiliate, successor, purchaser, or other entity in connection with a merger, acquisition, restructuring, financing, or sale of all or part of our business."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "Relationship"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "These Terms do not create a partnership, employment relationship, joint venture, franchise, or agency relationship between you and BarcodesQR."
          }
        ]
      },
      {
        "kind": "h3",
        "text": "English Version"
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Translations may be provided for convenience. Unless applicable law requires otherwise, the English-language version controls if a translation conflicts with the English version."
          }
        ]
      }
    ]
  },
  {
    "id": "trmSec31",
    "heading": "31. Contact Us",
    "blocks": [
      {
        "kind": "p",
        "body": [
          {
            "t": "Questions regarding these Terms or the Service may be directed to:"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "General Support:",
            "strong": true
          },
          {
            "br": true
          },
          {
            "t": " "
          },
          {
            "t": "help@barcodesqr.com",
            "href": "mailto:help@barcodesqr.com"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Billing and Refunds:",
            "strong": true
          },
          {
            "br": true
          },
          {
            "t": " "
          },
          {
            "t": "support@barcodesqr.com",
            "href": "mailto:support@barcodesqr.com"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Privacy:",
            "strong": true
          },
          {
            "br": true
          },
          {
            "t": " "
          },
          {
            "t": "privacy@barcodesqr.com",
            "href": "mailto:privacy@barcodesqr.com"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Legal Entity:",
            "strong": true
          },
          {
            "br": true
          },
          {
            "t": " [LEGAL ENTITY NAME]"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Registered Address:",
            "strong": true
          },
          {
            "br": true
          },
          {
            "t": " [REGISTERED ADDRESS]"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "Legal Notices:",
            "strong": true
          },
          {
            "br": true
          },
          {
            "t": " [LEGAL EMAIL ADDRESS]"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "BarcodesQR"
          },
          {
            "br": true
          },
          {
            "t": " "
          },
          {
            "t": "https://www.barcodesqr.com",
            "href": "https://www.barcodesqr.com"
          }
        ]
      },
      {
        "kind": "p",
        "body": [
          {
            "t": "© 2026 BarcodesQR. All rights reserved."
          }
        ]
      }
    ]
  }
];
