import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { and, asc, desc, eq, ilike } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { qrCodes, users } from "@/db/schema";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { ReadyBanner } from "@/components/dashboard/ReadyBanner";
import { QrTable } from "@/components/dashboard/QrTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ClaimPendingQr } from "@/components/dashboard/ClaimPendingQr";
import { NoMatches } from "@/components/dashboard/NoMatches";
import { toQrRow } from "@/lib/qrRows";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { ReviewPromptGate } from "@/components/review/ReviewPromptGate";

export const metadata: Metadata = {
  title: "My QR Codes — BarcodesQR",
};

const planLabel = {
  free: "Free",
  trial: "Trial",
  quarterly: "Quarterly",
  biannual: "Biannual",
} as const;

/** The sort menu's options; the first is what "Date created" means. */
const sorts = {
  newest: desc(qrCodes.createdAt),
  oldest: asc(qrCodes.createdAt),
  name: asc(qrCodes.name),
} as const;
export type DashboardSort = keyof typeof sorts;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; new?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
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

  const q = (params.q ?? "").trim().slice(0, 100);
  const sort: DashboardSort =
    params.sort && params.sort in sorts ? (params.sort as DashboardSort) : "newest";

  // Search matches the name the customer gave the code. `%`/`_` are escaped
  // so a search for "50%" means the characters, not a wildcard.
  const pattern = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const saved = await db
    .select({
      id: qrCodes.id,
      type: qrCodes.type,
      name: qrCodes.name,
      values: qrCodes.values,
      createdAt: qrCodes.createdAt,
      slug: qrCodes.slug,
      scans: qrCodes.scans,
    })
    .from(qrCodes)
    .where(
      q
        ? and(eq(qrCodes.userId, session.user.id!), ilike(qrCodes.name, pattern))
        : eq(qrCodes.userId, session.user.id!),
    )
    .orderBy(sorts[sort], desc(qrCodes.createdAt))
    .limit(500);
  const rows = saved.map((r) => toQrRow(r, params.new, params.updated));
  const justSaved = rows.find((r) => r.highlight);

  return (
    <>
      <div className="flex flex-1 bg-white">
        <Sidebar
          current="My QR Codes"
          // The plan from the row read above, not the token, which never
          // carried one — the sidebar said "Free Plan" to paying customers.
          user={{ ...session.user, plan: planLabel[row?.plan ?? "free"] }}
        />

        <main className="min-w-0 flex-1">
          <Toolbar q={q} sort={sort} />
          {/* Codes made before checkout are saved here, on arrival. */}
          <ClaimPendingQr />
          {rows.length > 0 ? (
            <>
              {justSaved && <ReadyBanner row={justSaved} edited={!justSaved.isNew} />}
              <QrTable rows={rows} />
            </>
          ) : q ? (
            <NoMatches q={q} />
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
