import Link from "next/link";

/**
 * A short link that leads nowhere: never made, deleted, or a code scanned
 * from step 3's preview before checkout (its slug exists only once saved).
 */
export default function QrNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-bold text-ink">This QR code isn’t active</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          It may not be set up yet — a new code starts working as soon as checkout is complete — or its owner has removed it.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
          Create your own QR code
        </Link>
      </div>
    </main>
  );
}
