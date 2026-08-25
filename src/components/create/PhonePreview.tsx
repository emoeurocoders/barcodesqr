import { QrCode, Share2, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The pieces the step-2 previews share.
 *
 * These render a mock-up of the *scanned* page, not app chrome — so the
 * colours here are the sample page's own palette rather than `@theme` tokens.
 * They are pinned as constants so they stay quotable against the creator
 * instead of drifting into hand-picked hexes at each call site.
 */
export const phoneInk = {
  /** Row labels inside the white pills. */
  rowLabel: "#1f2937",
} as const;

/** Brand colours for the sample social rows and dots. */
export const socialColors = {
  instagram: "#e1306c",
  facebook: "#1877f2",
  linkedin: "#0a66c2",
  youtube: "#ff0000",
  tiktok: "#000000",
  whatsapp: "#25d366",
  reddit: "#ff4500",
} as const;

/** The device the preview is drawn inside. */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[290px]">
      <div className="relative aspect-[10/19.5] overflow-hidden rounded-[2.5rem] border border-line bg-white shadow-phone">
        {children}
      </div>
    </div>
  );
}

/**
 * The QR chip the preview carries in its top-left corner. `round` is the
 * variant the vCard cover uses — a solid circle rather than a frosted tile.
 */
export function PhoneQrChip({
  variant = "tile",
}: {
  variant?: "tile" | "round";
}) {
  return (
    <span
      className={
        variant === "round"
          ? "grid h-7 w-7 place-items-center rounded-full shadow-sm"
          : "grid h-7 w-7 place-items-center rounded-lg bg-white/85 shadow-sm backdrop-blur"
      }
      style={variant === "round" ? { background: "#eff0f3" } : undefined}
    >
      <QrCode className="h-4 w-4 text-brand-darker" />
    </span>
  );
}

/** The share affordance opposite it. */
export function PhoneShareChip() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/85 shadow-sm backdrop-blur">
      <Share2 className="h-3.5 w-3.5 text-muted" />
    </span>
  );
}

/** A tappable row with a bordered glyph — the custom links list. */
export function PhoneLinkRow({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-white px-3 py-2 shadow-sm">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line">
        <Icon className="h-3 w-3 text-ink" />
      </span>
      <span
        className="flex-1 truncate text-xs font-semibold"
        style={{ color: phoneInk.rowLabel }}
      >
        {label}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
    </div>
  );
}

/** The same row with a brand dot instead — the "Find me on" list. */
export function PhoneSocialRow({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-white px-3 py-2 shadow-sm">
      <span
        className="inline-block h-4 w-4 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span
        className="flex-1 truncate text-xs font-semibold"
        style={{ color: phoneInk.rowLabel }}
      >
        {label}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
    </div>
  );
}
