"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

/** Which panel the paywall is showing, or `null` when it is closed. */
export type PaywallStage = null | "pay" | "account";

const PAID_KEY = "barcodesqr:paidAwaitingAccount";

/**
 * sessionStorage as an external store, so React reads it the same way on the
 * server (always "not paid") and on the client, without a state-setting
 * effect and without a hydration mismatch.
 */
const paidStore = {
  listeners: new Set<() => void>(),

  subscribe(fn: () => void) {
    paidStore.listeners.add(fn);
    // Another tab finishing checkout should settle this one too.
    window.addEventListener("storage", fn);
    return () => {
      paidStore.listeners.delete(fn);
      window.removeEventListener("storage", fn);
    };
  },

  get() {
    try {
      return sessionStorage.getItem(PAID_KEY) === "1";
    } catch {
      // Private-mode Safari and friends throw on access. The flow still
      // works; it just cannot be resumed after a close.
      return false;
    }
  },

  set(value: boolean) {
    try {
      if (value) sessionStorage.setItem(PAID_KEY, "1");
      else sessionStorage.removeItem(PAID_KEY);
    } catch {
      /* see above */
    }
    paidStore.listeners.forEach((fn) => fn());
  },
};

/**
 * Paywall state, and the one bit of it that has to survive the modal closing.
 *
 * Closing the account step after paying must not strand anyone: the payment
 * happened, so the flow has to be resumable. Until there is a processor and a
 * QR table, "you paid" lives in sessionStorage — enough to bring the customer
 * back to a locked code and a Complete your account button in the same
 * session, and deliberately not enough to unlock a download on its own, since
 * anything the browser owns the browser can forge.
 *
 * Entitlement is the session cookie, granted only once an account exists.
 * This flag decides what we OFFER, never what we GRANT.
 */
export function usePaywall() {
  const [stage, setStage] = useState<PaywallStage>(null);
  const paidAwaitingAccount = useSyncExternalStore(
    paidStore.subscribe,
    paidStore.get,
    () => false,
  );

  return {
    stage,
    paidAwaitingAccount,

    /** Opens at whichever step the customer has not finished yet. */
    open: useCallback(
      () => setStage(paidAwaitingAccount ? "account" : "pay"),
      [paidAwaitingAccount],
    ),
    close: useCallback(() => setStage(null), []),

    markPaid: useCallback(() => {
      paidStore.set(true);
      setStage("account");
    }, []),

    /**
     * Drop the flag without touching the modal — for when entitlement has
     * arrived by another route (they signed in) and "paid, no account yet"
     * is no longer true.
     */
    forgetPaid: useCallback(() => {
      if (paidStore.get()) paidStore.set(false);
    }, []),
  };
}
