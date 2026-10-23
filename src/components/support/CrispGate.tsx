"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Our support chat, except on hosted QR pages (/q/…): those are the
 * customer's page, seen by their visitors, not ours.
 */
export function CrispGate({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path?.startsWith("/q/")) return null;
  return <>{children}</>;
}
