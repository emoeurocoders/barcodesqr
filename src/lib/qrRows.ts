import { encodeQr, intlPhone, isDynamic } from "@/components/create/encodeQr";
import type { QrRow } from "@/components/dashboard/QrTable";

/**
 * Turn a saved `qr_code` row into what the dashboard table shows.
 *
 * What a code encodes is re-derived from its form values on every render
 * (see the comment on `qrCodes`), so the thumbnail and the download always
 * match the encoder as it is today.
 */

type Saved = {
  id: string;
  type: string;
  name: string;
  values: Record<string, string>;
  createdAt: Date;
  slug: string;
  scans: number;
};

/** One line saying what the code holds — the bit someone scans for. */
function summary(type: string, v: Record<string, string>, encoded: string) {
  if (isDynamic(type)) {
    // The page's own headline: its title, name, or the file it serves.
    const file = (() => {
      try {
        return (JSON.parse(v.file || "null") as { name?: string } | null)?.name ?? "";
      } catch {
        return "";
      }
    })();
    return (
      v.title ||
      v.headline ||
      [v.firstName, v.lastName].filter(Boolean).join(" ") ||
      file ||
      ""
    );
  }
  switch (type) {
    case "text":
      return v.title || v.text || "";
    case "phone":
      return v.phone ?? "";
    case "sms":
    case "whatsapp":
      return intlPhone(v);
    case "email":
      return v.to ?? "";
    case "wifi":
      return v.ssid ? `Network: ${v.ssid}` : "";
    case "location":
      return v.address ?? "";
    case "vcard":
      return [v.firstName, v.lastName].filter(Boolean).join(" ") || v.organization || "";
    case "event":
      return v.eventTitle ?? "";
    default:
      return encoded.replace(/^https?:\/\//, "");
  }
}

export function toQrRow(row: Saved, newId?: string, updatedId?: string): QrRow {
  const qrValue = encodeQr(row.type, row.values, row.slug);
  // Hosted codes link to their page; direct ones to where they point.
  const link = /^https?:\/\//.test(qrValue) ? qrValue : null;
  return {
    id: row.id,
    name: row.name,
    description: summary(row.type, row.values, qrValue),
    link,
    qrValue,
    createdAt: row.createdAt.toISOString(),
    type: row.type,
    hosted: isDynamic(row.type),
    // Counted only where a scan passes through us.
    scans: isDynamic(row.type) ? row.scans : null,
    isNew: row.id === newId,
    highlight: row.id === newId || row.id === updatedId,
  };
}
