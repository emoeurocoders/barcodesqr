import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { signIn } from "@/auth";

/**
 * Spend a sign-in link.
 *
 * The token is validated and deleted inside the `paywall-token` provider, so
 * this route only has to hand it over and let Auth.js issue the session. A
 * bad or expired token lands back on the home page with the modal open,
 * rather than on an error screen that says which of the two it was.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/?signin=1", request.nextUrl.origin));
  }

  try {
    // Throws a redirect to /dashboard on success.
    await signIn("paywall-token", { token, redirectTo: "/dashboard" });
  } catch (err) {
    // A redirect is how success leaves this function; let it through.
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return NextResponse.redirect(
      new URL("/?signin=expired", request.nextUrl.origin),
    );
  }

  return NextResponse.redirect(new URL("/?signin=expired", request.nextUrl.origin));
}
