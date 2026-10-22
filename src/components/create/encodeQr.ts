import { dialCodes } from "./fieldSchema";
import { socials } from "./mobile/socials";
/**
 * Turns the step-2 form values into the string the QR actually encodes.
 *
 * Static types (a phone number, a Wi-Fi network, a vCard) encode their content
 * directly. Dynamic types resolve through a short link so the destination can
 * be edited after printing — until that service exists, they preview against a
 * placeholder so the code still renders and scans.
 */

const DYNAMIC_PLACEHOLDER = "https://barcodesqr.com/q/preview";

/** Types whose content lives on a hosted page rather than inside the code. */
const dynamicTypes = new Set([
  "pdf",
  "image",
  "video",
  "mp3",
  "social",
  "menu",
  "business",
  "coupon",
  "feedback",
  "multilink",
  "applink",
]);

/**
 * Joins a phone field with the dial code chosen beside it. The picker stores
 * `+1-CA` and friends so two countries can share a code without the select
 * collapsing them; only the digits before the dash are dialled.
 */
export function intlPhone(v: Record<string, string>, field = "phone") {
  // An untouched picker has stored nothing yet; it shows its first option.
  const code = (v[`${field}Country`] ?? dialCodes[0].value).split("-")[0];
  const number = (v[field] ?? "").trim();
  if (!number) return "";
  return number.startsWith("+") ? number : `${code}${number}`;
}

const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

/**
 * "mysite.com" is a fine thing to type but a useless thing to encode — a
 * scanner treats a bare host as text. Filled-in URLs get https:// on the way
 * into the code; validation has already insisted on a real hostname.
 */
const withScheme = (u?: string) => {
  const v = (u ?? "").trim();
  if (!v) return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
};

