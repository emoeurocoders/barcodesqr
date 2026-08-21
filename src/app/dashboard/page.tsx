import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { ReadyBanner } from "@/components/dashboard/ReadyBanner";
import { QrTable } from "@/components/dashboard/QrTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { QrRow } from "@/components/dashboard/QrTable";
import { SlimFooter } from "@/components/layout/SlimFooter";

export const metadata: Metadata = {
  title: "My QR Codes — BarcodesQR",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Saving codes to an account lands next; until then there is nothing to
  // list. Point this at the query when it exists — the table below already
  // renders whatever rows it is handed.
  const rows: QrRow[] = [];

  return (
    <>
      <div className="flex flex-1 bg-white">
        <Sidebar current="My QR Codes" user={session.user} />

        <main className="min-w-0 flex-1">
          <Toolbar />
          {rows.length > 0 ? (
            <>
              <ReadyBanner />
              <QrTable rows={rows} />
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
      <SlimFooter />
    </>
  );
}
