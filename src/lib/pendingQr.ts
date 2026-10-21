/**
 * The QR code someone built before paying, kept in the browser across
 * checkout.
 *
 * Every way through the paywall — email checkout, Continue with Google, or
 * signing in to an existing account — ends on /dashboard, often after a full
 * page load or an OAuth round trip that wipes React state. So the creator
 * stashes the finished draft here just before the paywall opens, and the
 * dashboard claims it once the visitor arrives signed in and paid
 * (`ClaimPendingQr` → `saveQrCode`).
 *
 * Browser storage can be unavailable (private windows, blocked site data);
 * every access is wrapped, and failing to stash only means the code is not
 * carried over — it never breaks checkout.
 */

export type PendingQr = {
  type: string;
  name: string;
  values: Record<string, string>;
  /** Random per draft; saving the same draft twice inserts once. */
  draftKey: string;
  /** Epoch ms. Drafts older than a day are dropped rather than claimed. */
  at: number;
};

const KEY = "bqr:pendingQr";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function stashPendingQr(draft: Omit<PendingQr, "draftKey" | "at">) {
  try {
    const entry: PendingQr = { ...draft, draftKey: crypto.randomUUID(), at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(entry));
  } catch {
    /* storage unavailable — the code just won't carry over */
  }
}

export function readPendingQr(): PendingQr | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PendingQr;
    if (!p?.type || !p.draftKey || Date.now() - p.at > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function clearPendingQr() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
