"use client";

import { useState } from "react";
import type { QrStyle } from "@/components/create/QrPreview";
import { LoginModal } from "@/components/auth/LoginModal";
import { PaywallShell } from "./PaywallShell";
import { CheckoutStep } from "./CheckoutStep";

/**
 * The paywall lightbox.
 *
 * Rendered by whoever owns the state so the QR being bought is the one on
 * screen, not a stand-in.
 */
export function Paywall({
  open,
  qrValue,
  qrStyle,
  onClose,
}: {
  open: boolean;
  qrValue: string;
  qrStyle: QrStyle;
  onClose: () => void;
}) {
  // A member who reached the join form (Tami, 2026-11-03: "no way to login
  // as a member"). The code being built is already stashed in the browser;
  // signing in lands on the dashboard, which saves it.
  const [login, setLogin] = useState(false);
  if (!open) return null;
  if (login) return <LoginModal onClose={() => { setLogin(false); onClose(); }} />;

  return (
    // 400px wide below `lg`, as modal_join.html's ≤992px rule sets it; the
    // two-column 976px card above.
    <PaywallShell onClose={onClose} maxWidth="max-w-[400px] lg:max-w-[976px]">
      <CheckoutStep qrValue={qrValue} qrStyle={qrStyle} onLogin={() => setLogin(true)} />
    </PaywallShell>
  );
}
