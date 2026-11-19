import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { qrCodes, users } from "@/db/schema";
import { MembersShell } from "@/components/members/MembersShell";
import { StatsView } from "@/components/members/StatsView";
import { MainSlimFooter } from "@/components/layout/MainSlimFooter";
import { planLabel, shellName } from "@/lib/members";
import { retentionFor } from "@/lib/scans";
import { loadStats } from "@/lib/stats";
import { isDynamic } from "@/components/create/encodeQr";

export const metadata: Metadata = { title: "Statistics — BarcodesQR" };

/** member_stats.html. Only the signed-in customer's own codes and scans. */
export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; qr?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (!session?.user?.id) redirect("/?signin=1");
  const [u] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!u) redirect("/?signin=1");

  // No range longer than the plan keeps (90 / 180 days).
  const keep = retentionFor(u.plan);
  const ranges = [7, 30, 90, 180].filter((d) => d <= keep);
  const days = ranges.includes(Number(params.days)) ? Number(params.days) : 30;
  const rows = await db
    .select({
      id: qrCodes.id,
      name: qrCodes.name,
      type: qrCodes.type,
      values: qrCodes.values,
    })
    .from(qrCodes)
    .where(eq(qrCodes.userId, u.id))
    .orderBy(asc(qrCodes.name));
  // Tracked = its scans pass through /q (hosted types, managed Website).
  const codes = rows.map((r) => ({
    id: r.id,
    name: r.name,
    tracked: isDynamic(r.type, r.values),
  }));
  // A filter naming someone else's code is ignored, not obeyed.
  const qr = codes.some((c) => c.id === params.qr) ? params.qr! : "";
  const stats = await loadStats(u.id, {
    days,
    qrId: qr || undefined,
    timezone: u.timezone,
  });

  return (
    <MembersShell
      current="Statistics"
      user={{ name: shellName(u), plan: planLabel(u.plan) }}
    >
      <main className="flex flex-1 flex-col px-[24px] pt-[21px] leading-[normal]">
        <StatsView s={stats} ranges={ranges} codes={codes} qr={qr} />
        <div className="flex-1" />
        <MainSlimFooter inApp />
      </main>
    </MembersShell>
  );
}
