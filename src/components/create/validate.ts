/**
 * Field-level validation for step 2, shared between the form (inline errors)
 * and the wizard (gating Next). A field is a problem only when it is required
 * and empty, or filled and malformed — optional empty fields never complain.
 */

import { fieldSchema } from "./fieldSchema";
import type { Field } from "./fieldSchema";
import { parseLinks, parseMenuItems } from "./storedValues";
import type { StoredLink } from "./storedValues";

type Values = Record<string, string>;

/**
 * Fields whose `showIf` condition is not met are hidden entirely — and a
 * hidden field must not block completion either.
 */
export function visible(f: Field, values: Values) {
  const cond = f.showIf as
    | { field?: string; equals?: unknown; notEquals?: unknown }
    | undefined;
  if (!cond?.field) return true;

  const actual = values[cond.field] ?? "";
  if ("equals" in cond) return actual === cond.equals;
  if ("notEquals" in cond) return actual !== cond.notEquals;
  return true;
}

/**
 * A web address someone could actually be sent to: scheme optional, but the
 * host needs a real TLD — catches "https://www" and "mysite" alike.
 */
export function isValidUrl(raw: string): boolean {
  const v = raw.trim();
  if (!v || /\s/.test(v)) return false;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(url.protocol)) return false;
  // URL() punycodes the host, so ASCII is all there is; the TLD is either
  // letters or an `xn--` international one.
  return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.(xn--[a-z0-9-]+|[a-z]{2,})$/i.test(
    url.hostname,
  );
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(raw.trim());
}

/** Loose on purpose — formats vary wildly; we only reject the hopeless. */
export function isValidPhone(raw: string): boolean {
  const v = raw.trim();
  if (!/^\+?[\d\s().-]+$/.test(v)) return false;
  return v.replace(/\D/g, "").length >= 5;
}

export const errorCopy = {
  required: "This field is required",
  url: "Enter a valid URL, e.g. https://example.com",
  email: "Enter a valid email address",
  phone: "Enter a valid phone number",
  link: "Add at least one link with a name and a URL",
  tooLong: "This text is too long to fit in a QR code. Please shorten it.",
} as const;

/**
 * The multi-link rule, shared by desktop and mobile (JB, 2026-10-15): at
 * least one complete link (where the field sets `requireOneLink` — Social
 * Media's links stay optional) — a name and a valid URL. A row left entirely empty
 * is ignored, so a spare row never blocks Next; a half-filled row is flagged
 * on whichever half is missing; a URL that is there but malformed is flagged.
 *
 * `none` is true when no row is complete, and `rows[i]` says what is wrong
 * with row i, if anything. Each layout words the problems itself.
 */
export type LinkRowIssue = { name?: "missing"; url?: "missing" | "invalid" };

export function linkIssues(rows: StoredLink[]): {
  rows: LinkRowIssue[];
  none: boolean;
} {
  let complete = 0;
  const issues = rows.map((l): LinkRowIssue => {
    const name = l.name.trim();
    const url = l.url.trim();
    const hasUrl = url !== "" && url !== "https://";
    if (!name && !hasUrl) return {};
    const issue: LinkRowIssue = {};
    if (!name) issue.name = "missing";
    if (!hasUrl) issue.url = "missing";
    else if (!isValidUrl(url)) issue.url = "invalid";
    if (!issue.name && !issue.url) complete++;
    return issue;
  });
  return { rows: issues, none: complete === 0 };
}

/** The message a field should show, or null when it is fine. */
export function fieldError(f: Field, raw: string): string | null {
  // Links answer to `linkIssues` whether or not anything was typed: an empty
  // editor is "no complete link", not "nothing to check".
  if (f.type === "links") {
    const { rows, none } = linkIssues(parseLinks(raw));
    if (rows.some((r) => r.url === "invalid")) return errorCopy.url;
    // The completeness rules are Multi-Link's. Social Media's rows have
    // always allowed a bare URL, captioned by its host.
    if (f.requireOneLink && (none || rows.some((r) => r.name || r.url))) {
      return errorCopy.link;
    }
    return null;
  }

  const v = (raw ?? "").trim();
  if (!v) return f.required ? errorCopy.required : null;
  if (f.maxBytes && new TextEncoder().encode(v).length > f.maxBytes) return errorCopy.tooLong;

  switch (f.type) {
    case "url":
      return isValidUrl(v) ? null : errorCopy.url;
    case "email":
      return isValidEmail(v) ? null : errorCopy.email;
    case "tel":
    case "phone-intl":
      return isValidPhone(v) ? null : errorCopy.phone;
    default:
      return null;
  }
}

/**
 * Social Media needs at least one profile (JB, 2026-10-19 — both layouts):
 * a filled platform field, valid where the platform takes a URL.
 */
export function hasSocialProfile(values: Values) {
  return (fieldSchema.social ?? [])
    .filter((f) => f.section === "social")
    .some((f) => {
      const v = (values[f.name] ?? "").trim();
      if (!v || v === "https://") return false;
      return f.type === "url" ? isValidUrl(v) : true;
    });
}

/**
 * A menu needs at least one item with a name and a price (the mobile
 * builder's rule, kept on desktop so the two agree). Spare empty rows are
 * ignored; a half-filled one is not.
 */
export function menuIssues(raw: string | undefined) {
  const rows = parseMenuItems(raw).map((i) => ({
    name: !i.name && (i.price || i.desc) ? ("missing" as const) : undefined,
    price: i.name && !i.price ? ("missing" as const) : undefined,
    blank: !i.name && !i.price && !i.desc,
    complete: !!i.name && !!i.price,
  }));
  return { rows, none: !rows.some((r) => r.complete) };
}

/** Every visible field filled where required, and malformed nowhere. */
export function isComplete(type: string, values: Values) {
  const fieldsOk = (fieldSchema[type] ?? [])
    .filter((f) => visible(f, values))
    .every((f) => fieldError(f, values[f.name] ?? "") === null);
  if (!fieldsOk) return false;
  if (type === "social") return hasSocialProfile(values);
  if (type === "menu") {
    const { rows, none } = menuIssues(values.items);
    return !none && rows.every((r) => !r.name && !r.price);
  }
  return true;
}
