/**
 * Field-level validation for step 2, shared between the form (inline errors)
 * and the wizard (gating Next). A field is a problem only when it is required
 * and empty, or filled and malformed — optional empty fields never complain.
 */

import { fieldSchema } from "./fieldSchema";
import type { Field } from "./fieldSchema";
import { parseLinks } from "./storedValues";

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
} as const;

/** The message a field should show, or null when it is fine. */
export function fieldError(f: Field, raw: string): string | null {
  const v = (raw ?? "").trim();
  if (!v) return f.required ? errorCopy.required : null;

  switch (f.type) {
    case "url":
      return isValidUrl(v) ? null : errorCopy.url;
    case "email":
      return isValidEmail(v) ? null : errorCopy.email;
    case "tel":
    case "phone-intl":
      return isValidPhone(v) ? null : errorCopy.phone;
    case "links":
      // Row-level errors render inside the editor; here it only gates Next.
      return parseLinks(v).every((l) => !l.url.trim() || isValidUrl(l.url))
        ? null
        : errorCopy.url;
    default:
      return null;
  }
}

/** Every visible field filled where required, and malformed nowhere. */
export function isComplete(type: string, values: Values) {
  return (fieldSchema[type] ?? [])
    .filter((f) => visible(f, values))
    .every((f) => fieldError(f, values[f.name] ?? "") === null);
}
