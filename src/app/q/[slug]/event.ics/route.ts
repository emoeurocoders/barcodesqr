import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { icsFile } from "@/lib/calendar";

/**
 * The hosted event's "Add to Calendar" for Apple Calendar and anything else
 * that takes a file (JB, 2026-11-02). A real URL rather than a download made
 * in the browser: iPhones only offer "Add to Calendar" for a .ics they fetch.
 * Nothing is added until the visitor confirms in their own calendar.
 */

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[A-Za-z0-9]{6,16}$/.test(slug)) return new NextResponse("Not found", { status: 404 });
  const [row] = await db
    .select({ type: qrCodes.type, values: qrCodes.values })
    .from(qrCodes)
    .where(eq(qrCodes.slug, slug))
    .limit(1);
  if (!row || row.type !== "event") return new NextResponse("Not found", { status: 404 });

  const body = icsFile(row.values, slug);
  if (!body) return new NextResponse("Not found", { status: 404 });
  const name = (row.values.eventTitle ?? "").replace(/[^\w\- ]+/g, "").trim() || "event";
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${name}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
