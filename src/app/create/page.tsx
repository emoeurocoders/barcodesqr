import type { Metadata } from "next";
import { CreateWizard } from "@/components/create/CreateWizard";

export const metadata: Metadata = {
  title: "Create a QR code — BarcodesQR",
  description:
    "Choose a QR code type and create a dynamic, editable QR code in seconds.",
};

/**
 * The creator is a full-screen app, not a marketing page: no site header or
 * footer, the shell is exactly viewport height, and the form area scrolls
 * inside the card rather than the window.
 */
export default function CreatePage() {
  return (
    <div className="flex h-dvh flex-col bg-bg-alt p-2.5 sm:p-4">
      <CreateWizard />
    </div>
  );
}
