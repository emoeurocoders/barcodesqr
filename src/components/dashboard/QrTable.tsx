"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Download, ExternalLink, Copy, Check, EllipsisVertical } from "lucide-react";
import { QrPreview, defaultQrStyle, downloadQr } from "@/components/create/QrPreview";
import { allTypes } from "@/components/create/qrTypes";
import { designerTypeIcons } from "@/components/create/designerTypeIcons";

/**
 * A saved code as the table shows it. Everything here is derived on the
 * server from the `qr_code` row (see app/dashboard/page.tsx).
 */
export type QrRow = {
  id: string;
  name: string;
  /** One line under the name: where the code goes, or what it holds. */
  description: string;
  /** Where a scan lands, when that is a web address; null otherwise. */
  link: string | null;
  /** What the code encodes. */
  qrValue: string;
  /** ISO timestamp; shown in the viewer's own time zone. */
  createdAt: string;
  type: string;
  isNew?: boolean;
};

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

const noop = () => () => {};

/**
 * "Aug 19, 2024" over "10:24 AM", as the mockup writes it — in the browser's
 * time zone, so it is only filled in once mounted; the server's clock is UTC
 * and would show someone in California tomorrow's date.
 */
function Created({ iso }: { iso: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const d = new Date(iso);
  return (
    <div className="min-w-0">
      <p className="truncate text-xs text-ink">
        {mounted ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u00a0"}
      </p>
      <p className="truncate text-xs text-muted">
        {mounted ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "\u00a0"}
      </p>
    </div>
  );
}

/** The type pill: the type's own colour on a light tint, with its glyph. */
function TypePill({ type }: { type: string }) {
  const meta = allTypes.find((t) => t.value === type);
  const Glyph = designerTypeIcons[type];
  const color = meta?.color ?? "#6b7280";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: `${color}14`, color }}
    >
      {Glyph && <Glyph className="h-3.5 w-3.5" />}
      {meta?.label ?? type}
    </span>
  );
}

function CopyLink({ link }: { link: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy link"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(link);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked — nothing to do */
        }
      }}
      className="shrink-0 cursor-pointer text-faint hover:text-ink"
    >
      {done ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

/** The ⋮ menu: the other two formats. */
function MoreFormats({ row }: { row: QrRow }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-label="More download formats"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-md p-1 text-faint transition-colors hover:bg-bg-alt hover:text-ink"
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-pop">
          {(["svg", "jpeg"] as const).map((ext) => (
            <button
              key={ext}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                downloadQr(row.qrValue, defaultQrStyle, row.name, ext);
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-ink hover:bg-bg-alt"
            >
              Download {ext.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ row }: { row: QrRow }) {
  return (
    <li
      id={`qr-${row.id}`}
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
          {/* Drawn at 200 and shrunk: drawn at 40 the modules round to
              under a pixel and the thumbnail stops being a working code. */}
          <QrPreview
            value={row.qrValue}
            style={defaultQrStyle}
            size={200}
            className="h-10 w-10 [&>svg]:h-full [&>svg]:w-full"
          />
          {row.isNew && (
            <span className="absolute -bottom-1.5 rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white">
              NEW
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14.5px] font-bold text-ink">{row.name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted">{row.description}</span>
        </span>
      </div>

      {/* Link */}
      <div className="flex min-w-0 items-center gap-1.5">
        {row.link ? (
          <>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-faint" />
            <a
              href={row.link}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate text-xs text-primary hover:underline"
            >
              {row.link.replace(/^https?:\/\//, "")}
            </a>
            <CopyLink link={row.link} />
          </>
        ) : (
          <span className="text-xs text-faint">—</span>
        )}
      </div>

      {/* Created */}
      <Created iso={row.createdAt} />

      {/* Password — not built yet; shown as off rather than as a switch
          that would pretend to protect anything. */}
      <span className="text-xs text-muted">Off</span>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" />
        <span className="text-xs text-ink">Active</span>
      </div>

      {/* Health: every code we draw is a valid, scannable code. */}
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" />
        <span className="text-xs text-ink">Good</span>
      </div>

      {/* Type */}
      <div>
        <TypePill type={row.type} />
      </div>

      {/* Scans — counted once codes route through our short links. */}
      <div />

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => downloadQr(row.qrValue, defaultQrStyle, row.name, "png")}
          className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR
        </button>
        <MoreFormats row={row} />
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
