import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { MembersShell } from "@/components/members/MembersShell";
import { AccountView } from "@/components/members/AccountView";
import { MainSlimFooter } from "@/components/layout/MainSlimFooter";
import { planLabel, shellName } from "@/lib/members";

export const metadata: Metadata = { title: "My Account — BarcodesQR" };

/** member_myaccount.html. Only ever the signed-in customer's own row. */
export default async function AccountPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (!session?.user?.id) redirect("/?signin=1");
  const [u] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  // A session whose account is gone (deleted elsewhere) is a signed-out one.
  if (!u) redirect("/?signin=1");

  return (
    <MembersShell current="My Account" user={{ name: shellName(u), plan: planLabel(u.plan) }}>
      <main className="flex flex-1 flex-col px-[24px] pt-[21px] leading-[normal]">
        <AccountView
          d={{
            firstName: u.firstName ?? (u.name ?? "").split(" ")[0] ?? "",
            lastName: u.lastName ?? (u.name ?? "").split(" ").slice(1).join(" "),
            email: u.email ?? "",
            phone: u.phone ?? "",
            company: u.company ?? "",
            country: u.country ?? "",
            timezone: u.timezone ?? "",
            hasPassword: !!u.passwordHash,
            passwordUpdatedAt: u.passwordUpdatedAt?.toISOString() ?? null,
            emailResult: params.email,
          }}
        />
        <div className="flex-1" />
        <MainSlimFooter inApp />
      </main>
    </MembersShell>
  );
}
