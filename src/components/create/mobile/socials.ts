import { isValidUrl } from "../validate";

/**
 * The fifteen platforms the mobile social picker offers, in the designer's
 * order. The first eight show by default; the rest sit behind "More
 * Platforms" (their `.itm.xtr`).
 *
 * `key` is the value-map field, which is the same name the desktop form and
 * the QR encoder already use — so a profile entered on one layout is there on
 * the other.
 */
export type Social = {
  key: string;
  name: string;
  color: string;
  placeholder: string;
  /** Their URL inputs get `inputmode="url"` and the https:// prefill. */
  url: boolean;
  /** WhatsApp and Viber take a number: `type="tel"`, so phones show a keypad. */
  tel?: boolean;
  extra?: boolean;
};

export const socials: Social[] = [
  { key: "facebook", name: "Facebook", color: "#1877f2", placeholder: "https://facebook.com/username", url: true },
  { key: "instagram", name: "Instagram", color: "#e1306c", placeholder: "https://instagram.com/username", url: true },
  { key: "whatsapp", name: "WhatsApp", color: "#25d366", placeholder: "+1 234 567 890", url: false, tel: true },
  { key: "tiktok", name: "TikTok", color: "#000000", placeholder: "https://tiktok.com/@username", url: true },
  { key: "youtube", name: "YouTube", color: "#ff0000", placeholder: "https://youtube.com/@username", url: true },
  { key: "linkedin", name: "LinkedIn", color: "#0a66c2", placeholder: "https://linkedin.com/in/username", url: true },
  { key: "x", name: "X", color: "#000000", placeholder: "https://x.com/username", url: true },
  { key: "telegram", name: "Telegram", color: "#26a5e4", placeholder: "https://t.me/username", url: true },
  { key: "messenger", name: "Messenger", color: "#0084ff", placeholder: "https://m.me/username", url: true, extra: true },
  { key: "snapchat", name: "Snapchat", color: "#f7c600", placeholder: "https://snapchat.com/add/username", url: true, extra: true },
  { key: "pinterest", name: "Pinterest", color: "#e60023", placeholder: "https://pinterest.com/username", url: true, extra: true },
  { key: "reddit", name: "Reddit", color: "#ff4500", placeholder: "https://reddit.com/user/username", url: true, extra: true },
  { key: "line", name: "LINE", color: "#06c755", placeholder: "LINE ID", url: false, extra: true },
  { key: "wechat", name: "WeChat", color: "#07c160", placeholder: "WeChat ID", url: false, extra: true },
  { key: "viber", name: "Viber", color: "#7360f2", placeholder: "+1 234 567 890", url: false, tel: true, extra: true },
];

export const socialByKey = Object.fromEntries(socials.map((s) => [s.key, s]));

/**
 * Where each link-type platform's profiles live, and how a bare username
 * becomes one. People type "@kaia" or "kaia" as often as a link; both used to
 * be stored as written and published as "https://@kaia" (Tami, 2026-10-30).
 */
const profiles: Record<string, { hosts: string[]; url: (h: string) => string }> = {
  facebook: { hosts: ["facebook.com", "fb.com", "fb.me"], url: (h) => `https://facebook.com/${h}` },
  instagram: { hosts: ["instagram.com", "instagr.am"], url: (h) => `https://instagram.com/${h}` },
  tiktok: { hosts: ["tiktok.com"], url: (h) => `https://tiktok.com/@${h}` },
  youtube: { hosts: ["youtube.com", "youtu.be"], url: (h) => `https://youtube.com/@${h}` },
  linkedin: { hosts: ["linkedin.com", "lnkd.in"], url: (h) => `https://linkedin.com/in/${h}` },
  x: { hosts: ["x.com", "twitter.com"], url: (h) => `https://x.com/${h}` },
  telegram: { hosts: ["t.me", "telegram.me"], url: (h) => `https://t.me/${h}` },
  messenger: { hosts: ["m.me", "messenger.com", "facebook.com"], url: (h) => `https://m.me/${h}` },
  snapchat: { hosts: ["snapchat.com"], url: (h) => `https://snapchat.com/add/${h}` },
  pinterest: { hosts: ["pinterest.com", "pin.it"], url: (h) => `https://pinterest.com/${h}` },
  reddit: { hosts: ["reddit.com", "redd.it"], url: (h) => `https://reddit.com/user/${h}` },
};

const HANDLE = /^[a-z0-9._-]{1,100}$/i;

/**
 * A social field's value as a link, or `ok: false` when it is neither a
 * username nor a link on that platform's own site. Number and ID platforms
 * (WhatsApp, Viber, LINE, WeChat) pass through; their own rules apply.
 */
export function normalizeSocial(key: string, raw: string): { value: string; ok: boolean } {
  const v = raw.trim();
  if (!v || /^https?:\/\/$/i.test(v)) return { value: "", ok: true };
  const p = profiles[key];
  if (!p) {
    if (socialByKey[key]?.tel) {
      const digits = v.replace(/\D/g, "").length;
      return { value: v, ok: digits >= 7 && digits <= 15 && /^\+?[\d\s().-]+$/.test(v) };
    }
    return { value: v, ok: true };
  }
  const rest = v.replace(/^https?:\/\//i, "");
  const host = rest.split(/[/?#]/)[0].toLowerCase().replace(/^www\.|^m\.|^mobile\./, "");
  // Pinterest runs a site per country (pinterest.co.uk, pinterest.de…).
  const own = (h: string) => p.hosts.some((d) => h === d || h.endsWith(`.${d}`)) || (key === "pinterest" && /^([a-z]{2}\.)?pinterest\.[a-z.]{2,6}$/.test(h));
  if (own(host)) {
    const value = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    return { value, ok: isValidUrl(value) };
  }
  // No path — a username ("kaia", "@kaia", "u/kaia" on Reddit). Unless it
  // reads as some other site ("www.kaia.com", "kaia.co"): that is a wrong
  // link, not a username with a dot in it ("kaia.bennett" is one).
  if (!rest.includes("/") || (key === "reddit" && /^u\/[^/]+$/i.test(rest))) {
    const at = rest.startsWith("@");
    const h = rest.replace(/^@/, "").replace(key === "reddit" ? /^u\//i : /^$/, "");
    const site = /^www\./i.test(h) || /\.(com|net|org|info|biz|io|co|app|dev|me|ly|[a-z]{2})$/i.test(h);
    if ((at || !site) && HANDLE.test(h) && !/^[._-]|[._-]$/.test(h)) return { value: p.url(h), ok: true };
  }
  return { value: v, ok: false };
}
