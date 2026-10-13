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
