"use client";

import { Tag, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  PhoneFrame,
  PhoneQrChip,
  PhoneShareChip,
  PhoneLinkRow,
  PhoneSocialRow,
  socialColors,
} from "./PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  title: "The Matcha Den",
  description:
    "A cozy matcha bar pouring comforting, Japanese-inspired drinks all day long.",
};

const links: { icon: LucideIcon; label: string }[] = [
  { icon: Tag, label: "Prices" },
  { icon: MapPin, label: "Location" },
  { icon: Phone, label: "Order now" },
];

const socials: { color: string; label: string }[] = [
  { color: socialColors.instagram, label: "Instagram" },
  { color: socialColors.tiktok, label: "TikTok" },
];

/**
 * Live link-in-bio preview for the Multi-Link type — the page a scan lands on,
 * filling in as you type rather than sitting empty.
 */
export function MultiLinkPreview({ values }: { values: Values }) {
  const title = values.title?.trim() || sample.title;
  const description = values.description?.trim() || sample.description;

  return (
    <PhoneFrame>
      <div
        className="flex h-full flex-col"
        style={{
          background:
            "linear-gradient(115deg, #ffffff 30%, #ebebeb 50%, #ffffff 70%)",
        }}
      >
        {/* Cover */}
        <div className="relative mx-2.5 mt-2.5 h-[31%] shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/previews/cafe.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full"
              style={{ objectFit: "cover", objectPosition: "50% 50%" }}
            />
          </div>
          <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between">
            <PhoneQrChip />
            <PhoneShareChip />
          </div>
        </div>

        <div className="px-4 pt-3">
          <h2
            className="truncate text-base font-bold tracking-heading"
            style={{ color: "#1a1a1a" }}
          >
            {title}
          </h2>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted">
            {description}
          </p>
        </div>

        <div className="mt-3 space-y-2 px-3.5">
          {links.map((l) => (
            <PhoneLinkRow key={l.label} icon={l.icon} label={l.label} />
          ))}
        </div>

        <div className="mt-3 px-4 text-xs font-bold text-ink">Find me on</div>
        <div className="mt-2 space-y-2 px-3.5">
          {socials.map((s) => (
            <PhoneSocialRow key={s.label} color={s.color} label={s.label} />
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
