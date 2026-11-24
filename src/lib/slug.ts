/**
 * Short codes for /q/<slug>: 8 characters of [0-9A-Za-z], 62^8 ≈ 2×10^14.
 *
 * Shared by the creator and the server since step 3 (2026-11-24): the
 * creator picks a code's slug when it is first designed, so the preview a
 * customer scans before checkout and the file they download encode the same
 * link (JB). The server adopts it only if it is well formed and unused.
 */
export const SLUG_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function newSlug() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  // 256 % 62 skews a few characters very slightly; irrelevant for this.
  return Array.from(bytes, (b) => SLUG_ALPHABET[b % 62]).join("");
}

export const isSlug = (v: unknown): v is string => typeof v === "string" && /^[0-9A-Za-z]{8}$/.test(v);
