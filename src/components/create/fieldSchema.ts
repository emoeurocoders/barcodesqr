/**
 * Per-type field definitions for step 2 of the create flow.
 *
 * Mirrors the shape the live creator uses: each type maps to an ordered list
 * of fields, optionally grouped into sections, with `half` marking fields
 * that share a row and `showIf` gating one field on another's value.
 *
 * Generated from the live schema — edit deliberately, not by hand-tweaking.
 */

export type FieldType =
  | "url" | "text" | "textarea" | "tel" | "email" | "phone-intl"
  | "select" | "checkbox" | "info" | "file" | "segment" | "country"
  | "datetime-local" | "links" | "date";

export type Field = {
  name: string;
  labelKey: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  half?: boolean;
  section?: string;
  tip?: string;
  options?: { value: string; label: string }[];
  showIf?: Record<string, unknown>;
  accept?: string;
  maxSizeMb?: number;
  formats?: string;
  /** Crop shape offered for image uploads. */
  adjustable?: "circle" | "wide";
  hintKey?: string;
  /** Placeholder that follows another field's value, e.g. the payment provider. */
  placeholderFrom?: {
    field: string;
    map: Record<string, string>;
    fallback?: string;
  };
};

/** Human labels for each field key. */
export const fieldLabels: Record<string, string> = {
  "reviewUrl": "Google review link",
  "businessName": "Business name",
  "reviewPrompt": "Message shown to customers",
  "websiteUrl": "Enter your website",
  "wifiRouter": "Can't find these details? Check the sticker on your router — it usually lists the network name, password, and security type.",
  "feedbackRedirect": "Scanning sends people straight to your link — a survey, review page, or any feedback form.",
  "paymentRedirect": "Payments are handled by your chosen provider. BarcodesQR simply sends scanners to your payment page.",
  "required": "Required",
  "firstName": "First name",
  "lastName": "Last name",
  "organization": "Organization",
  "jobTitle": "Job title",
  "phone": "Phone",
  "email": "Email",
  "website": "Website",
  "address": "Address",
  "summary": "Summary",
  "mobile": "Mobile",
  "work": "Work",
  "fax": "Fax",
  "role": "Role",
  "street": "Street",
  "city": "City",
  "state": "State",
  "zip": "ZIP",
  "country": "Country",
  "profilePhoto": "Profile picture",
  "instagram": "Instagram",
  "facebook": "Facebook",
  "linkedin": "LinkedIn",
  "x": "X",
  "youtube": "YouTube",
  "tiktok": "TikTok",
  "links": "Your links",
  "paymentProvider": "Payment provider",
  "paymentLink": "Payment link",
  "ssid": "Network name (SSID)",
  "password": "Network password",
  "encryption": "Security type",
  "hidden": "WiFi is hidden (not visible to others)",
  "subject": "Subject",
  "message": "Message",
  "body": "Body",
  "to": "To",
  "text": "Text",
  "iosUrl": "iOS App Store URL",
  "androidUrl": "Google Play URL",
  "fallbackUrl": "Fallback URL",
  "title": "Title",
  "description": "Description",
  "discount": "Discount",
  "code": "Coupon code",
  "terms": "Terms",
  "expiry": "Expiry date",
  "eventTitle": "Event title",
  "startsAt": "Starts at",
  "endsAt": "Ends at",
  "locationAddress": "Enter a location or address",
  "smsMessage": "Pre-filled SMS",
  "waNumber": "WhatsApp number",
  "waMessage": "Pre-typed message",
  "headline": "Headline",
  "pdf": "PDF",
  "image": "Image",
  "video": "Video",
  "audio": "Audio",
  "addressMode": "Address type",
  "addressUrl": "Address link",
  "feedbackUrl": "Enter your feedback link",
  "selectCountry": "Select country",
  "whatsapp": "WhatsApp",
  "messenger": "Messenger",
  "snapchat": "Snapchat",
  "reddit": "Reddit",
  "pinterest": "Pinterest",
  "telegram": "Telegram",
  "wechat": "WeChat",
  "viber": "Viber",
  "line": "LINE",
  "addLink": "Add new link",
  "removeLink": "Remove link",
  "linkLogo": "Link logo (optional)",
  "linkName": "Name",
  "linkUrl": "URL"
};

