"use client";

import type { QrStyle } from "@/components/create/QrPreview";
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
  if (!open) return null;

  return (
    <PaywallShell onClose={onClose}>
      <CheckoutStep qrValue={qrValue} qrStyle={qrStyle} />
    </PaywallShell>
  );
}
