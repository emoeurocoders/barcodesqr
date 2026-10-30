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
  | "datetime-local" | "links" | "date" | "time";

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
  /**
   * Links fields only: at least one complete row (name + URL) is required.
   * A flag rather than `required`, which would also star the label.
   */
  requireOneLink?: boolean;
  /**
   * The most UTF-8 bytes the field may hold, for text that goes into the code
   * itself — past it the code cannot be drawn (see QR_TEXT_MAX_BYTES).
   */
  maxBytes?: number;
  /** Fewest characters accepted, with the message when short (or long). */
  minLength?: number;
  lengthMessage?: string;
  /** Placeholder that follows another field's value, e.g. the payment provider. */
  placeholderFrom?: {
    field: string;
    map: Record<string, string>;
    fallback?: string;
  };
};

/** Human labels for each field key. */
export const fieldLabels: Record<string, string> = {
  "reviewUrl": "Enter your Google review link",
  "businessName": "Business name",
  "coverPhoto": "Cover photo",
  "reviewPrompt": "Message shown to customers",
  "websiteUrl": "Enter your website",
  "reviewRedirect": "Scanning sends customers directly to your Google review page so they can leave a rating and review.",
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
  "linkUrl": "URL",
  "cover": "Cover image",
  "logo": "Logo",
  "opensAt": "Opens at",
  "closesAt": "Closes at",
  "category": "Category / Section name"
};

/** Section headings and their sub-labels, used to group longer forms. */
/**
 * The copy behind each field's ⓘ. Keyed by a field's `tip`, which is a
 * separate namespace from `labelKey` — several fields point both at the same
 * key, and the label and the explanation are not the same sentence.
 */