/** Section headings and their sub-labels, used to group longer forms. */
/**
 * The copy behind each field's ⓘ. Keyed by a field's `tip`, which is a
 * separate namespace from `labelKey` — several fields point both at the same
 * key, and the label and the explanation are not the same sentence.
 */
export const fieldTips: Record<string, string> = {
  "websiteUrl": "The link people open when they scan your code.",
  "wifiSsid": "Your network name (SSID) — usually printed on the router.",
  "wifiSecurity": "Most modern routers use WPA/WPA2 — pick that if unsure.",
  "wifiPassword": "Scanners connect automatically using this password.",
  "emailTo": "The address that receives the email when scanned.",
  "emailSubject": "A preset subject line. Optional — the scanner can change it.",
  "emailBody": "A pre-written message. Optional — the scanner can edit it.",
  "smsPhone": "The number people text after scanning.",
  "smsMessage": "Pre-filled message text — the scanner can edit before sending.",
  "waPhone": "The number people message on WhatsApp after scanning.",
  "waMessage": "Pre-filled chat text — the scanner just taps send.",
  "phoneDial": "The number people call after scanning.",
  "iosUrl": "Where iPhone users are sent — your Apple App Store page.",
  "androidUrl": "Where Android users are sent — your Google Play page.",
  "fallbackUrl": "Where everyone else lands (desktop and other devices).",
  "paymentProvider": "The payment service you use to collect money.",
  "paymentLink": "Your provider's checkout or payment page — we just redirect to it.",
  "feedbackUrl": "Your survey, review, or form link — scanners go straight there.",
  "locationAddress": "The place that opens in Google Maps when scanned.",
};

/** Copy shown as small print under a field, keyed by its `hintKey`. */
export const fieldHints: Record<string, string> = {
  "paymentLink":
    "Paste your payment link — payments are completed on your provider's page.",
};

/** Dial codes offered beside every international phone field. */
export const dialCodes: { value: string; label: string }[] = [
  { value: "+1", label: "\uD83C\uDDFA\uD83C\uDDF8 +1" },
  { value: "+1-CA", label: "\uD83C\uDDE8\uD83C\uDDE6 +1" },
  { value: "+44", label: "\uD83C\uDDEC\uD83C\uDDE7 +44" },
  { value: "+353", label: "\uD83C\uDDEE\uD83C\uDDEA +353" },
  { value: "+61", label: "\uD83C\uDDE6\uD83C\uDDFA +61" },
  { value: "+64", label: "\uD83C\uDDF3\uD83C\uDDFF +64" },
  { value: "+49", label: "\uD83C\uDDE9\uD83C\uDDEA +49" },
  { value: "+33", label: "\uD83C\uDDEB\uD83C\uDDF7 +33" },
  { value: "+34", label: "\uD83C\uDDEA\uD83C\uDDF8 +34" },
  { value: "+351", label: "\uD83C\uDDF5\uD83C\uDDF9 +351" },
  { value: "+39", label: "\uD83C\uDDEE\uD83C\uDDF9 +39" },
  { value: "+31", label: "\uD83C\uDDF3\uD83C\uDDF1 +31" },
  { value: "+32", label: "\uD83C\uDDE7\uD83C\uDDEA +32" },
  { value: "+41", label: "\uD83C\uDDE8\uD83C\uDDED +41" },
  { value: "+43", label: "\uD83C\uDDE6\uD83C\uDDF9 +43" },
  { value: "+46", label: "\uD83C\uDDF8\uD83C\uDDEA +46" },
  { value: "+47", label: "\uD83C\uDDF3\uD83C\uDDF4 +47" },
  { value: "+45", label: "\uD83C\uDDE9\uD83C\uDDF0 +45" },
  { value: "+358", label: "\uD83C\uDDEB\uD83C\uDDEE +358" },
  { value: "+48", label: "\uD83C\uDDF5\uD83C\uDDF1 +48" },
  { value: "+91", label: "\uD83C\uDDEE\uD83C\uDDF3 +91" },
  { value: "+65", label: "\uD83C\uDDF8\uD83C\uDDEC +65" },
  { value: "+81", label: "\uD83C\uDDEF\uD83C\uDDF5 +81" },
  { value: "+82", label: "\uD83C\uDDF0\uD83C\uDDF7 +82" },
  { value: "+86", label: "\uD83C\uDDE8\uD83C\uDDF3 +86" },
  { value: "+971", label: "\uD83C\uDDE6\uD83C\uDDEA +971" },
  { value: "+27", label: "\uD83C\uDDFF\uD83C\uDDE6 +27" },
  { value: "+55", label: "\uD83C\uDDE7\uD83C\uDDF7 +55" },
  { value: "+52", label: "\uD83C\uDDF2\uD83C\uDDFD +52" },
  { value: "+54", label: "\uD83C\uDDE6\uD83C\uDDF7 +54" },
];

