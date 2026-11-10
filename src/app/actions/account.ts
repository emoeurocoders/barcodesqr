"use server";

import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

import { auth, signOut } from "@/auth";
import { db } from "@/db";
import { qrCodes, users, verificationTokens } from "@/db/schema";
import { env } from "@/lib/env";
import { sendEmailChangeLink } from "@/lib/mail";
import { deleteUploads, uploadKeysIn } from "@/lib/storage";
import { countries } from "@/lib/countries";

/**
 * My Account (member_myaccount.html). Every action reads the signed-in user
 * from the session and touches only that row — the browser never names an
 * account, so one customer cannot reach another's.
 */

type Result = { ok: true; note?: string } | { ok: false; error: string; fields?: Record<string, string> };

async function me() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

const SIGNED_OUT: Result = { ok: false, error: "Your session has ended. Please sign in again." };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/* ---- Profile ------------------------------------------------------------- */

export async function updateProfile(_prev: unknown, form: FormData): Promise<Result> {
  const user = await me();
  if (!user) return SIGNED_OUT;

  const firstName = clip(form.get("firstName"), 60);
  const lastName = clip(form.get("lastName"), 60);
  const email = clip(form.get("email"), 254).toLowerCase();
  const phone = clip(form.get("phone"), 40);
  const company = clip(form.get("company"), 100);
  const country = clip(form.get("country"), 2).toUpperCase();

  // The page's own rules (member_account.js) and messages.
  const fields: Record<string, string> = {};
  if (!firstName) fields.firstName = "Please enter your first name.";
  if (!lastName) fields.lastName = "Please enter your last name.";
  if (!EMAIL.test(email)) fields.email = "Please enter a valid email address.";
  if (!countries.some((c) => c.code === country)) fields.country = "Please select your country.";
  if (phone && !/^[+\d][\d\s().-]{5,}$/.test(phone)) fields.phone = "Please enter a valid phone number.";
  if (Object.keys(fields).length) return { ok: false, error: "Please check the highlighted fields.", fields };

  await db
    .update(users)
    .set({ firstName, lastName, phone: phone || null, company: company || null, country, name: `${firstName} ${lastName}` })
    .where(eq(users.id, user.id));

  // A new sign-in address only counts once its inbox agrees (JB): send a
  // link there and change nothing until it is opened.
  if (email !== (user.email ?? "")) {
    const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (taken) return { ok: false, error: "Your other changes are saved.", fields: { email: "That email address is already used by another account." } };
    if (!env.emailConfigured) {
      return {
        ok: false,
        error: "Your other changes are saved.",
        fields: { email: "Changing your email needs a confirmation email, which isn't available yet. Your current email stays in use." },
      };
    }
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, `email-change:${user.id}`));
    const token = crypto.randomUUID();
    await db.insert(verificationTokens).values({
      identifier: `email-change:${user.id}`,
      // The new address rides in the token row, not the link.
      token: `${token}|${email}`,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    try {
      await sendEmailChangeLink(email, `${token}|${email}`);
    } catch (e) {
      console.error("[account] email change send failed", e);
      await db.delete(verificationTokens).where(eq(verificationTokens.identifier, `email-change:${user.id}`));
      return { ok: false, error: "Your other changes are saved.", fields: { email: "We couldn't send the confirmation email. Please try again." } };
    }
    return { ok: true, note: `Your profile has been updated. We sent a link to ${email} — your email changes once you open it.` };
  }
  return { ok: true };
}

/** Spend an email-change link; called by /auth/confirm-email. */
export async function confirmEmailChange(raw: string): Promise<boolean> {
  const [row] = await db.select().from(verificationTokens).where(eq(verificationTokens.token, raw)).limit(1);
  if (!row || !row.identifier.startsWith("email-change:") || row.expires < new Date()) return false;
  const userId = row.identifier.slice("email-change:".length);
  const email = raw.split("|")[1];
  await db.delete(verificationTokens).where(eq(verificationTokens.token, raw));
  if (!email || !EMAIL.test(email)) return false;
  const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (taken && taken.id !== userId) return false;
  await db.update(users).set({ email, emailVerified: new Date() }).where(eq(users.id, userId));
  return true;
}

/* ---- Password ------------------------------------------------------------ */

export async function changePassword(_prev: unknown, form: FormData): Promise<Result> {
  const user = await me();
  if (!user) return SIGNED_OUT;
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const fields: Record<string, string> = {};
  // Re-authentication: whoever changes a password must know the current one.
  // An account that never had one (it signs in by email link or Google) is
  // already proven by the session it is using.
  if (user.passwordHash && !(await bcrypt.compare(current, user.passwordHash))) fields.current = "That isn't your current password.";
  if (next.length < 8) fields.next = "Use at least 8 characters.";
  else if (next.length > 72) fields.next = "Use 72 characters or fewer.";
  if (next !== confirm) fields.confirm = "The two passwords don't match.";
  if (Object.keys(fields).length) return { ok: false, error: "Please check the highlighted fields.", fields };

  await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(next, 12), passwordUpdatedAt: new Date() })
    .where(eq(users.id, user.id));
  return { ok: true, note: user.passwordHash ? "Your password has been changed." : "Your password is set. You can now also sign in with your email and password." };
}

/* ---- Preferences --------------------------------------------------------- */

export async function updatePreferences(_prev: unknown, form: FormData): Promise<Result> {
  const user = await me();
  if (!user) return SIGNED_OUT;
  const tz = clip(form.get("timezone"), 64);
  if (tz) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz });
    } catch {
      return { ok: false, error: "Please choose a time zone from the list.", fields: { timezone: "Please choose a time zone from the list." } };
    }
  }
  // English is the only language BarcodesQR has (JB: offer only those).
  await db.update(users).set({ timezone: tz || null, language: "en" }).where(eq(users.id, user.id));
  return { ok: true };
}

/* ---- Delete account ------------------------------------------------------ */

export async function deleteAccount(_prev: unknown, form: FormData): Promise<Result> {
  const user = await me();
  if (!user) return SIGNED_OUT;
  if (String(form.get("confirm") ?? "").trim().toUpperCase() !== "DELETE") {
    return { ok: false, error: "Type DELETE to confirm.", fields: { confirm: "Type DELETE to confirm." } };
  }
  // A second proof where there is one: the password.
  if (user.passwordHash && !(await bcrypt.compare(String(form.get("password") ?? ""), user.passwordHash))) {
    return { ok: false, error: "That isn't your password.", fields: { password: "That isn't your password." } };
  }

  // The uploaded files go too — the page promises "your stored data is
  // removed". Best effort: a storage hiccup must not keep an account alive
  // that the customer asked to delete, so it is logged and the rest goes on.
  const codes = await db.select({ values: qrCodes.values }).from(qrCodes).where(eq(qrCodes.userId, user.id));
  try {
    await deleteUploads(codes.flatMap((c) => uploadKeysIn(c.values)));
  } catch (e) {
    console.error("[account] upload cleanup failed for", user.id, e);
  }
  // Codes, sessions and linked sign-ins cascade with the user row.
  await db.delete(verificationTokens).where(and(eq(verificationTokens.identifier, `email-change:${user.id}`)));
  await db.delete(users).where(eq(users.id, user.id));
  await signOut({ redirectTo: "/?deleted=1" });
  return { ok: true };
}