export const fieldTips: Record<string, string> = {
  "websiteUrl": "The link people open when they scan your code.",
  "reviewUrl": "Paste the review link from your Google Business Profile.",
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

/**
 * Dial codes offered beside every international phone field. `region` is the
 * two-letter country create_mobile_whatsapp.html prints in its own labels
 * ("🇺🇸 US +1") and uses to preselect the visitor's country; desktop's labels
 * stay flag + code.
 */
export const dialCodes: { value: string; label: string; region: string }[] = [
  { value: "+1", label: "\uD83C\uDDFA\uD83C\uDDF8 +1", region: "US" },
  { value: "+1-CA", label: "\uD83C\uDDE8\uD83C\uDDE6 +1", region: "CA" },
  { value: "+44", label: "\uD83C\uDDEC\uD83C\uDDE7 +44", region: "GB" },
  { value: "+353", label: "\uD83C\uDDEE\uD83C\uDDEA +353", region: "IE" },
  { value: "+61", label: "\uD83C\uDDE6\uD83C\uDDFA +61", region: "AU" },
  { value: "+64", label: "\uD83C\uDDF3\uD83C\uDDFF +64", region: "NZ" },
  { value: "+49", label: "\uD83C\uDDE9\uD83C\uDDEA +49", region: "DE" },
  { value: "+33", label: "\uD83C\uDDEB\uD83C\uDDF7 +33", region: "FR" },
  { value: "+34", label: "\uD83C\uDDEA\uD83C\uDDF8 +34", region: "ES" },
  { value: "+351", label: "\uD83C\uDDF5\uD83C\uDDF9 +351", region: "PT" },
  { value: "+39", label: "\uD83C\uDDEE\uD83C\uDDF9 +39", region: "IT" },
  { value: "+31", label: "\uD83C\uDDF3\uD83C\uDDF1 +31", region: "NL" },
  { value: "+32", label: "\uD83C\uDDE7\uD83C\uDDEA +32", region: "BE" },
  { value: "+41", label: "\uD83C\uDDE8\uD83C\uDDED +41", region: "CH" },
  { value: "+43", label: "\uD83C\uDDE6\uD83C\uDDF9 +43", region: "AT" },
  { value: "+46", label: "\uD83C\uDDF8\uD83C\uDDEA +46", region: "SE" },
  { value: "+47", label: "\uD83C\uDDF3\uD83C\uDDF4 +47", region: "NO" },
  { value: "+45", label: "\uD83C\uDDE9\uD83C\uDDF0 +45", region: "DK" },
  { value: "+358", label: "\uD83C\uDDEB\uD83C\uDDEE +358", region: "FI" },
  { value: "+48", label: "\uD83C\uDDF5\uD83C\uDDF1 +48", region: "PL" },
  { value: "+91", label: "\uD83C\uDDEE\uD83C\uDDF3 +91", region: "IN" },
  { value: "+65", label: "\uD83C\uDDF8\uD83C\uDDEC +65", region: "SG" },
  { value: "+81", label: "\uD83C\uDDEF\uD83C\uDDF5 +81", region: "JP" },
  { value: "+82", label: "\uD83C\uDDF0\uD83C\uDDF7 +82", region: "KR" },
  { value: "+86", label: "\uD83C\uDDE8\uD83C\uDDF3 +86", region: "CN" },
  { value: "+971", label: "\uD83C\uDDE6\uD83C\uDDEA +971", region: "AE" },
  { value: "+27", label: "\uD83C\uDDFF\uD83C\uDDE6 +27", region: "ZA" },
  { value: "+55", label: "\uD83C\uDDE7\uD83C\uDDF7 +55", region: "BR" },
  { value: "+52", label: "\uD83C\uDDF2\uD83C\uDDFD +52", region: "MX" },
  { value: "+54", label: "\uD83C\uDDE6\uD83C\uDDF7 +54", region: "AR" },
  // The rest of the world (JB, 2026-10-30: Thailand and the Philippines were
  // missing). The designer's thirty stay first, in their order; the others
  // follow by region code. A code already taken gets the region after it,
  // as their "+1-CA" does.
  { value: "+376", label: "\uD83C\uDDE6\uD83C\uDDE9 +376", region: "AD" },
  { value: "+93", label: "\uD83C\uDDE6\uD83C\uDDEB +93", region: "AF" },
  { value: "+1-AG", label: "\uD83C\uDDE6\uD83C\uDDEC +1", region: "AG" },
  { value: "+1-AI", label: "\uD83C\uDDE6\uD83C\uDDEE +1", region: "AI" },
  { value: "+355", label: "\uD83C\uDDE6\uD83C\uDDF1 +355", region: "AL" },
  { value: "+374", label: "\uD83C\uDDE6\uD83C\uDDF2 +374", region: "AM" },
  { value: "+244", label: "\uD83C\uDDE6\uD83C\uDDF4 +244", region: "AO" },
  { value: "+1-AS", label: "\uD83C\uDDE6\uD83C\uDDF8 +1", region: "AS" },
  { value: "+297", label: "\uD83C\uDDE6\uD83C\uDDFC +297", region: "AW" },
  { value: "+994", label: "\uD83C\uDDE6\uD83C\uDDFF +994", region: "AZ" },
  { value: "+387", label: "\uD83C\uDDE7\uD83C\uDDE6 +387", region: "BA" },
  { value: "+1-BB", label: "\uD83C\uDDE7\uD83C\uDDE7 +1", region: "BB" },
  { value: "+880", label: "\uD83C\uDDE7\uD83C\uDDE9 +880", region: "BD" },
  { value: "+226", label: "\uD83C\uDDE7\uD83C\uDDEB +226", region: "BF" },
  { value: "+359", label: "\uD83C\uDDE7\uD83C\uDDEC +359", region: "BG" },
  { value: "+973", label: "\uD83C\uDDE7\uD83C\uDDED +973", region: "BH" },
  { value: "+257", label: "\uD83C\uDDE7\uD83C\uDDEE +257", region: "BI" },
  { value: "+229", label: "\uD83C\uDDE7\uD83C\uDDEF +229", region: "BJ" },
  { value: "+1-BM", label: "\uD83C\uDDE7\uD83C\uDDF2 +1", region: "BM" },
  { value: "+673", label: "\uD83C\uDDE7\uD83C\uDDF3 +673", region: "BN" },
  { value: "+591", label: "\uD83C\uDDE7\uD83C\uDDF4 +591", region: "BO" },
  { value: "+1-BS", label: "\uD83C\uDDE7\uD83C\uDDF8 +1", region: "BS" },
  { value: "+975", label: "\uD83C\uDDE7\uD83C\uDDF9 +975", region: "BT" },
  { value: "+267", label: "\uD83C\uDDE7\uD83C\uDDFC +267", region: "BW" },
  { value: "+375", label: "\uD83C\uDDE7\uD83C\uDDFE +375", region: "BY" },
  { value: "+501", label: "\uD83C\uDDE7\uD83C\uDDFF +501", region: "BZ" },
  { value: "+243", label: "\uD83C\uDDE8\uD83C\uDDE9 +243", region: "CD" },
  { value: "+236", label: "\uD83C\uDDE8\uD83C\uDDEB +236", region: "CF" },
  { value: "+242", label: "\uD83C\uDDE8\uD83C\uDDEC +242", region: "CG" },
  { value: "+225", label: "\uD83C\uDDE8\uD83C\uDDEE +225", region: "CI" },
  { value: "+682", label: "\uD83C\uDDE8\uD83C\uDDF0 +682", region: "CK" },
  { value: "+56", label: "\uD83C\uDDE8\uD83C\uDDF1 +56", region: "CL" },
  { value: "+237", label: "\uD83C\uDDE8\uD83C\uDDF2 +237", region: "CM" },
  { value: "+57", label: "\uD83C\uDDE8\uD83C\uDDF4 +57", region: "CO" },
  { value: "+506", label: "\uD83C\uDDE8\uD83C\uDDF7 +506", region: "CR" },
  { value: "+53", label: "\uD83C\uDDE8\uD83C\uDDFA +53", region: "CU" },
  { value: "+238", label: "\uD83C\uDDE8\uD83C\uDDFB +238", region: "CV" },
  { value: "+599", label: "\uD83C\uDDE8\uD83C\uDDFC +599", region: "CW" },
  { value: "+357", label: "\uD83C\uDDE8\uD83C\uDDFE +357", region: "CY" },
  { value: "+420", label: "\uD83C\uDDE8\uD83C\uDDFF +420", region: "CZ" },
  { value: "+253", label: "\uD83C\uDDE9\uD83C\uDDEF +253", region: "DJ" },
  { value: "+1-DM", label: "\uD83C\uDDE9\uD83C\uDDF2 +1", region: "DM" },
  { value: "+1-DO", label: "\uD83C\uDDE9\uD83C\uDDF4 +1", region: "DO" },
  { value: "+213", label: "\uD83C\uDDE9\uD83C\uDDFF +213", region: "DZ" },
  { value: "+593", label: "\uD83C\uDDEA\uD83C\uDDE8 +593", region: "EC" },
  { value: "+372", label: "\uD83C\uDDEA\uD83C\uDDEA +372", region: "EE" },
  { value: "+20", label: "\uD83C\uDDEA\uD83C\uDDEC +20", region: "EG" },
  { value: "+291", label: "\uD83C\uDDEA\uD83C\uDDF7 +291", region: "ER" },
  { value: "+251", label: "\uD83C\uDDEA\uD83C\uDDF9 +251", region: "ET" },
  { value: "+679", label: "\uD83C\uDDEB\uD83C\uDDEF +679", region: "FJ" },
  { value: "+500", label: "\uD83C\uDDEB\uD83C\uDDF0 +500", region: "FK" },
  { value: "+691", label: "\uD83C\uDDEB\uD83C\uDDF2 +691", region: "FM" },
  { value: "+298", label: "\uD83C\uDDEB\uD83C\uDDF4 +298", region: "FO" },
  { value: "+241", label: "\uD83C\uDDEC\uD83C\uDDE6 +241", region: "GA" },
  { value: "+1-GD", label: "\uD83C\uDDEC\uD83C\uDDE9 +1", region: "GD" },
  { value: "+995", label: "\uD83C\uDDEC\uD83C\uDDEA +995", region: "GE" },
  { value: "+594", label: "\uD83C\uDDEC\uD83C\uDDEB +594", region: "GF" },
  { value: "+44-GG", label: "\uD83C\uDDEC\uD83C\uDDEC +44", region: "GG" },
  { value: "+233", label: "\uD83C\uDDEC\uD83C\uDDED +233", region: "GH" },
  { value: "+350", label: "\uD83C\uDDEC\uD83C\uDDEE +350", region: "GI" },
  { value: "+299", label: "\uD83C\uDDEC\uD83C\uDDF1 +299", region: "GL" },
  { value: "+220", label: "\uD83C\uDDEC\uD83C\uDDF2 +220", region: "GM" },
  { value: "+224", label: "\uD83C\uDDEC\uD83C\uDDF3 +224", region: "GN" },
  { value: "+590", label: "\uD83C\uDDEC\uD83C\uDDF5 +590", region: "GP" },
  { value: "+240", label: "\uD83C\uDDEC\uD83C\uDDF6 +240", region: "GQ" },
  { value: "+30", label: "\uD83C\uDDEC\uD83C\uDDF7 +30", region: "GR" },
  { value: "+502", label: "\uD83C\uDDEC\uD83C\uDDF9 +502", region: "GT" },
  { value: "+1-GU", label: "\uD83C\uDDEC\uD83C\uDDFA +1", region: "GU" },
  { value: "+245", label: "\uD83C\uDDEC\uD83C\uDDFC +245", region: "GW" },
  { value: "+592", label: "\uD83C\uDDEC\uD83C\uDDFE +592", region: "GY" },
  { value: "+852", label: "\uD83C\uDDED\uD83C\uDDF0 +852", region: "HK" },
  { value: "+504", label: "\uD83C\uDDED\uD83C\uDDF3 +504", region: "HN" },
  { value: "+385", label: "\uD83C\uDDED\uD83C\uDDF7 +385", region: "HR" },
  { value: "+509", label: "\uD83C\uDDED\uD83C\uDDF9 +509", region: "HT" },
  { value: "+36", label: "\uD83C\uDDED\uD83C\uDDFA +36", region: "HU" },
  { value: "+62", label: "\uD83C\uDDEE\uD83C\uDDE9 +62", region: "ID" },
  { value: "+972", label: "\uD83C\uDDEE\uD83C\uDDF1 +972", region: "IL" },
  { value: "+44-IM", label: "\uD83C\uDDEE\uD83C\uDDF2 +44", region: "IM" },
  { value: "+964", label: "\uD83C\uDDEE\uD83C\uDDF6 +964", region: "IQ" },
  { value: "+98", label: "\uD83C\uDDEE\uD83C\uDDF7 +98", region: "IR" },
  { value: "+354", label: "\uD83C\uDDEE\uD83C\uDDF8 +354", region: "IS" },
  { value: "+44-JE", label: "\uD83C\uDDEF\uD83C\uDDEA +44", region: "JE" },
  { value: "+1-JM", label: "\uD83C\uDDEF\uD83C\uDDF2 +1", region: "JM" },
  { value: "+962", label: "\uD83C\uDDEF\uD83C\uDDF4 +962", region: "JO" },
  { value: "+254", label: "\uD83C\uDDF0\uD83C\uDDEA +254", region: "KE" },
  { value: "+996", label: "\uD83C\uDDF0\uD83C\uDDEC +996", region: "KG" },
  { value: "+855", label: "\uD83C\uDDF0\uD83C\uDDED +855", region: "KH" },
  { value: "+686", label: "\uD83C\uDDF0\uD83C\uDDEE +686", region: "KI" },
  { value: "+269", label: "\uD83C\uDDF0\uD83C\uDDF2 +269", region: "KM" },
  { value: "+1-KN", label: "\uD83C\uDDF0\uD83C\uDDF3 +1", region: "KN" },
  { value: "+850", label: "\uD83C\uDDF0\uD83C\uDDF5 +850", region: "KP" },
  { value: "+965", label: "\uD83C\uDDF0\uD83C\uDDFC +965", region: "KW" },
  { value: "+1-KY", label: "\uD83C\uDDF0\uD83C\uDDFE +1", region: "KY" },
  { value: "+7", label: "\uD83C\uDDF0\uD83C\uDDFF +7", region: "KZ" },
  { value: "+856", label: "\uD83C\uDDF1\uD83C\uDDE6 +856", region: "LA" },
  { value: "+961", label: "\uD83C\uDDF1\uD83C\uDDE7 +961", region: "LB" },
  { value: "+1-LC", label: "\uD83C\uDDF1\uD83C\uDDE8 +1", region: "LC" },
  { value: "+423", label: "\uD83C\uDDF1\uD83C\uDDEE +423", region: "LI" },
  { value: "+94", label: "\uD83C\uDDF1\uD83C\uDDF0 +94", region: "LK" },
  { value: "+231", label: "\uD83C\uDDF1\uD83C\uDDF7 +231", region: "LR" },
  { value: "+266", label: "\uD83C\uDDF1\uD83C\uDDF8 +266", region: "LS" },
  { value: "+370", label: "\uD83C\uDDF1\uD83C\uDDF9 +370", region: "LT" },
  { value: "+352", label: "\uD83C\uDDF1\uD83C\uDDFA +352", region: "LU" },
  { value: "+371", label: "\uD83C\uDDF1\uD83C\uDDFB +371", region: "LV" },
  { value: "+218", label: "\uD83C\uDDF1\uD83C\uDDFE +218", region: "LY" },
  { value: "+212", label: "\uD83C\uDDF2\uD83C\uDDE6 +212", region: "MA" },
  { value: "+377", label: "\uD83C\uDDF2\uD83C\uDDE8 +377", region: "MC" },
  { value: "+373", label: "\uD83C\uDDF2\uD83C\uDDE9 +373", region: "MD" },
  { value: "+382", label: "\uD83C\uDDF2\uD83C\uDDEA +382", region: "ME" },
  { value: "+261", label: "\uD83C\uDDF2\uD83C\uDDEC +261", region: "MG" },
  { value: "+692", label: "\uD83C\uDDF2\uD83C\uDDED +692", region: "MH" },
  { value: "+389", label: "\uD83C\uDDF2\uD83C\uDDF0 +389", region: "MK" },
  { value: "+223", label: "\uD83C\uDDF2\uD83C\uDDF1 +223", region: "ML" },
  { value: "+95", label: "\uD83C\uDDF2\uD83C\uDDF2 +95", region: "MM" },
  { value: "+976", label: "\uD83C\uDDF2\uD83C\uDDF3 +976", region: "MN" },
  { value: "+853", label: "\uD83C\uDDF2\uD83C\uDDF4 +853", region: "MO" },
  { value: "+1-MP", label: "\uD83C\uDDF2\uD83C\uDDF5 +1", region: "MP" },
  { value: "+596", label: "\uD83C\uDDF2\uD83C\uDDF6 +596", region: "MQ" },
  { value: "+222", label: "\uD83C\uDDF2\uD83C\uDDF7 +222", region: "MR" },
  { value: "+1-MS", label: "\uD83C\uDDF2\uD83C\uDDF8 +1", region: "MS" },
  { value: "+356", label: "\uD83C\uDDF2\uD83C\uDDF9 +356", region: "MT" },
  { value: "+230", label: "\uD83C\uDDF2\uD83C\uDDFA +230", region: "MU" },
  { value: "+960", label: "\uD83C\uDDF2\uD83C\uDDFB +960", region: "MV" },
  { value: "+265", label: "\uD83C\uDDF2\uD83C\uDDFC +265", region: "MW" },
  { value: "+60", label: "\uD83C\uDDF2\uD83C\uDDFE +60", region: "MY" },
  { value: "+258", label: "\uD83C\uDDF2\uD83C\uDDFF +258", region: "MZ" },
  { value: "+264", label: "\uD83C\uDDF3\uD83C\uDDE6 +264", region: "NA" },
  { value: "+687", label: "\uD83C\uDDF3\uD83C\uDDE8 +687", region: "NC" },
  { value: "+227", label: "\uD83C\uDDF3\uD83C\uDDEA +227", region: "NE" },
  { value: "+234", label: "\uD83C\uDDF3\uD83C\uDDEC +234", region: "NG" },
  { value: "+505", label: "\uD83C\uDDF3\uD83C\uDDEE +505", region: "NI" },
  { value: "+977", label: "\uD83C\uDDF3\uD83C\uDDF5 +977", region: "NP" },
  { value: "+674", label: "\uD83C\uDDF3\uD83C\uDDF7 +674", region: "NR" },
  { value: "+968", label: "\uD83C\uDDF4\uD83C\uDDF2 +968", region: "OM" },
  { value: "+507", label: "\uD83C\uDDF5\uD83C\uDDE6 +507", region: "PA" },
  { value: "+51", label: "\uD83C\uDDF5\uD83C\uDDEA +51", region: "PE" },
  { value: "+689", label: "\uD83C\uDDF5\uD83C\uDDEB +689", region: "PF" },
  { value: "+675", label: "\uD83C\uDDF5\uD83C\uDDEC +675", region: "PG" },
  { value: "+63", label: "\uD83C\uDDF5\uD83C\uDDED +63", region: "PH" },
  { value: "+92", label: "\uD83C\uDDF5\uD83C\uDDF0 +92", region: "PK" },
  { value: "+1-PR", label: "\uD83C\uDDF5\uD83C\uDDF7 +1", region: "PR" },
  { value: "+970", label: "\uD83C\uDDF5\uD83C\uDDF8 +970", region: "PS" },
  { value: "+680", label: "\uD83C\uDDF5\uD83C\uDDFC +680", region: "PW" },
  { value: "+595", label: "\uD83C\uDDF5\uD83C\uDDFE +595", region: "PY" },
  { value: "+974", label: "\uD83C\uDDF6\uD83C\uDDE6 +974", region: "QA" },
  { value: "+262", label: "\uD83C\uDDF7\uD83C\uDDEA +262", region: "RE" },
  { value: "+40", label: "\uD83C\uDDF7\uD83C\uDDF4 +40", region: "RO" },
  { value: "+381", label: "\uD83C\uDDF7\uD83C\uDDF8 +381", region: "RS" },
  { value: "+7-RU", label: "\uD83C\uDDF7\uD83C\uDDFA +7", region: "RU" },
  { value: "+250", label: "\uD83C\uDDF7\uD83C\uDDFC +250", region: "RW" },
  { value: "+966", label: "\uD83C\uDDF8\uD83C\uDDE6 +966", region: "SA" },
  { value: "+677", label: "\uD83C\uDDF8\uD83C\uDDE7 +677", region: "SB" },
  { value: "+248", label: "\uD83C\uDDF8\uD83C\uDDE8 +248", region: "SC" },
  { value: "+249", label: "\uD83C\uDDF8\uD83C\uDDE9 +249", region: "SD" },
  { value: "+386", label: "\uD83C\uDDF8\uD83C\uDDEE +386", region: "SI" },
  { value: "+421", label: "\uD83C\uDDF8\uD83C\uDDF0 +421", region: "SK" },
  { value: "+232", label: "\uD83C\uDDF8\uD83C\uDDF1 +232", region: "SL" },
  { value: "+378", label: "\uD83C\uDDF8\uD83C\uDDF2 +378", region: "SM" },
  { value: "+221", label: "\uD83C\uDDF8\uD83C\uDDF3 +221", region: "SN" },
  { value: "+252", label: "\uD83C\uDDF8\uD83C\uDDF4 +252", region: "SO" },
  { value: "+597", label: "\uD83C\uDDF8\uD83C\uDDF7 +597", region: "SR" },
  { value: "+211", label: "\uD83C\uDDF8\uD83C\uDDF8 +211", region: "SS" },
  { value: "+239", label: "\uD83C\uDDF8\uD83C\uDDF9 +239", region: "ST" },
  { value: "+503", label: "\uD83C\uDDF8\uD83C\uDDFB +503", region: "SV" },
  { value: "+1-SX", label: "\uD83C\uDDF8\uD83C\uDDFD +1", region: "SX" },
  { value: "+963", label: "\uD83C\uDDF8\uD83C\uDDFE +963", region: "SY" },
  { value: "+268", label: "\uD83C\uDDF8\uD83C\uDDFF +268", region: "SZ" },
  { value: "+1-TC", label: "\uD83C\uDDF9\uD83C\uDDE8 +1", region: "TC" },
  { value: "+235", label: "\uD83C\uDDF9\uD83C\uDDE9 +235", region: "TD" },
  { value: "+228", label: "\uD83C\uDDF9\uD83C\uDDEC +228", region: "TG" },
  { value: "+66", label: "\uD83C\uDDF9\uD83C\uDDED +66", region: "TH" },
  { value: "+992", label: "\uD83C\uDDF9\uD83C\uDDEF +992", region: "TJ" },
  { value: "+670", label: "\uD83C\uDDF9\uD83C\uDDF1 +670", region: "TL" },
  { value: "+993", label: "\uD83C\uDDF9\uD83C\uDDF2 +993", region: "TM" },
  { value: "+216", label: "\uD83C\uDDF9\uD83C\uDDF3 +216", region: "TN" },
  { value: "+676", label: "\uD83C\uDDF9\uD83C\uDDF4 +676", region: "TO" },
  { value: "+90", label: "\uD83C\uDDF9\uD83C\uDDF7 +90", region: "TR" },
  { value: "+1-TT", label: "\uD83C\uDDF9\uD83C\uDDF9 +1", region: "TT" },
  { value: "+688", label: "\uD83C\uDDF9\uD83C\uDDFB +688", region: "TV" },
  { value: "+886", label: "\uD83C\uDDF9\uD83C\uDDFC +886", region: "TW" },
  { value: "+255", label: "\uD83C\uDDF9\uD83C\uDDFF +255", region: "TZ" },
  { value: "+380", label: "\uD83C\uDDFA\uD83C\uDDE6 +380", region: "UA" },
  { value: "+256", label: "\uD83C\uDDFA\uD83C\uDDEC +256", region: "UG" },
  { value: "+598", label: "\uD83C\uDDFA\uD83C\uDDFE +598", region: "UY" },
  { value: "+998", label: "\uD83C\uDDFA\uD83C\uDDFF +998", region: "UZ" },
  { value: "+39-VA", label: "\uD83C\uDDFB\uD83C\uDDE6 +39", region: "VA" },
  { value: "+1-VC", label: "\uD83C\uDDFB\uD83C\uDDE8 +1", region: "VC" },
  { value: "+58", label: "\uD83C\uDDFB\uD83C\uDDEA +58", region: "VE" },
  { value: "+1-VG", label: "\uD83C\uDDFB\uD83C\uDDEC +1", region: "VG" },
  { value: "+1-VI", label: "\uD83C\uDDFB\uD83C\uDDEE +1", region: "VI" },
  { value: "+84", label: "\uD83C\uDDFB\uD83C\uDDF3 +84", region: "VN" },
  { value: "+678", label: "\uD83C\uDDFB\uD83C\uDDFA +678", region: "VU" },
  { value: "+685", label: "\uD83C\uDDFC\uD83C\uDDF8 +685", region: "WS" },
  { value: "+383", label: "\uD83C\uDDFD\uD83C\uDDF0 +383", region: "XK" },
  { value: "+967", label: "\uD83C\uDDFE\uD83C\uDDEA +967", region: "YE" },
  { value: "+262-YT", label: "\uD83C\uDDFE\uD83C\uDDF9 +262", region: "YT" },
  { value: "+260", label: "\uD83C\uDDFF\uD83C\uDDF2 +260", region: "ZM" },
  { value: "+263", label: "\uD83C\uDDFF\uD83C\uDDFC +263", region: "ZW" },
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
  },
  "hours": {
    "title": "Business hours",
    "desc": "Set your opening hours (optional)"
  },
  "cover": {
    "title": "Cover image",
    "desc": "Upload a photo of your business (optional)"
  },
  "logo": {
    "title": "Logo",
    "desc": "Upload your business logo (optional)"
  }
};