export const sections: Record<string, { title: string; desc: string }> = {
  "personal": {
    "title": "Personal information",
    "desc": "Fill in your name"
  },
  "photo": {
    "title": "Profile picture",
    "desc": "Add a profile photo"
  },
  "contact": {
    "title": "Contact details",
    "desc": "Phone, mobile and more"
  },
  "company": {
    "title": "Company information",
    "desc": "Where you work"
  },
  "address": {
    "title": "Address",
    "desc": "Your location"
  },
  "social": {
    "title": "Social media",
    "desc": "Add your social channels"
  },
  "info": {
    "title": "Information",
    "desc": "The basics"
  },
  "basic": {
    "title": "Basic information",
    "desc": "Name and description"
  },
  "links": {
    "title": "Your links",
    "desc": "Add your custom links below"
  },
  "image": {
    "title": "Image",
    "desc": "Upload a cover image"
  }
};

export const fieldSchema: Record<string, Field[]> = {
  "review": [
    {
      "name": "reviewUrl",
      "labelKey": "reviewUrl",
      "type": "url",
      "required": true,
      "placeholder": "https://g.page/r/.../review",
      "tip": "reviewUrl"
    },
    {
      "name": "businessName",
      "labelKey": "businessName",
      "type": "text",
      "maxLength": 40,
      "placeholder": "The Matcha Den"
    },
    {
      "name": "reviewPrompt",
      "labelKey": "reviewPrompt",
      "type": "textarea",
      "maxLength": 200,
      "placeholder": "Enjoyed your visit? A quick review helps us a lot."
    }
  ],
  "website": [
    {
      "name": "url",
      "labelKey": "websiteUrl",
      "type": "url",
      "required": true,
      "placeholder": "https://",
      "tip": "websiteUrl"
    }
  ],
  "text": [
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "maxLength": 40
    },
    {
      "name": "text",
      "labelKey": "text",
      "type": "textarea",
      "required": true
    }
  ],
  "phone": [
    {
      "name": "phone",
      "labelKey": "phone",
      "type": "tel",
      "required": true,
      "placeholder": "+1 555 555 0123",
      "tip": "phoneDial"
    }
  ],
  "email": [
    {
      "name": "to",
      "labelKey": "to",
      "type": "email",
      "required": true,
      "half": true,
      "placeholder": "email@example.com",
      "tip": "emailTo"
    },
    {
      "name": "subject",
      "labelKey": "subject",
      "type": "text",
      "half": true,
      "placeholder": "e.g. Hey there…",
      "tip": "emailSubject"
    },
    {
      "name": "body",
      "labelKey": "body",
      "type": "textarea",
      "maxLength": 500,
      "placeholder": "Write your message…",
      "tip": "emailBody"
    }
  ],
  "sms": [
    {
      "name": "phone",
      "labelKey": "phone",
      "type": "phone-intl",
      "required": true,
      "placeholder": "+1",
      "tip": "smsPhone"
    },
    {
      "name": "message",
      "labelKey": "smsMessage",
      "type": "textarea",
      "maxLength": 160,
      "placeholder": "Type your message here…",
      "tip": "smsMessage"
    }
  ],
  "whatsapp": [
    {
      "name": "phone",
      "labelKey": "waNumber",
      "type": "phone-intl",
      "required": true,
      "placeholder": "+1",
      "tip": "waPhone"
    },
    {
      "name": "message",
      "labelKey": "waMessage",
      "type": "textarea",
      "maxLength": 160,
      "placeholder": "Hi! 👋 I just scanned your QR code and I'd love to hear more — can you fill me in?",
      "tip": "waMessage"
    }
  ],
  "wifi": [
    {
      "name": "ssid",
      "labelKey": "ssid",
      "type": "text",
      "required": true,
      "maxLength": 40,
      "placeholder": "CozyCornerWiFi",
      "tip": "wifiSsid"
    },
    {
      "name": "encryption",
      "labelKey": "encryption",
      "type": "select",
      "tip": "wifiSecurity",
      "options": [
        {
          "value": "WPA",
          "label": "WPA/WPA2 (recommended)"
        },
        {
          "value": "WEP",
          "label": "WEP"
        },
        {
          "value": "nopass",
          "label": "None"
        }
      ]
    },
    {
      "name": "password",
      "labelKey": "password",
      "type": "text",
      "required": true,
      "maxLength": 40,
      "placeholder": "Cappuccino123",
      "tip": "wifiPassword",
      "showIf": {
        "field": "encryption",
        "notEquals": "nopass"
      }
    },
    {
      "name": "hidden",
      "labelKey": "hidden",
      "type": "checkbox"
    },
    {
      "name": "wifiInfo",
      "labelKey": "wifiRouter",
      "type": "info"
    }
  ],
  "location": [
    {
      "name": "address",
      "labelKey": "locationAddress",
      "type": "text",
      "required": true,
      "placeholder": "Type your address here",
      "tip": "locationAddress"
    }
  ],
  "vcard": [
    {
      "name": "firstName",
      "labelKey": "firstName",
      "type": "text",
      "required": true,
      "half": true,
      "maxLength": 40,
      "placeholder": "John",
      "section": "personal"
    },
    {
      "name": "lastName",
      "labelKey": "lastName",
      "type": "text",
      "required": true,
      "half": true,
      "maxLength": 40,
      "placeholder": "Doe",
      "section": "personal"
    },
    {
      "name": "photo",
      "labelKey": "profilePhoto",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "section": "photo",
      "adjustable": "circle"
    },
    {
      "name": "phone",
      "labelKey": "phone",
      "type": "phone-intl",
      "half": true,
      "section": "contact"
    },
    {
      "name": "mobile",
      "labelKey": "mobile",
      "type": "phone-intl",
      "half": true,
      "section": "contact"
    },
    {
      "name": "work",
      "labelKey": "work",
      "type": "phone-intl",
      "half": true,
      "section": "contact"
    },
    {
      "name": "fax",
      "labelKey": "fax",
      "type": "phone-intl",
      "half": true,
      "section": "contact"
    },
    {
      "name": "organization",
      "labelKey": "organization",
      "type": "text",
      "half": true,
      "maxLength": 40,
      "placeholder": "Acme Inc.",
      "section": "company"
    },
    {
      "name": "jobTitle",
      "labelKey": "role",
      "type": "text",
      "half": true,
      "maxLength": 40,
      "placeholder": "Software Engineer",
      "section": "company"
    },
    {
      "name": "website",
      "labelKey": "website",
      "type": "url",
      "half": true,
      "maxLength": 32,
      "placeholder": "https://example.com",
      "section": "company"
    },
    {
      "name": "email",
      "labelKey": "email",
      "type": "email",
      "half": true,
      "maxLength": 40,
      "placeholder": "john.doe@example.com",
      "section": "company"
    },
    {
      "name": "summary",
      "labelKey": "summary",
      "type": "textarea",
      "maxLength": 200,
      "placeholder": "e.g. About my company",
      "section": "company"
    },
    {
      "name": "addressMode",
      "labelKey": "addressMode",
      "type": "segment",
      "section": "address",
      "options": [
        {
          "value": "manual",
          "label": "Manual"
        },
        {
          "value": "url",
          "label": "URL"
        }
      ]
    },
    {
      "name": "street",
      "labelKey": "street",
      "type": "text",
      "half": true,
      "maxLength": 40,
      "placeholder": "123 Main Street",
      "section": "address",
      "showIf": {
        "field": "addressMode",
        "notEquals": "url"
      }
    },
    {
      "name": "zip",
      "labelKey": "zip",
      "type": "text",
      "half": true,
      "maxLength": 40,
      "placeholder": "10001",
      "section": "address",
      "showIf": {
        "field": "addressMode",
        "notEquals": "url"
      }
    },
    {
      "name": "city",
      "labelKey": "city",
      "type": "text",
      "half": true,
      "maxLength": 40,
      "placeholder": "New York",
      "section": "address",
      "showIf": {
        "field": "addressMode",
        "notEquals": "url"
      }
    },
    {
      "name": "state",
      "labelKey": "state",
      "type": "text",
      "half": true,
      "maxLength": 40,
      "placeholder": "NY",
      "section": "address",
      "showIf": {
        "field": "addressMode",
        "notEquals": "url"
      }
    },
    {
      "name": "country",
      "labelKey": "country",
      "type": "country",
      "section": "address",
      "showIf": {
        "field": "addressMode",
        "notEquals": "url"
      }
    },
    {
      "name": "addressUrl",
      "labelKey": "addressUrl",
      "type": "url",
      "placeholder": "https://maps.google.com/…",
      "section": "address",
      "showIf": {
        "field": "addressMode",
        "equals": "url"
      }
    },
    {
      "name": "facebook",
      "labelKey": "facebook",
      "type": "url",
      "half": true,
      "placeholder": "https://facebook.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "whatsapp",
      "labelKey": "whatsapp",
      "type": "text",
      "half": true,
      "placeholder": "+1 234 567 890",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "instagram",
      "labelKey": "instagram",
      "type": "url",
      "half": true,
      "placeholder": "https://instagram.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "youtube",
      "labelKey": "youtube",
      "type": "url",
      "half": true,
      "placeholder": "https://youtube.com/@username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "tiktok",
      "labelKey": "tiktok",
      "type": "url",
      "half": true,
      "placeholder": "https://tiktok.com/@username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "messenger",
      "labelKey": "messenger",
      "type": "url",
      "half": true,
      "placeholder": "https://m.me/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "snapchat",
      "labelKey": "snapchat",
      "type": "url",
      "half": true,
      "placeholder": "https://snapchat.com/add/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "linkedin",
      "labelKey": "linkedin",
      "type": "url",
      "half": true,
      "placeholder": "https://linkedin.com/in/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "x",
      "labelKey": "x",
      "type": "url",
      "half": true,
      "placeholder": "https://x.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "reddit",
      "labelKey": "reddit",
      "type": "url",
      "half": true,
      "placeholder": "https://reddit.com/user/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "pinterest",
      "labelKey": "pinterest",
      "type": "url",
      "half": true,
      "placeholder": "https://pinterest.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "telegram",
      "labelKey": "telegram",
      "type": "url",
      "half": true,
      "placeholder": "https://t.me/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "wechat",
      "labelKey": "wechat",
      "type": "text",
      "half": true,
      "placeholder": "WeChat ID",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "viber",
      "labelKey": "viber",
      "type": "text",
      "half": true,
      "placeholder": "+1 234 567 890",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "line",
      "labelKey": "line",
      "type": "text",
      "half": true,
      "placeholder": "LINE ID",
      "section": "social",
      "maxLength": 100
    }
  ],
  "applink": [
    {
      "name": "iosUrl",
      "labelKey": "iosUrl",
      "type": "url",
      "placeholder": "https://apps.apple.com/…",
      "tip": "iosUrl"
    },
    {
      "name": "androidUrl",
      "labelKey": "androidUrl",
      "type": "url",
      "placeholder": "https://play.google.com/…",
      "tip": "androidUrl"
    },
    {
      "name": "fallbackUrl",
      "labelKey": "fallbackUrl",
      "type": "url",
      "required": true,
      "placeholder": "https://",
      "tip": "fallbackUrl"
    }
  ],
  "pdf": [
    {
      "name": "file",
      "labelKey": "pdf",
      "type": "file",
      "accept": "application/pdf,.pdf",
      "required": true,
      "maxSizeMb": 20,
      "formats": "PDF"
    },
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "maxLength": 40
    },
    {
      "name": "description",
      "labelKey": "description",
      "type": "textarea",
      "maxLength": 200
    }
  ],
  "image": [
    {
      "name": "file",
      "labelKey": "image",
      "type": "file",
      "accept": "image/*,.png,.jpg,.jpeg,.webp,.heic,.heif",
      "required": true,
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc."
    },
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "maxLength": 40
    }
  ],
  "video": [
    {
      "name": "file",
      "labelKey": "video",
      "type": "file",
      "accept": "video/*,.mp4,.mov,.m4v,.avi,.webm",
      "required": true,
      "maxSizeMb": 50,
      "formats": "MP4, MOV, AVI, etc."
    },
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "maxLength": 40
    }
  ],
  "mp3": [
    {
      "name": "file",
      "labelKey": "audio",
      "type": "file",
      "accept": "audio/*,.mp3,.m4a,.aac,.wav,.ogg,.flac,.aiff",
      "required": true,
      "maxSizeMb": 20,
      "formats": "MP3, M4A, WAV, etc."
    },
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "maxLength": 40
    }
  ],
  "event": [
    {
      "name": "eventTitle",
      "labelKey": "eventTitle",
      "type": "text",
      "required": true,
      "maxLength": 40
    },
    {
      "name": "location",
      "labelKey": "address",
      "type": "text"
    },
    {
      "name": "startsAt",
      "labelKey": "startsAt",
      "type": "datetime-local",
      "required": true,
      "half": true
    },
    {
      "name": "endsAt",
      "labelKey": "endsAt",
      "type": "datetime-local",
      "half": true
    },
    {
      "name": "description",
      "labelKey": "description",
      "type": "textarea",
      "maxLength": 200
    }
  ],
  "social": [
    {
      "name": "headline",
      "labelKey": "headline",
      "type": "text",
      "required": true,
      "maxLength": 40,
      "placeholder": "e.g. Olivia Bennett",
      "section": "info"
    },
    {
      "name": "description",
      "labelKey": "description",
      "type": "textarea",
      "maxLength": 200,
      "placeholder": "e.g. About me",
      "section": "info"
    },
    {
      "name": "photo",
      "labelKey": "profilePhoto",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "section": "photo",
      "adjustable": "circle"
    },
    {
      "name": "facebook",
      "labelKey": "facebook",
      "type": "url",
      "half": true,
      "placeholder": "https://facebook.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "whatsapp",
      "labelKey": "whatsapp",
      "type": "text",
      "half": true,
      "placeholder": "+1 234 567 890",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "instagram",
      "labelKey": "instagram",
      "type": "url",
      "half": true,
      "placeholder": "https://instagram.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "youtube",
      "labelKey": "youtube",
      "type": "url",
      "half": true,
      "placeholder": "https://youtube.com/@username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "tiktok",
      "labelKey": "tiktok",
      "type": "url",
      "half": true,
      "placeholder": "https://tiktok.com/@username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "messenger",
      "labelKey": "messenger",
      "type": "url",
      "half": true,
      "placeholder": "https://m.me/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "snapchat",
      "labelKey": "snapchat",
      "type": "url",
      "half": true,
      "placeholder": "https://snapchat.com/add/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "linkedin",
      "labelKey": "linkedin",
      "type": "url",
      "half": true,
      "placeholder": "https://linkedin.com/in/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "x",
      "labelKey": "x",
      "type": "url",
      "half": true,
      "placeholder": "https://x.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "reddit",
      "labelKey": "reddit",
      "type": "url",
      "half": true,
      "placeholder": "https://reddit.com/user/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "pinterest",
      "labelKey": "pinterest",
      "type": "url",
      "half": true,
      "placeholder": "https://pinterest.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "telegram",
      "labelKey": "telegram",
      "type": "url",
      "half": true,
      "placeholder": "https://t.me/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "wechat",
      "labelKey": "wechat",
      "type": "text",
      "half": true,
      "placeholder": "WeChat ID",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "viber",
      "labelKey": "viber",
      "type": "text",
      "half": true,
      "placeholder": "+1 234 567 890",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "line",
      "labelKey": "line",
      "type": "text",
      "half": true,
      "placeholder": "LINE ID",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "links",
      "labelKey": "links",
      "type": "links",
      "section": "social"
    }
  ],
  "menu": [
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "required": true,
      "maxLength": 40
    },
    {
      "name": "description",
      "labelKey": "description",
      "type": "textarea",
      "maxLength": 200
    },
    {
      "name": "items",
      "labelKey": "text",
      "type": "textarea",
      "placeholder": "One item per line: Name | Price | Description"
    }
  ],
  "business": [
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "required": true,
      "maxLength": 40,
      "section": "basic"
    },
    {
      "name": "description",
      "labelKey": "description",
      "type": "textarea",
      "maxLength": 200,
      "section": "basic"
    },
    {
      "name": "phone",
      "labelKey": "phone",
      "type": "phone-intl",
      "half": true,
      "section": "contact"
    },
    {
      "name": "email",
      "labelKey": "email",
      "type": "email",
      "half": true,
      "section": "contact"
    },
    {
      "name": "website",
      "labelKey": "website",
      "type": "url",
      "half": true,
      "section": "contact"
    },
    {
      "name": "address",
      "labelKey": "address",
      "type": "text",
      "half": true,
      "section": "contact"
    }
  ],
  "coupon": [
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "required": true,
      "maxLength": 40
    },
    {
      "name": "discount",
      "labelKey": "discount",
      "type": "text",
      "half": true
    },
    {
      "name": "code",
      "labelKey": "code",
      "type": "text",
      "half": true
    },
    {
      "name": "terms",
      "labelKey": "terms",
      "type": "textarea",
      "maxLength": 200
    },
    {
      "name": "expiry",
      "labelKey": "expiry",
      "type": "date"
    }
  ],
  "feedback": [
    {
      "name": "url",
      "labelKey": "feedbackUrl",
      "type": "url",
      "required": true,
      "placeholder": "https://",
      "tip": "feedbackUrl"
    },
    {
      "name": "feedbackInfo",
      "labelKey": "feedbackRedirect",
      "type": "info"
    }
  ],
  "multilink": [
    {
      "name": "title",
      "labelKey": "title",
      "type": "text",
      "required": true,
      "maxLength": 40,
      "placeholder": "e.g. My Business",
      "section": "basic"
    },
    {
      "name": "description",
      "labelKey": "description",
      "type": "textarea",
      "maxLength": 200,
      "placeholder": "e.g. About my business",
      "section": "basic"
    },
    {
      "name": "image",
      "labelKey": "image",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "section": "image",
      "adjustable": "wide"
    },
    {
      "name": "links",
      "labelKey": "links",
      "type": "links",
      "section": "links"
    },
    {
      "name": "facebook",
      "labelKey": "facebook",
      "type": "url",
      "half": true,
      "placeholder": "https://facebook.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "whatsapp",
      "labelKey": "whatsapp",
      "type": "text",
      "half": true,
      "placeholder": "+1 234 567 890",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "instagram",
      "labelKey": "instagram",
      "type": "url",
      "half": true,
      "placeholder": "https://instagram.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "youtube",
      "labelKey": "youtube",
      "type": "url",
      "half": true,
      "placeholder": "https://youtube.com/@username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "tiktok",
      "labelKey": "tiktok",
      "type": "url",
      "half": true,
      "placeholder": "https://tiktok.com/@username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "messenger",
      "labelKey": "messenger",
      "type": "url",
      "half": true,
      "placeholder": "https://m.me/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "snapchat",
      "labelKey": "snapchat",
      "type": "url",
      "half": true,
      "placeholder": "https://snapchat.com/add/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "linkedin",
      "labelKey": "linkedin",
      "type": "url",
      "half": true,
      "placeholder": "https://linkedin.com/in/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "x",
      "labelKey": "x",
      "type": "url",
      "half": true,
      "placeholder": "https://x.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "reddit",
      "labelKey": "reddit",
      "type": "url",
      "half": true,
      "placeholder": "https://reddit.com/user/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "pinterest",
      "labelKey": "pinterest",
      "type": "url",
      "half": true,
      "placeholder": "https://pinterest.com/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "telegram",
      "labelKey": "telegram",
      "type": "url",
      "half": true,
      "placeholder": "https://t.me/username",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "wechat",
      "labelKey": "wechat",
      "type": "text",
      "half": true,
      "placeholder": "WeChat ID",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "viber",
      "labelKey": "viber",
      "type": "text",
      "half": true,
      "placeholder": "+1 234 567 890",
      "section": "social",
      "maxLength": 100
    },
    {
      "name": "line",
      "labelKey": "line",
      "type": "text",
      "half": true,
      "placeholder": "LINE ID",
      "section": "social",
      "maxLength": 100
    }
  ],
  "payment": [
    {
      "name": "provider",
      "labelKey": "paymentProvider",
      "type": "select",
      "required": true,
      "placeholder": "Select a payment provider…",
      "tip": "paymentProvider",
      "options": [
        {
          "value": "paypal",
          "label": "PayPal"
        },
        {
          "value": "stripe",
          "label": "Stripe"
        },
        {
          "value": "cashapp",
          "label": "CashApp"
        },
        {
          "value": "braintree",
          "label": "Braintree"
        },
        {
          "value": "square",
          "label": "Square"
        },
        {
          "value": "payoneer",
          "label": "Payoneer"
        },
        {
          "value": "venmo",
          "label": "Venmo"
        },
        {
          "value": "verifone",
          "label": "Verifone (2Checkout)"
        },
        {
          "value": "applepay",
          "label": "Apple Pay"
        },
        {
          "value": "googlepay",
          "label": "Google Pay"
        },
        {
          "value": "adyen",
          "label": "Adyen"
        },
        {
          "value": "klarna",
          "label": "Klarna"
        },
        {
          "value": "cartesbancaires",
          "label": "Cartes Bancaires"
        },
        {
          "value": "giropay",
          "label": "Giropay"
        },
        {
          "value": "other",
          "label": "Other"
        }
      ]
    },
    {
      "name": "paymentLink",
      "labelKey": "paymentLink",
      "type": "url",
      "required": true,
      "tip": "paymentLink",
      "hintKey": "paymentLink",
      "placeholderFrom": {
        "field": "provider",
        "map": {
          "paypal": "e.g. https://paypal.me/yourname",
          "cashapp": "e.g. https://cash.app/$yourname",
          "venmo": "e.g. https://venmo.com/u/yourname",
          "stripe": "e.g. https://buy.stripe.com/…"
        },
        "fallback": "e.g. https://yourdomain.com/checkout"
      }
    },
    {
      "name": "paymentInfo",
      "labelKey": "paymentRedirect",
      "type": "info"
    }
  ]
};
