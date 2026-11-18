import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { RETENTION_DAYS } from "@/lib/scans";

/**
 * Nightly (vercel.json): keep statistics only as long as each owner's plan
 * promises — 180 days on Bi-Annual, 90 otherwise (the pricing section) — and
 * drop the per-day visitor list once its day can no longer gain scans.
 * Lifetime totals on qr_code.scans are kept.
 *
 * Vercel Cron calls with `Authorization: Bearer $CRON_SECRET`; anything else
 * is refused, so nobody can trigger deletions from outside.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  // Integers written into the SQL (they are our constants): as parameters
  // they arrive untyped and "date - $1" has no operator to resolve to.
  const keep = sql.raw(`(case when u.plan = 'biannual' then ${Number(RETENTION_DAYS.biannual)} else ${Number(RETENTION_DAYS.default)} end)`);
  const events = await db.execute(sql`
    delete from scan_event e using "user" u
    where e.user_id = u.id and e.at < now() - ${keep} * interval '1 day'`);
  const days = await db.execute(sql`
    delete from scan_daily d using "user" u
    where d.user_id = u.id and d.day < current_date - ${keep}`);
  const visitors = await db.execute(sql`delete from scan_visitor_day where day < current_date - 2`);
  const n = (r: unknown) => (r as { rowCount?: number }).rowCount ?? 0;
  return NextResponse.json({ events: n(events), days: n(days), visitors: n(visitors) });
}
