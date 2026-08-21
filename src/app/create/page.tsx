import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { StepRail } from "@/components/create/StepRail";
import { TypePicker } from "@/components/create/TypePicker";

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
          <div className="overflow-hidden rounded-2xl border border-line/80 bg-white shadow-soft">
            <StepRail current={1} />
            <TypePicker />
          </div>
        </div>
      </main>
      <SlimFooter />
    </>
  );
}
