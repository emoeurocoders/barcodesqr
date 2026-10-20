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
    // 400px wide below `lg`, as modal_join.html's ≤992px rule sets it; the
    // two-column 976px card above.
    <PaywallShell onClose={onClose} maxWidth="max-w-[400px] lg:max-w-[976px]">
      <CheckoutStep qrValue={qrValue} qrStyle={qrStyle} />
    </PaywallShell>
  );
}
