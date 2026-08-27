"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { env } from "@/lib/env";
import { sendSignInLink } from "@/lib/mail";

export type SignInState = { sent?: boolean; error?: string } | undefined;

/** Long enough to find the mail, short enough to matter if it leaks. */
const LINK_TTL_MS = 15 * 60 * 1000;

/**
 * Email a passwordless sign-in link.
 *
 * The reply is the same whether or not the address has an account. That is
 * the whole point: this endpoint is unauthenticated and anyone may call it,
 * so a reply that distinguished "sent" from "no such user" would let a
 * stranger test addresses against the member list. The person who owns the
 * inbox learns the answer; nobody else does.
 *
 * (The paywall's `checkout` cannot do this, and says so in its own comment:
 * it has to refuse a duplicate address to avoid signing a stranger into an
 * existing account, and that refusal is visible. Here there is no such
 * pressure, so this stays quiet.)
 */
export async function requestSignInLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (!env.emailConfigured) {
    // Better a plain refusal than a "check your inbox" that never arrives.
    return {
      error: "Email sign-in isn't available yet. Please try again later.",
    };
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user) {
    const token = crypto.randomUUID();
    await db.insert(verificationTokens).values({
      identifier: `paywall:${user.id}`,
      token,
      expires: new Date(Date.now() + LINK_TTL_MS),
    });

    try {
      await sendSignInLink(email, token);
    } catch (err) {
      // The reason stays on the server: it names the address, and the
      // browser has no use for Resend's diagnostics.
      console.error("[signin] could not send link:", err);
      // Do not leave a usable token behind a send that failed.
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token));
      return { error: "We couldn't send the email. Please try again." };
    }
  }

  // Same answer either way. See the note above.
  return { sent: true };
}
