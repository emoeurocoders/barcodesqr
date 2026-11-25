import Link from "next/link";

/**
 * A short link that leads nowhere: never made, deleted, or — most often since
 * step 3 (2026-11-24) — a new code scanned from the creator's preview before
 * checkout saved it. That last visitor is the customer testing their own
 * code, so the page leads with "not yet", not "broken" (JB, 2026-11-25).
 */
export default function QrNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-bold text-ink">This QR code isn’t active yet</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Just created it? It starts working as soon as checkout is complete. The QR image stays the same, so
          anything you’ve already downloaded or printed will work too.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-faint">If its owner removed it, it won’t become active again.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
          Create your own QR code
        </Link>
      </div>
    </main>
  );
}
