import { NextResponse } from "next/server";
import { and, asc, eq, gte } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { qrCodes, scanEvents, users } from "@/db/schema";
import { retentionFor } from "@/lib/scans";

/**
 * "Export data": the signed-in customer's scans in the chosen range, one row
 * each, as CSV. Bots are left out, as everywhere; the visitor hash is not
 * exported — it is only meaningful inside a day and identifies no one.
 */
export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // Quote everything; neutralise spreadsheet formulas (=, +, -, @).
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Please sign in.", { status: 401 });
  const [u] = await db.select({ id: users.id, plan: users.plan }).from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!u) return new NextResponse("Please sign in.", { status: 401 });

  const url = new URL(request.url);
  const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 30, 1), retentionFor(u.plan));
  const qr = url.searchParams.get("qr") || "";
  const since = new Date(Date.now() - days * 86_400_000);

  const rows = await db
    .select({
      at: scanEvents.at,
      name: qrCodes.name,
      type: qrCodes.type,
      country: scanEvents.country,
      region: scanEvents.region,
      city: scanEvents.city,
      device: scanEvents.device,
      os: scanEvents.os,
      browser: scanEvents.browser,
      referrer: scanEvents.referrer,
    })
    .from(scanEvents)
    .innerJoin(qrCodes, eq(qrCodes.id, scanEvents.qrId))
    .where(and(eq(scanEvents.userId, u.id), eq(scanEvents.bot, false), gte(scanEvents.at, since), qr ? eq(scanEvents.qrId, qr) : undefined))
    .orderBy(asc(scanEvents.at))
    .limit(200_000);

  const head = ["Time (UTC)", "QR code", "Type", "Country", "Region", "City", "Device", "OS", "Browser", "Referrer"];
  const body = rows.map((r) => [r.at.toISOString(), r.name, r.type, r.country, r.region, r.city, r.device, r.os, r.browser, r.referrer].map(cell).join(","));
  return new NextResponse([head.map(cell).join(","), ...body].join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="barcodesqr-scans-last-${days}-days.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
