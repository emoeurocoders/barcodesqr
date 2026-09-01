/**
 * Step 2 keeps every field in a flat `Record<string, string>`. Files and the
 * multi-link list don't fit a bare string, so they are stored as JSON in the
 * same map — these helpers are the single place that shape is read or written.
 *
 * Files are uploaded to R2 as soon as they are picked, so what is stored is
 * the name and size for the UI plus the key and public URL of the object —
 * never the bytes. `dataUrl` survives only to read values written before the
 * bucket existed; nothing sets it any more.
 */

export type StoredFile = {
  name: string;
  size: number;
  /** Object key in the bucket. */
  key?: string;
  /** Public URL the file is served from. */
  url?: string;
  /** Legacy: an inline data URL, from before uploads had anywhere to go. */
  dataUrl?: string;
};

/** Where to point an <img>/<video> at a stored file, whichever era wrote it. */
export function fileSrc(f: StoredFile | null | undefined) {
  return f?.url ?? f?.dataUrl;
}

export type StoredLink = {
  name: string;
  url: string;
  /** Public URL of the optional per-link logo (a data URL on old values). */
  logo?: string;
};

export function parseStoredFile(raw: string | undefined): StoredFile | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    if (v && typeof v === "object" && typeof v.name === "string") {
      return v as StoredFile;
    }
  } catch {
    /* not a stored file */
  }
  return null;
}

export function parseLinks(raw: string | undefined): StoredLink[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) {
      return v.filter(
        (l): l is StoredLink =>
          l && typeof l === "object" && typeof l.url === "string",
      );
    }
  } catch {
    // Before the links editor existed this field held one bare URL.
    return [{ name: "", url: raw }];
  }
  return [];
}

/** Rows that would actually appear on the landing page. */
export function filledLinks(raw: string | undefined): StoredLink[] {
  return parseLinks(raw).filter((l) => l.url.trim() || l.name.trim());
}

/** A link row's caption when no name was typed: the link's bare host. */
export function linkCaption(l: StoredLink): string {
  if (l.name.trim()) return l.name.trim();
  return l.url
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0];
}
