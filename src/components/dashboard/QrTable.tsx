"use client";

import { useState } from "react";
import {
  Download,
  ExternalLink,
  Copy,
  Pencil,
  Info,
  EllipsisVertical,
  Globe,
  Share2,
  MapPin,
  Contact,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type QrRow = {
  id: string;
  name: string;
  description: string;
  link: string;
  createdDate: string;
  createdTime: string;
  passwordOn: boolean;
  status: string;
  health: string;
  type: keyof typeof typeStyles;
  scans: number | null;
  thumbnail: string;
  isNew?: boolean;
};

const typeStyles = {
  website: { label: "Website", bg: "#eff4ff", fg: "#2563eb", icon: Globe },
  social: { label: "Social Media", bg: "#f8effd", fg: "#9333ea", icon: Share2 },
  location: { label: "Location", bg: "#fff2e9", fg: "#ea580c", icon: MapPin },
  vcard: { label: "vCard", bg: "#e6f7f5", fg: "#0d8a82", icon: Contact },
} satisfies Record<
  string,
  { label: string; bg: string; fg: string; icon: LucideIcon }
>;

/** Column widths taken from the mockup's grid. */
const GRID =
  "minmax(0,226fr) minmax(0,184fr) minmax(0,84fr) minmax(0,64fr) minmax(0,70fr) minmax(0,86fr) minmax(0,124fr) minmax(0,84fr) minmax(0,74fr)";

const headings = [
  "QR Name",
  "Your Link",
  "Created",
  "Password",
  "Status",
  "QR Health",
  "Type",
  "Scans",
  "Actions",
];

function PasswordToggle({ on }: { on: boolean }) {
  const [enabled, setEnabled] = useState(on);
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Password protection"
        onClick={() => setEnabled((v) => !v)}
        className={`relative h-[19px] w-[34px] shrink-0 cursor-pointer rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-[#e3e7ec]"
        }`}
      >
        <span
          className={`absolute top-1/2 h-[15px] w-[15px] -translate-y-1/2 rounded-full bg-white transition-all ${
            enabled ? "start-[17px]" : "start-[2px]"
          }`}
        />
      </button>
      <span className="text-xs text-muted">{enabled ? "On" : "Off"}</span>
    </div>
  );
}

function Row({ row }: { row: QrRow }) {
  const type = typeStyles[row.type];
  const TypeIcon = type.icon;

  return (
    <li
      className={`grid items-center gap-x-3.5 ${
        row.isNew
          ? "my-2.5 rounded-[14px] border-2 border-primary p-[11px] shadow-soft"
          : "border-b border-line/70 py-3"
      }`}
      style={{ gridTemplateColumns: GRID }}
    >
      {/* Name */}
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative grid h-[50px] w-[50px] shrink-0 place-items-center rounded-lg border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={row.thumbnail} alt="" aria-hidden="true" className="h-9 w-9" />
          {row.isNew && (
            <span className="absolute -bottom-1.5 rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white">
              NEW
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-bold text-ink">
              {row.name}
            </span>
            <Pencil className="h-[15px] w-[15px] shrink-0 cursor-pointer text-faint hover:text-ink" />
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            {row.description}
          </span>
        </span>
      </div>

      {/* Link */}
      <div className="flex min-w-0 items-center gap-1.5">
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-faint" />
        <a
          href={`https://${row.link}`}
          target="_blank"
          rel="noreferrer noopener"
          className="truncate text-xs text-primary hover:underline"
        >
          {row.link}
        </a>
        <button
          type="button"
          aria-label="Copy link"
          className="shrink-0 cursor-pointer text-faint hover:text-ink"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Created */}
      <div className="min-w-0">
        <p className="truncate text-xs text-ink">{row.createdDate}</p>
        <p className="truncate text-xs text-muted">{row.createdTime}</p>
      </div>

      {/* Password */}
      <PasswordToggle on={row.passwordOn} />

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" />
        <span className="text-xs text-ink">{row.status}</span>
      </div>

      {/* Health */}
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" />
        <span className="text-xs text-ink">{row.health}</span>
        <Info className="h-3.5 w-3.5 shrink-0 text-faint" />
      </div>

      {/* Type */}
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: type.bg, color: type.fg }}
        >
          <TypeIcon className="h-3.5 w-3.5" />
          {type.label}
        </span>
      </div>

      {/* Scans */}
      <div>
        {row.scans !== null && (
          <span className="inline-flex rounded-full bg-bg-alt px-2.5 py-1 text-xs font-medium text-body">
            {row.scans} {row.scans === 1 ? "scan" : "scans"}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR
        </button>
        <button
          type="button"
          aria-label="More actions"
          className="cursor-pointer rounded-md p-1 text-faint transition-colors hover:bg-bg-alt hover:text-ink"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export function QrTable({ rows }: { rows: QrRow[] }) {
  return (
    <div className="px-6 pb-8 pt-6">
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div
            className="grid gap-x-3.5 border-b border-line pb-3"
            style={{ gridTemplateColumns: GRID }}
          >
            {headings.map((h) => (
              <p
                key={h}
                className="text-[11.5px] font-semibold uppercase tracking-wide text-muted last:text-right"
              >
                {h}
              </p>
            ))}
          </div>

          <ul>
            {rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
