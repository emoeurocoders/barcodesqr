"use client";

import {
  QrCode,
  Share2,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  title: "Harbor & Sage Co.",
  description: "Specialty coffee & all-day brunch in the heart of town.",
  hours: "Open · Closes 3 PM",
};

const rows: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}[] = [
  { icon: Phone, label: "Call", value: "+1 555 014 2890", accent: true },
  { icon: Mail, label: "Email", value: "hello@harborsage.com" },
  { icon: Globe, label: "Website", value: "harborsage.com" },
  { icon: MapPin, label: "Directions", value: "123 Harbor St, Portside" },
];

/**
 * Step-2 preview for the Business Page type: the mini landing page a scan
 * opens, with the contact rows the form collects.
 */
export function BusinessPreview({ values }: { values: Values }) {
  const title = values.title?.trim() || sample.title;
  const description = values.description?.trim() || sample.description;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <div className="relative h-[30%] shrink-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/previews/team.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full"
              style={{ objectFit: "cover", objectPosition: "50% 50%" }}
            />
          </div>
          <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/85 shadow-sm backdrop-blur">
              <QrCode className="h-4 w-4 text-brand-darker" />
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/85 shadow-sm backdrop-blur">
              <Share2 className="h-3.5 w-3.5 text-muted" />
            </span>
          </div>
        </div>

        <div className="relative -mt-7 flex justify-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-darker shadow-soft ring-4 ring-white">
            <Building2 className="h-6 w-6 text-white" />
          </span>
        </div>

        <div className="px-4 pt-2 text-center">
          <h2
            className="truncate text-base font-bold leading-tight tracking-heading"
            style={{ color: "#1f2937" }}
          >
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted">
            {description}
          </p>
        </div>

        <div className="mt-3 space-y-2 px-3.5">
          {rows.map(({ icon: Icon, label, value, accent }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-line/60"
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                  accent ? "bg-brand-darker" : "bg-brand-soft"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    accent ? "text-white" : "text-brand-dark"
                  }`}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-[11px] font-semibold"
                  style={{ color: "#1f2937" }}
                >
                  {label}
                </span>
                <span className="block truncate text-[9px] text-muted">
                  {value}
                </span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
            </div>
          ))}
        </div>

        <div className="mt-auto px-3.5 pb-4 pt-2">
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-bg-alt py-1.5 text-[9px] font-medium text-muted">
            <Clock className="h-3 w-3 text-brand" />
            {sample.hours}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
