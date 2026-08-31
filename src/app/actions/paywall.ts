"use server";

import { eq } from "drizzle-orm";

import { signIn } from "@/auth";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { env } from "@/lib/env";

export type PaywallFormState = { error?: string } | undefined;

/** How long the one-time sign-in token minted below stays usable. */
const TOKEN_TTL_MS = 10 * 60 * 1000;

/**
 * Claim the account at checkout.
 *
 * Email and card are collected on one screen now, so this runs once, at the
 * end. It receives ONLY the email: the caller builds the payload by hand
 * rather than letting the form serialise itself, precisely so the card
 * fields sitting in the same <form> never cross the network. Check
 * `CheckoutStep` before changing how this is called.
 *
 * SECURITY — read before changing:
 *
 * There is no payment processor yet, so this action has NO proof that anyone
 * paid; anything the browser can reach, an attacker can reach. That makes
 * "sign in whoever names this address" an account-takeover primitive, so this
 * deliberately only ever creates NEW accounts. If the address already exists
 * it refuses and sends the person to the login page instead.
 *
 * That refusal does leak whether an address is registered, which the rest of
 * the auth code works hard to avoid. It is the lesser problem: an enumeration
 * oracle costs privacy, signing a stranger into someone else's account costs
 * them the account. The honest fix for both is a real processor webhook (proof
 * of payment) plus an emailed link (proof of address); this comment should be
 * deleted the day either lands.
 */
export async function checkout(
  _prev: PaywallFormState,
  formData: FormData,
): Promise<PaywallFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return {
      error:
        "That email already has an account. Sign in and your QR code will be waiting.",
    };
  }

  // Passwordless: `password_hash` stays null, which the schema already treats
  // as a real state for accounts that never set one.
  let userId: string;
  try {
    const [created] = await db
      .insert(users)
      .values({ email, plan: "trial" })
      .returning({ id: users.id });
    userId = created.id;
  } catch {
    return { error: "We couldn't finish setting up your account." };
  }

  // Mint a single-use token and immediately spend it. The round trip through
  // the provider is what lets Auth.js issue the session; the token is deleted
  // on use, so it is worthless if it ever leaks.
  const token = crypto.randomUUID();
  await db.insert(verificationTokens).values({
    identifier: `paywall:${userId}`,
    token,
    expires: new Date(Date.now() + TOKEN_TTL_MS),
  });

  // Throws a redirect on success, so anything below is the failure path.
  await signIn("paywall-token", { token, redirectTo: "/dashboard" });
  return undefined;
}

/**
 * Claim the account at checkout via Google instead of an email address.
 *
 * The OAuth round trip replaces both proofs the email path fakes: Google
 * vouches for the address, and signing into an EXISTING account is fine here
 * — unlike `checkout` above, identity has actually been proven. What it does
 * NOT prove is payment: there is still no processor, so the completion route
 * this lands on grants the same unpaid trial the email path grants, and the
 * card step is skipped entirely. That is a deliberate, documented state —
 * see the SECURITY comment on `checkout`; both paths get honest the day a
 * processor webhook lands.
 */
export async function checkoutWithGoogle(): Promise<PaywallFormState> {
  if (!env.googleConfigured) {
    return {
      error: "Google sign-in isn't available yet. Please use your email.",
    };
  }
  await signIn("google", { redirectTo: "/auth/paywall-complete" });
  return undefined;
}
