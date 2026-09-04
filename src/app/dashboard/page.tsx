import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { ReadyBanner } from "@/components/dashboard/ReadyBanner";
import { QrTable } from "@/components/dashboard/QrTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { QrRow } from "@/components/dashboard/QrTable";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { ReviewPromptGate } from "@/components/review/ReviewPromptGate";

export const metadata: Metadata = {
  title: "My QR Codes — BarcodesQR",
};

export default async function DashboardPage() {
  const session = await auth();
  // Sign-in lives in a modal now, so send them home with it open.
  if (!session?.user) redirect("/?signin=1");

  /**
   * Entitlement for the review prompt, read from the database rather than the
   * session token — the plan can change between sign-in and now, and a JWT
   * minted before checkout would still say "free" for thirty days. Same
   * reasoning as `canDownload` on the create page.
   *
   * Nothing sets `plan` away from "free" yet, so this is false for everyone
   * until billing lands. That is the correct behaviour, not a stub.
   */
  const [row] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, session.user.id!))
    .limit(1);
  const paid = !!row && row.plan !== "free";

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

      {/*
        "How was your experience?" — shown here, on the member page AFTER a
        download, never over the download itself. The gate decides; see
        lib/reviewPrompt.ts for the rules and for what is still unwired.
      */}
      <ReviewPromptGate paid={paid} />
    </>
  );
}