function vcard(v: Record<string, string>) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v.lastName ?? ""};${v.firstName ?? ""}`,
    `FN:${[v.firstName, v.lastName].filter(Boolean).join(" ")}`,
  ];
  if (v.organization) lines.push(`ORG:${v.organization}`);
  if (v.jobTitle) lines.push(`TITLE:${v.jobTitle}`);
  // Every number with the dial code picked beside it. Before 2026-10-15 the
  // picker was shown but its code never reached the card, and Work and Fax
  // were collected and dropped.
  if (v.phone) lines.push(`TEL;TYPE=VOICE:${intlPhone(v, "phone")}`);
  if (v.mobile) lines.push(`TEL;TYPE=CELL:${intlPhone(v, "mobile")}`);
  if (v.work) lines.push(`TEL;TYPE=WORK,VOICE:${intlPhone(v, "work")}`);
  if (v.fax) lines.push(`TEL;TYPE=FAX:${intlPhone(v, "fax")}`);
  if (v.email) lines.push(`EMAIL:${v.email}`);
  if (v.website) lines.push(`URL:${v.website}`);
  const addr = [v.street, v.city, v.state, v.zip, v.country].filter(Boolean);
  if (addr.length) lines.push(`ADR:;;${addr.join(";")}`);
  // Social profiles (Tami, 2026-10-22: they never reached the contact). As
  // labelled URLs — `itemN.URL` + `itemN.X-ABLabel` — which iPhone shows as
  // "Facebook", "Instagram"… and Android imports as websites. Apple's own
  // X-SOCIALPROFILE is skipped: Android drops it. Numbers and IDs become the
  // app's own link where it has one; WeChat has none, so it goes in the note.
  const extraNote: string[] = [];
  let item = 0;
  for (const p of socials) {
    const raw = (v[p.key] ?? "").trim();
    if (!raw || raw === "https://") continue;
    let url = "";
    if (p.key === "whatsapp") url = `https://wa.me/${raw.replace(/[^\d]/g, "")}`;
    else if (p.key === "viber") url = `viber://chat?number=${encodeURIComponent(raw.replace(/[^\d+]/g, ""))}`;
    else if (p.key === "line") url = `https://line.me/ti/p/~${encodeURIComponent(raw.replace(/^@/, ""))}`;
    else if (p.key === "wechat") extraNote.push(`WeChat: ${raw}`);
    else url = withScheme(raw);
    if (!url) continue;
    item++;
    lines.push(`item${item}.URL:${url}`, `item${item}.X-ABLabel:${p.name}`);
  }
  const note = [v.summary, ...extraNote].filter(Boolean).join("\\n");
  if (note) lines.push(`NOTE:${note}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function calendar(v: Record<string, string>) {
  const stamp = (s?: string) =>
    s ? s.replace(/[-:]/g, "").replace(/\.\d+/, "") : "";
  const lines = [
    "BEGIN:VEVENT",
    `SUMMARY:${v.eventTitle ?? ""}`,
  ];
  if (v.location) lines.push(`LOCATION:${v.location}`);
  if (v.startsAt) lines.push(`DTSTART:${stamp(v.startsAt)}`);
  if (v.endsAt) lines.push(`DTEND:${stamp(v.endsAt)}`);
  if (v.description) lines.push(`DESCRIPTION:${v.description}`);
  lines.push("END:VEVENT");
  return lines.join("\n");
}

export function encodeQr(
  type: string,
  values: Record<string, string>,
): string {
  const v = values ?? {};

  switch (type) {
    case "website":
      return withScheme(v.url);

    case "text":
      return [v.title, v.text].filter(Boolean).join("\n");

    case "phone": {
      // The mobile form picks the country separately (`phoneCountry`), as
      // WhatsApp and SMS do; desktop's single field is typed whole. Spaces
      // and dashes go: some dialers stop reading a `tel:` at the first one.
      // A `tel:` link opens the dialer — it never places the call itself.
      const n = v.phoneCountry !== undefined ? intlPhone(v) : (v.phone ?? "").trim();
      return n ? `tel:${n.replace(/[^\d+]/g, "")}` : "";
    }

    case "payment":
      // Straight to the customer's own payment page (JB, 2026-10-21) — the
      // same way Website encodes its link — until the short-link service
      // exists to route it.
      return withScheme(v.paymentLink);

    case "email": {
      if (!v.to) return "";
      // Percent-encoding, not URLSearchParams: that writes spaces as "+",
      // which mail apps leave as a literal "+" in a mailto subject (RFC
      // 6068). "Product Inquiry" arrived as "Product+Inquiry".
      const q = [
        v.subject ? `subject=${encodeURIComponent(v.subject)}` : "",
        v.body ? `body=${encodeURIComponent(v.body)}` : "",
      ].filter(Boolean);
      return `mailto:${v.to.trim()}${q.length ? `?${q.join("&")}` : ""}`;
    }

    case "sms":
      return v.phone ? `SMSTO:${intlPhone(v)}:${v.message ?? ""}` : "";

    case "whatsapp": {
      if (!v.phone) return "";
      const digits = intlPhone(v).replace(/[^\d]/g, "");
      const text = v.message ? `?text=${encodeURIComponent(v.message)}` : "";
      return `https://wa.me/${digits}${text}`;
    }

    case "wifi": {
      if (!v.ssid) return "";
      const enc = v.encryption || "WPA";
      const pass = enc === "nopass" ? "" : `P:${esc(v.password ?? "")};`;
      const hidden = v.hidden === "true" ? "H:true;" : "";
      return `WIFI:T:${enc};S:${esc(v.ssid)};${pass}${hidden};`;
    }

    case "review":
      return withScheme(v.reviewUrl);

    case "location": {
      if (!v.address) return "";
      // Picked from Google's suggestions: open that exact place (Maps URLs,
      // `query_place_id`), with the text as the fallback Maps itself uses.
      if (v.placeId) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}&query_place_id=${encodeURIComponent(v.placeId)}`;
      }
      return `https://maps.google.com/?q=${encodeURIComponent(v.address)}`;
    }

    case "vcard":
      return vcard(v);

    case "event":
      return calendar(v);

    default:
      return dynamicTypes.has(type) ? DYNAMIC_PLACEHOLDER : withScheme(v.url);
  }
}

/** True when the code's destination is editable after printing. */
export function isDynamic(type: string) {
  return dynamicTypes.has(type);
}

/**
 * The formats the creator does NOT badge as tracked, because they encode
 * their content straight into the code and there is no hosted page to edit or
 * count scans on. Google Maps and Plain Text joined on 2026-10-21: JB asked
 * for the claim to go wherever the redirect system is not behind it, and
 * their mobile files carry no badge.
 */
const untrackedTypes = new Set(["wifi", "email", "sms", "whatsapp", "phone", "location", "text"]);

/**
 * Types the creator advertises as tracked and editable in step 2.
 *
 * Deliberately not `isDynamic`: the creator serves vCard, Website and Payment
 * as hosted/redirected pages, while our encoder still writes their content
 * directly so a scan works without that service existing yet. See LAUNCH.md.
 */
export function hasTracking(type: string) {
  return !untrackedTypes.has(type);
}