export const fieldSchema: Record<string, Field[]> = {
  "review": [
    {
      "name": "reviewUrl",
      "labelKey": "reviewUrl",
      "type": "url",
      "required": true,
      "placeholder": "https://",
      "tip": "reviewUrl"
    },
    {
      "name": "reviewInfo",
      "labelKey": "reviewRedirect",
      "type": "info"
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
      "required": true,
      "maxLength": 1000,
      // QR_TEXT_MAX_BYTES (1,100) less the 40-character title and its newline,
      // so desktop refuses what mobile refuses.
      "maxBytes": 1059
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
      // Bytes, really: `wifiIssues` checks those.
      "maxLength": 32,
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
      // 64 for a raw hex key, 5 for WEP; `wifiIssues` has the exact rules.
      "maxLength": 64,
      "minLength": 5,
      "lengthMessage": "Please enter the network password (8–63 characters).",
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
      "formats": "PNG, JPG, JPEG, etc.",
      // Tami, 2026-10-21: uploaded photos showed only their middle with no
      // way to reframe them.
      "adjustable": "wide"
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
      // No AVI: no browser plays it and nothing converts it (JB, 2026-10-30).
      "accept": "video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.m4v,.webm",
      "required": true,
      "maxSizeMb": 50,
      "formats": "MP4, MOV, WEBM"
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
    },
    // Added 2026-10-19 with the mobile menu builder (create_mobile_menu.html),
    // so both layouts carry the same menu: an optional cover and section name.
    {
      "name": "cover",
      "labelKey": "cover",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "adjustable": "wide"
    },
    {
      "name": "category",
      "labelKey": "category",
      "type": "text",
      "maxLength": 40,
      "placeholder": "e.g. Appetizers, Main Courses, Desserts"
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
    },
    // Added 2026-10-22 with create_mobile_business.html (JB: anything the
    // mobile page adds works on desktop too). The social fields are vCard's,
    // appended below the object.
    {
      "name": "opensAt",
      "labelKey": "opensAt",
      "type": "time",
      "half": true,
      "section": "hours"
    },
    {
      "name": "closesAt",
      "labelKey": "closesAt",
      "type": "time",
      "half": true,
      "section": "hours"
    },
    {
      "name": "cover",
      "labelKey": "cover",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "adjustable": "wide",
      "section": "cover"
    },
    {
      "name": "logo",
      "labelKey": "logo",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "adjustable": "circle",
      "section": "logo"
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
    },
    // Coupon branding, added with the 2026-10-29 mobile sync (both layouts):
    // the name and photo on the coupon's card, which used to be samples.
    {
      "name": "businessName",
      "labelKey": "businessName",
      "type": "text",
      "maxLength": 40,
      "placeholder": "e.g. The Matcha Den"
    },
    {
      "name": "cover",
      "labelKey": "coverPhoto",
      "type": "file",
      "accept": "image/*",
      "maxSizeMb": 5,
      "formats": "PNG, JPG, JPEG, etc.",
      "adjustable": "wide"
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
      "requireOneLink": true,
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

/**
 * Business takes vCard's social profiles (create_mobile_business.html has the
 * same fifteen), placed after its contact details — before hours and images,
 * as the mobile page orders them.
 */
{
  const biz = fieldSchema.business;
  const at = biz.findIndex((f) => f.section === "hours");
  biz.splice(at, 0, ...fieldSchema.vcard.filter((f) => f.section === "social").map((f) => ({ ...f })));
}
