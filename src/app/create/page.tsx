import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { CreateWizard } from "@/components/create/CreateWizard";

export const metadata: Metadata = {
  title: "Create a QR code — BarcodesQR",
  description:
    "Choose a QR code type and create a dynamic, editable QR code in seconds.",
};

export default function CreatePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f7f9]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-8 md:py-10">
          <CreateWizard />
        </div>
      </main>
      <SlimFooter />
    </>
  );
}
