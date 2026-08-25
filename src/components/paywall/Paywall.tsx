"use client";

import type { QrStyle } from "@/components/create/QrPreview";
import { PaywallShell } from "./PaywallShell";
import { PayStep } from "./PayStep";
import { AccountStep } from "./AccountStep";
import type { PaywallStage } from "./usePaywall";

/**
 * The paywall lightbox: checkout, then account.
 *
 * Rendered by whoever owns the state so the QR being bought is the one on
 * screen, not a stand-in.
 */
export function Paywall({
  stage,
  qrValue,
  qrStyle,
  onClose,
  onPaid,
}: {
  stage: PaywallStage;
  qrValue: string;
  qrStyle: QrStyle;
  onClose: () => void;
  onPaid: () => void;
}) {
  if (!stage) return null;

  return (
    <PaywallShell
      onClose={onClose}
      closeLabel={
        stage === "account"
          ? "Close — your QR code stays saved until you finish"
          : "Close"
      }
    >
      {stage === "pay" ? (
        <PayStep qrValue={qrValue} qrStyle={qrStyle} onPaid={onPaid} />
      ) : (
        <AccountStep qrValue={qrValue} qrStyle={qrStyle} />
      )}
    </PaywallShell>
  );
}
