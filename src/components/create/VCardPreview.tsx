"use client";

import { Phone, Globe, MapPin, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  PhoneFrame,
  PhoneQrChip,
  PhoneShareChip,
  filledSocials,
  phoneInk,
  socialColors,
} from "./PhonePreview";
import { cropStyle, fileSrc, parseStoredFile } from "./storedValues";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  firstName: "Ava",
  lastName: "Whitfield",
  jobTitle: "Senior Product Designer",
  summary:
    "Designing thoughtful, human-centered products — pairing research and craft to turn rough ideas into polished experiences.",
};

const socialDots = [
  socialColors.instagram,
  socialColors.facebook,
  socialColors.linkedin,
  socialColors.youtube,
];

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
  const photoFile = parseStoredFile(values.photo);
  const photo = fileSrc(photoFile);
  const filled = filledSocials(values);
  // The card shows channels as bare dots; four fit the row the sample drew.
  const dots = filled.length
    ? filled.slice(0, 4).map((s) => s.color)
    : socialDots;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        {/* Cover */}
        <div
          className="relative h-[27%] shrink-0 overflow-hidden"
          style={{ background: "#b8cdd5" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full"
            style={{ border: "26px solid #d1dfdf" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-16 h-32 w-32 rounded-full"
            style={{ border: "16px solid rgba(209, 223, 223, 0.5)" }}
          />

          <div className="relative flex items-start justify-between px-3 pt-3">
            <PhoneQrChip variant="round" />
            <div className="flex items-center gap-1.5">
              <PhoneShareChip />
              <span className="flex items-center rounded-full bg-brand-darker px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm">
                Add contact
              </span>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="relative -mt-5 flex-1 rounded-t-3xl bg-white">
          <div className="absolute -top-14 left-1/2 h-[100px] w-[100px] -translate-x-1/2 overflow-hidden rounded-full shadow-soft ring-4 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo ?? "/previews/portrait.jpg"}
              alt=""
              aria-hidden="true"
              className="h-full w-full"
              style={photoFile ? cropStyle(photoFile) : { objectFit: "cover", objectPosition: "50% 50%" }}
            />
          </div>

          <div className="px-4 pt-[52px] text-center">
            <h2
              className="text-base font-bold leading-tight tracking-heading"
              style={{ color: "#323232" }}
            >
              {first} {last}
            </h2>
            <p className="mt-0.5 text-[11px]" style={{ color: "#494949" }}>
              {role}
            </p>

            <div className="mt-2.5 flex justify-center gap-2.5">
              {dots.map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="inline-block h-5 w-5 shrink-0 rounded-full"
                  style={{ background: c }}
                />
              ))}
            </div>

            <p className="mt-2.5 line-clamp-3 text-[10px] leading-relaxed text-muted">
              {summary}
            </p>
          </div>

          <div className="mt-3 space-y-2 px-4">
            {rows.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
                style={{ background: "#f2f2f7" }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white shadow-sm">
                  <Icon className="h-3.5 w-3.5 text-ink" />
                </span>
                <span
                  className="flex-1 text-xs font-semibold"
                  style={{ color: phoneInk.rowLabel }}
                >
                  {label}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
