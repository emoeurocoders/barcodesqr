"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteQrCode } from "@/app/actions/qr";
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
  /** Served from a hosted page (dynamic) rather than carried in the code. */
  hosted: boolean;
  /** Scans so far — hosted codes only; a direct code never reaches us. */
  scans: number | null;
  isNew?: boolean;
  /** Just saved — new or edited — so the row is outlined. */
  highlight?: boolean;
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

const MENU_W = 176;

/**
 * The ⋮ menu: Edit, the other two download formats, Delete. Unmocked — the
 * mockup draws the button only.
 *
 * Rendered into <body> at a fixed position: inside the table it was clipped
 * by the table's horizontal scroller, so on the last row it opened into a
 * box you could not see (Tami, 2026-10-22). It opens downward, or upward
 * when there is not room below; scrolling or resizing closes it, since a
 * fixed menu would otherwise float away from its button.
 */
function RowMenu({ row, onDelete }: { row: QrRow; onDelete: () => void }) {
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const open = !!pos;

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const t = e.target as Node;
      if (e.type === "pointerdown" && (menu.current?.contains(t) || btn.current?.contains(t))) return;
      setPos(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPos(null);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const toggle = () => {
    if (open) return setPos(null);
    const r = btn.current!.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.right - MENU_W, window.innerWidth - MENU_W - 8));
    // Four items at 36px plus padding.
    const roomBelow = window.innerHeight - r.bottom;
    setPos(roomBelow >= 170 ? { left, top: r.bottom + 4 } : { left, bottom: window.innerHeight - r.top + 4 });
  };

  const item = "block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-bg-alt";

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="cursor-pointer rounded-md p-1 text-faint transition-colors hover:bg-bg-alt hover:text-ink"
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>
      {pos &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            className="fixed z-50 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-pop"
            style={{ left: pos.left, top: pos.top, bottom: pos.bottom, width: MENU_W }}
          >
            <Link role="menuitem" href={`/create?type=${encodeURIComponent(row.type)}&edit=${encodeURIComponent(row.id)}`} className={`${item} text-ink`}>
              Edit
            </Link>
            {(["svg", "jpeg"] as const).map((ext) => (
              <button
                key={ext}
                type="button"
                role="menuitem"
                onClick={() => {
                  setPos(null);
                  downloadQr(row.qrValue, defaultQrStyle, row.name, ext);
                }}
                className={`${item} text-ink`}
              >
                Download {ext.toUpperCase()}
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setPos(null);
                onDelete();
              }}
              className={`${item} text-[#dc2626]`}
            >
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

/**
 * "Delete this code?" — unmocked; the paywall's lightbox look, small. What
 * deleting does to a printed copy depends on the type, so it says which.
 */
function ConfirmDelete({ row, onClose }: { row: QrRow; onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [busy, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4" onClick={() => !busy && onClose()}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="del-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="del-title" className="text-lg font-bold text-ink">
          Delete “{row.name}”?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {row.hosted
            ? "It will be removed from your account, and its page will stop working for anyone who scans it. This can't be undone."
            : "It will be removed from your account. This can't be undone. Copies already printed keep working — their content is in the code itself."}
        </p>
        {error && <p className="mt-3 text-sm text-[#b91c1c]">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            disabled={busy}
            onClick={onClose}
            className="cursor-pointer rounded-btn border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg-alt disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const res = await deleteQrCode(row.id);
              if ("ok" in res) {
                onClose();
                router.refresh();
              } else {
                setBusy(false);
                setError(res.error);
              }
            }}
            className="cursor-pointer rounded-btn bg-[#dc2626] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Row({ row }: { row: QrRow }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <li
      id={`qr-${row.id}`}
      className={`grid items-center gap-x-3.5 ${
        row.highlight
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

      {/* Scans: hosted codes pass through /q/<slug>, which counts them. */}
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
          onClick={() => downloadQr(row.qrValue, defaultQrStyle, row.name, "png")}
          className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR
        </button>
        <RowMenu row={row} onDelete={() => setConfirming(true)} />
      </div>
      {confirming && <ConfirmDelete row={row} onClose={() => setConfirming(false)} />}
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
