/**
 * A QR code's look — create_customize_desktop.html's "Design Options" (JB,
 * 2026-11-24, Monday 5748799333). Shared by the creator, the renderer and the
 * server, which re-validates every design it stores: anything the browser
 * sends is a suggestion.
 *
 * The keys are the designer's own `value`s from the file's radio inputs, so a
 * saved design reads the same as the markup it came from.
 */

export const FRAMES = [
  // `text`: whether the frame carries the editable "Scan me!" (their data-txt).
  { key: "none", label: "No Frame", text: false },
  { key: "border", label: "Border", text: false },
  { key: "label", label: "Label", text: true },
  { key: "rounded", label: "Rounded", text: true },
  { key: "bubble", label: "Bubble", text: true },
  { key: "ribbon", label: "Ribbon", text: true },
  { key: "sign", label: "Sign", text: true },
  { key: "top", label: "Top label", text: true },
  { key: "corners", label: "Corners", text: true },
] as const;
export type FrameKey = (typeof FRAMES)[number]["key"];

/** Their `.clrLst` — data-fg / data-bg / data-fr, verbatim. */
export const THEMES = [
  { key: "classic", label: "Classic", fg: "#0e1311", bg: "#ffffff", fr: "#0e1311" },
  { key: "blue", label: "Blue", fg: "#2563eb", bg: "#ffffff", fr: "#2563eb" },
  { key: "teal", label: "Teal", fg: "#0d9488", bg: "#ffffff", fr: "#0d9488" },
  { key: "green", label: "Green", fg: "#16a34a", bg: "#ffffff", fr: "#16a34a" },
  { key: "purple", label: "Purple", fg: "#7c3aed", bg: "#ffffff", fr: "#7c3aed" },
  { key: "pink", label: "Pink", fg: "#db2777", bg: "#ffffff", fr: "#db2777" },
  { key: "orange", label: "Orange", fg: "#ea580c", bg: "#ffffff", fr: "#ea580c" },
] as const;
export type ThemeKey = (typeof THEMES)[number]["key"];

export const PATTERNS = ["square", "dots", "rounded", "fluid", "small"] as const;
export type PatternKey = (typeof PATTERNS)[number];

export const CORNERS = ["square", "dot", "circle", "rounded", "diamond"] as const;
export type CornerKey = (typeof CORNERS)[number];

/** Their `.frmTxt input` — maxlength 16, value "Scan me!". */
export const FRAME_TEXT_MAX = 16;
export const DEFAULT_FRAME_TEXT = "Scan me!";

export type QrDesign = {
  frame: FrameKey;
  /** What the frame says; ignored by frames without text. */
  text: string;
  fg: string;
  bg: string;
  /** Frame colour (their `--qrFr`). */
  fr: string;
  /** The theme the colours came from, or null once edited by hand. */
  theme: ThemeKey | null;
  pattern: PatternKey;
  corners: CornerKey;
  /** Public URL of the uploaded logo, or null. */
  logo: string | null;
};

/** Every `data-def="1"` in the file: Label frame, Classic, Square, Square. */
export const DEFAULT_DESIGN: QrDesign = {
  frame: "label",
  text: DEFAULT_FRAME_TEXT,
  fg: "#0e1311",
  bg: "#ffffff",
  fr: "#0e1311",
  theme: "classic",
  pattern: "square",
  corners: "square",
  logo: null,
};

export const frameHasText = (f: FrameKey) => FRAMES.find((x) => x.key === f)?.text ?? false;

