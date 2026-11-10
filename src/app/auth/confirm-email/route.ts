import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { confirmEmailChange } from "@/app/actions/account";

/**
 * The link in "Confirm your new email address". The change happens here, on
 * the new inbox's say-so, and lands on My Account saying how it went.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const ok = token ? await confirmEmailChange(token) : false;
  return NextResponse.redirect(new URL(`/account?email=${ok ? "changed" : "invalid"}`, request.nextUrl.origin));
}
