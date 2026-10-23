"use client";

import { createContext, useContext } from "react";
import { socials } from "./socials";

/**
 * The previews double as the hosted pages a scan opens (app/q/[slug]). The
 * designer has drawn no separate pages; the preview IS the page's picture
 * (Emo, 2026-10-23: build them from the previews). Inside this provider a
 * preview renders as the page:
 *
 * - no preview bar, frame or "Example preview…" caption;
 * - no sample content — an empty optional field shows nothing;
 * - rows and buttons are real links (tel:, mailto:, maps, profiles…).
 */
export const PageMode = createContext<{ slug: string } | null>(null);

export const usePageMode = () => useContext(PageMode);

/** The profile link for a filled social field — same rules as the vCard's. */
export function socialHref(key: string, raw: string) {
  const v = raw.trim();
  if (!v || v === "https://") return "";
  if (key === "whatsapp") return `https://wa.me/${v.replace(/[^\d]/g, "")}`;
  if (key === "viber") return `viber://chat?number=${encodeURIComponent(v.replace(/[^\d+]/g, ""))}`;
  if (key === "line") return `https://line.me/ti/p/~${encodeURIComponent(v.replace(/^@/, ""))}`;
  if (key === "wechat") return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
}

/** The platforms a saved code has filled in, in the picker's order. */
export const filledSocials = (values: Record<string, string>) =>
  socials.filter((p) => (values[p.key] ?? "").trim() && values[p.key] !== "https://").map((p) => p.key);