const HEX = /^#[0-9a-f]{6}$/i;
/** Their `cuHex`: "#abc123" or "abc123" → "#abc123", anything else → null. */
export function normalizeHex(v: string): string | null {
  const s = v.trim().replace(/^#?/, "#");
  return HEX.test(s) ? s.toLowerCase() : null;
}

/* ---- Readability ------------------------------------------------------------ */

const channel = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
/** WCAG relative luminance of "#rrggbb". */
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
/** WCAG contrast ratio, 1–21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Below this the code is refused. Phone cameras read luminance, and most
 * readers expect dark modules on a light ground: an inverted or washed-out
 * code is exactly the "may not scan on every phone" the designer warns about.
 * 3:1 (WCAG's bar for graphics) is the lowest every preset clears: Green on
 * white is the closest at about 3.3.
 */
export const MIN_CODE_CONTRAST = 3;

export type DesignIssue = { field: "fg" | "bg" | "fr" | "pattern"; message: string };

/**
 * Why this design would not scan reliably, or null. The creator blocks
 * "Continue to Download" on any issue, and the server refuses to store one,
 * so no saved code can be unscannable by colour (JB: "customers cannot create
 * designs that fail basic QR decoding/contrast validation").
 */
export function designIssue(d: Pick<QrDesign, "fg" | "bg" | "fr" | "frame" | "pattern" | "corners">): DesignIssue | null {
  if (luminance(d.fg) >= luminance(d.bg)) {
    return {
      field: "fg",
      message: "Use a darker foreground than background. Light codes on dark backgrounds don’t scan on many phones.",
    };
  }
  if (contrast(d.fg, d.bg) < MIN_CODE_CONTRAST) {
    return {
      field: "fg",
      message: "These colors are too close to scan reliably. Pick a darker foreground or a lighter background.",
    };
  }
  // Measured, not assumed (2026-11-24): every pattern × corner style was
  // decoded at three content sizes, on screen and at print size. Diamond
  // eyes — finder patterns rotated 45°, which is what readers look for first
  // — failed with the two detached-dot patterns: Small dots on short links
  // and contacts every time, Dots on long content at print size.
  if (d.corners === "diamond" && (d.pattern === "small" || d.pattern === "dots")) {
    return {
      field: "pattern",
      message: "Diamond corners don’t scan reliably with dot patterns. Pick Square, Rounded or Fluid, or another corner style.",
    };
  }
  // The frame's text is white on the frame color (or the frame color on the
  // background, for Corners) — unreadable text is not a scan failure, but a
  // "Scan me!" nobody can read defeats the frame.
  if (frameHasText(d.frame)) {
    const textOn = d.frame === "corners" ? contrast(d.fr, d.bg) : contrast("#ffffff", d.fr);
    if (textOn < MIN_CODE_CONTRAST) {
      return {
        field: "fr",
        message:
          d.frame === "corners"
            ? "The frame text would be hard to read on this background. Pick a darker frame color."
            : "The white frame text would be hard to read on this frame color. Pick a darker frame color.",
      };
    }
  }
  return null;
}

/* ---- Server-side cleaning --------------------------------------------------- */

const oneOf = <T extends string>(list: readonly T[], v: unknown, fallback: T): T =>
  typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T) : fallback;

/**
 * A stored design from anything — the browser's suggestion, an old row with
 * none. Unknown keys are dropped, every value is checked, and the logo must
 * live in our own bucket (`logoBase`) so a design can never point a customer's
 * QR at somebody else's image host.
 */
export function cleanDesign(raw: unknown, logoBase?: string): QrDesign | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const fg = typeof r.fg === "string" ? normalizeHex(r.fg) : null;
  const bg = typeof r.bg === "string" ? normalizeHex(r.bg) : null;
  const fr = typeof r.fr === "string" ? normalizeHex(r.fr) : null;
  const frame = oneOf(FRAMES.map((f) => f.key), r.frame, DEFAULT_DESIGN.frame);
  const text =
    typeof r.text === "string" ? r.text.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, FRAME_TEXT_MAX) : DEFAULT_FRAME_TEXT;
  const logo =
    typeof r.logo === "string" && logoBase && r.logo.startsWith(`${logoBase.replace(/\/$/, "")}/`) && r.logo.length < 500
      ? r.logo
      : null;
  const d: QrDesign = {
    frame,
    text: text.trim() ? text : DEFAULT_FRAME_TEXT,
    fg: fg ?? DEFAULT_DESIGN.fg,
    bg: bg ?? DEFAULT_DESIGN.bg,
    fr: fr ?? DEFAULT_DESIGN.fr,
    theme: r.theme === null ? null : oneOf(THEMES.map((t) => t.key), r.theme, "classic"),
    pattern: oneOf(PATTERNS, r.pattern, DEFAULT_DESIGN.pattern),
    corners: oneOf(CORNERS, r.corners, DEFAULT_DESIGN.corners),
    logo,
  };
  return designIssue(d) ? null : d;
}
