"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveQrCode } from "@/app/actions/qr";
import { clearPendingQr, readPendingQr } from "@/lib/pendingQr";

/**
 * Saves the code someone built before checkout, the first time they land
 * here signed in. Renders nothing unless saving fails.
 *
 * The stash is cleared only once the server has it, or once the server has
 * refused it for a reason retrying will not fix (an unpaid account keeps it,
 * so starting the trial later still brings the code along). `draftKey`
 * makes a second claim — another tab, a refresh mid-request — a no-op.
 */
export function ClaimPendingQr() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const draft = readPendingQr();
    if (!draft) return;

    saveQrCode(draft).then(
      (res) => {
        if ("id" in res) {
          clearPendingQr();
          router.replace(`/dashboard?new=${encodeURIComponent(res.id)}`);
        } else if (!/trial|sign in/i.test(res.error)) {
          clearPendingQr();
          setError(res.error);
        }
      },
      () => setError("We couldn't save your QR code. Refresh to try again."),
    );
  }, [router]);

  if (!error) return null;
  return (
    <p role="alert" className="mx-6 mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
      {error}
    </p>
  );
}
