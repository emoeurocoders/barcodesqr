"use client";

import { BadgeCheck, Share2 } from "lucide-react";
import {
  PhoneFrame,
  PhoneQrChip,
  PhoneSocialRow,
  socialColors,
} from "./PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  headline: "Ava Whitfield",
  description:
    "Designing little things that make people smile — sharing process notes, playlists, and works in progress from my studio in Portland.",
};

const socials: { color: string; label: string }[] = [
  { color: socialColors.instagram, label: "Instagram" },
  { color: socialColors.whatsapp, label: "WhatsApp" },
  { color: socialColors.reddit, label: "Reddit" },
];

/**
 * Live profile preview for the Social Media type — the landing page a scan
 * opens, with the headline and blurb filling in as you type.
 */
export function SocialPreview({ values }: { values: Values }) {
  const headline = values.headline?.trim() || sample.headline;
  const description = values.description?.trim() || sample.description;

  return (
    <PhoneFrame>
      <div
        className="relative flex h-full flex-col"
        style={{ background: "#edf0f5" }}
      >
        {/* Decorative rings behind the content */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full"
            style={{ border: "26px solid rgba(255, 255, 255, 0.45)" }}
          />
          <div
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full"
            style={{ border: "30px solid rgba(255, 255, 255, 0.45)" }}
          />
        </div>

        <div className="relative flex items-start justify-between px-3 pt-3">
          <PhoneQrChip />
          <Share2 className="mt-1 h-4 w-4 text-muted" />
        </div>

        <div className="relative mt-4 flex shrink-0 justify-center">
          <div className="h-[92px] w-[92px] overflow-hidden rounded-full shadow-soft ring-4 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/previews/portrait.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full"
              style={{ objectFit: "cover", objectPosition: "50% 25%" }}
            />
          </div>
        </div>

        <div className="relative mt-2.5 flex items-center justify-center gap-1 px-4">
          <span
            className="truncate text-[15px] font-bold"
            style={{ color: "#111827" }}
          >
            {headline}
          </span>
          <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: "#1d9bf0" }} />
        </div>

        <div className="relative mx-4 mt-2">
          <span
            aria-hidden="true"
            className="absolute -left-2 -top-4 z-10 font-serif text-[34px] leading-none"
            style={{ color: "#3b82f6" }}
          >
            &ldquo;
          </span>
          <div className="rounded-xl bg-white/95 px-3 py-2 shadow-sm">
            <p
              className="line-clamp-4 text-center text-[9.5px] leading-relaxed"
              style={{ color: "#374151" }}
            >
              {description}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-5 -right-2 z-10 font-serif text-[34px] leading-none"
            style={{ color: "#3b82f6" }}
          >
            &rdquo;
          </span>
        </div>

        <div
          className="relative mt-4 text-center text-[11px] font-semibold"
          style={{ color: "#111827" }}
        >
          Find me on
        </div>
        <div className="relative mt-2 space-y-2 px-3.5">
          {socials.map((s) => (
            <PhoneSocialRow key={s.label} color={s.color} label={s.label} />
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
