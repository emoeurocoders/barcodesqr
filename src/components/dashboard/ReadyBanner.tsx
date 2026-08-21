"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Shown after a code is created; dismissible for the rest of the session. */
export function ReadyBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative mx-6 flex flex-wrap items-start gap-4 rounded-[14px] border border-[#ddf0ee] bg-[#f2f9f8] px-5 py-[22px] pe-12">
      <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-brand text-white">
        <Check className="h-5 w-5" strokeWidth={3} />
      </span>

      <div className="min-w-[12rem] flex-1">
        <h2 className="text-base font-bold text-ink">Your QR code is ready</h2>
        <p className="mt-0.5 text-sm text-muted">
          Download it now or manage it anytime from your account.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button>
          <Download className="h-4 w-4" />
          Download QR
        </Button>
        <Link href="/create">
          <Button variant="outline">Create Another QR</Button>
        </Link>
      </div>

      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setOpen(false)}
        className="absolute end-4 top-4 cursor-pointer rounded-full p-1 text-faint transition-colors hover:bg-white hover:text-ink"
      >
        <X className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
