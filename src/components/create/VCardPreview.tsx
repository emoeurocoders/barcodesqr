"use client";

import {
  QrCode,
  Share2,
  Plus,
  Phone,
  Globe,
  MapPin,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  firstName: "Ava",
  lastName: "Whitfield",
  jobTitle: "Senior Product Designer",
  summary:
    "Designing thoughtful, human-centered products — pairing research and craft to turn rough ideas into polished experiences.",
};

const socialDots = ["#e0447c", "#3b82f6", "#1d4ed8", "#ef4444"];

const rows: { icon: LucideIcon; label: string }[] = [
  { icon: Phone, label: "Contact" },
  { icon: Globe, label: "Company info" },
  { icon: MapPin, label: "Address" },
];

/**
 * Live business-card preview for the vCard type.
 *
 * Fields fall back to the sample card so the panel reads as a finished design
 * from the first moment, rather than an empty shell.
 */
export function VCardPreview({ values }: { values: Values }) {
  const first = values.firstName?.trim() || sample.firstName;
  const last = values.lastName?.trim() || sample.lastName;
  const role = values.jobTitle?.trim() || values.role?.trim() || sample.jobTitle;
  const summary = values.summary?.trim() || sample.summary;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      {/* Cover */}
      <div className="relative h-[132px] bg-[#c3d5d2]">
        <svg
          viewBox="0 0 330 132"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <circle cx="60" cy="20" r="70" fill="#ffffff" opacity="0.16" />
          <circle cx="250" cy="110" r="90" fill="#ffffff" opacity="0.12" />
        </svg>

        <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-brand-dark">
          <QrCode className="h-4 w-4" />
        </span>

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink">
            <Share2 className="h-4 w-4" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0f5c52] px-3 py-1.5 text-xs font-semibold text-white">
            <Plus className="h-3 w-3" />
            Add contact
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="relative -mt-12 rounded-t-2xl bg-white px-5 pb-5 pt-14 text-center">
        <div
          role="img"
          aria-label={`${first} ${last}`}
          className="absolute left-1/2 top-0 h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-cover bg-center shadow-sm"
          style={{ backgroundImage: "url(/previews/portrait.jpg)" }}
        />

        <p className="text-lg font-bold text-ink">
          {first} {last}
        </p>
        <p className="mt-0.5 text-sm text-muted">{role}</p>

        <div className="mt-3 flex items-center justify-center gap-2">
          {socialDots.map((c) => (
            <span
              key={c}
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted">{summary}</p>

        <div className="mt-4 space-y-2 text-left">
          {rows.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-xl bg-bg-alt/70 px-3 py-2.5"
            >
              <Icon className="h-4 w-4 shrink-0 text-body" />
              <span className="flex-1 text-sm font-semibold text-ink">
                {label}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
