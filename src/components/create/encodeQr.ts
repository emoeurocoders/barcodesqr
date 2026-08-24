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
  "payment",
  "applink",
]);

const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

function vcard(v: Record<string, string>) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v.lastName ?? ""};${v.firstName ?? ""}`,
    `FN:${[v.firstName, v.lastName].filter(Boolean).join(" ")}`,
  ];
  if (v.organization) lines.push(`ORG:${v.organization}`);
  if (v.jobTitle) lines.push(`TITLE:${v.jobTitle}`);
  if (v.phone) lines.push(`TEL;TYPE=WORK,VOICE:${v.phone}`);
  if (v.mobile) lines.push(`TEL;TYPE=CELL:${v.mobile}`);
  if (v.email) lines.push(`EMAIL:${v.email}`);
  if (v.website) lines.push(`URL:${v.website}`);
  const addr = [v.street, v.city, v.state, v.zip, v.country].filter(Boolean);
  if (addr.length) lines.push(`ADR:;;${addr.join(";")}`);
  if (v.summary) lines.push(`NOTE:${v.summary}`);
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
      return v.url ?? "";

    case "text":
      return [v.title, v.text].filter(Boolean).join("\n");

    case "phone":
      return v.phone ? `tel:${v.phone}` : "";

    case "email": {
      if (!v.to) return "";
      const q = new URLSearchParams();
      if (v.subject) q.set("subject", v.subject);
      if (v.body) q.set("body", v.body);
      const s = q.toString();
      return `mailto:${v.to}${s ? `?${s}` : ""}`;
    }

    case "sms":
      return v.phone ? `SMSTO:${v.phone}:${v.message ?? ""}` : "";

    case "whatsapp": {
      if (!v.phone) return "";
      const digits = v.phone.replace(/[^\d]/g, "");
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
      return v.reviewUrl ?? "";

    case "location": {
      if (!v.address) return "";
      return `https://maps.google.com/?q=${encodeURIComponent(v.address)}`;
    }

    case "vcard":
      return vcard(v);

    case "event":
      return calendar(v);

    default:
      return dynamicTypes.has(type) ? DYNAMIC_PLACEHOLDER : (v.url ?? "");
  }
}

/** True when the code's destination is editable after printing. */
export function isDynamic(type: string) {
  return dynamicTypes.has(type);
}
