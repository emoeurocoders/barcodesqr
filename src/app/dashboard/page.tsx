import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { ReadyBanner } from "@/components/dashboard/ReadyBanner";
import { QrTable } from "@/components/dashboard/QrTable";
import { sampleRows } from "@/components/dashboard/sampleRows";
import { SlimFooter } from "@/components/layout/SlimFooter";

export const metadata: Metadata = {
  title: "My QR Codes — BarcodesQR",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <div className="flex flex-1 bg-white">
        <Sidebar current="My QR Codes" user={session.user} />

        <main className="min-w-0 flex-1">
          <Toolbar />
          <ReadyBanner />
          <QrTable rows={sampleRows} />
        </main>
      </div>
      <SlimFooter />
    </>
  );
}
