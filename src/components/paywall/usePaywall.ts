"use client";

import { useCallback, useState } from "react";

/**
 * Paywall open/closed state.
 *
 * Nothing is persisted any more. The old two-step flow could leave someone
 * paid-but-account-less if they closed between the steps, which needed a
 * sessionStorage flag and a resume affordance to recover from. Collecting
 * email and card on one screen removed that state: either the whole checkout
 * succeeds and they leave with a session, or nothing happened at all.
 */
export function usePaywall() {
  const [open, setOpen] = useState(false);

  return {
    open,
    show: useCallback(() => setOpen(true), []),
    close: useCallback(() => setOpen(false), []),
  };
}
