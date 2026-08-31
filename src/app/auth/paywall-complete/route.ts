import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

/**
 * Where the paywall's "Continue with Google" lands after the OAuth round
 * trip: mark the freshly signed-in account as trial, then hand over to the
 * dashboard.
 *
 * SECURITY — this endpoint grants a trial to any signed-in visitor who
 * requests it, with no proof of payment, because no payment processor exists
 * yet. That is exactly what `checkout` already grants to anyone who types an
 * unused email, so this adds convenience, not exposure. Two deliberate
 * limits: it requires a session (identity is real, unlike checkout's bare
 * email), and it only ever moves `free` -> `trial` — a paid plan is never
 * touched, so replaying the URL is worthless. Fold this into the processor
 * webhook the day one lands.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const id = session?.user?.id;

  if (!id) {
    return NextResponse.redirect(new URL("/?signin=1", request.nextUrl.origin));
  }

  await db
    .update(users)
    .set({ plan: "trial" })
    .where(and(eq(users.id, id), eq(users.plan, "free")));

  return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
}
