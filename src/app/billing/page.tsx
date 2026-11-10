import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { MembersShell } from "@/components/members/MembersShell";
import { BillingView } from "@/components/members/BillingView";
import { MainSlimFooter } from "@/components/layout/MainSlimFooter";
import { planLabel, shellName } from "@/lib/members";

export const metadata: Metadata = { title: "Billing & Subscription — BarcodesQR" };

/** member_billing.html. Only ever the signed-in customer's own account. */
export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/?signin=1");
  const [u] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!u) redirect("/?signin=1");
  const since = u.createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: u.timezone || "UTC",
  });

  return (
    <MembersShell current="Billing & Subscription" user={{ name: shellName(u), plan: planLabel(u.plan) }}>
      <main className="flex flex-1 flex-col px-[24px] pt-[21px] leading-[normal]">
        <BillingView d={{ plan: u.plan, planName: planLabel(u.plan), since }} />
        <div className="flex-1" />
        <MainSlimFooter inApp />
      </main>
    </MembersShell>
  );
}
