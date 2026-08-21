"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD = 8;

export type AuthFormState = { error?: string } | undefined;

const normalise = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

/**
 * Create an account, then sign the new user straight in.
 *
 * Errors are deliberately vague about whether an email is already registered —
 * a signup form that says "this email exists" is an account-enumeration oracle.
 * The duplicate case reads the same as a validation failure to the caller.
 */
export async function registerUser(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalise(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters.` };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return {
      error:
        "We couldn't create your account. Please check your details and try again.",
    };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    await db.insert(users).values({
      name: name || null,
      email,
      passwordHash,
    });
  } catch {
    return {
      error:
        "We couldn't create your account. Please check your details and try again.",
    };
  }

  // Signing in throws a redirect on success, so anything after this is the
  // failure path.
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return undefined;
}

/** Sign in with email and password. */
export async function loginUser(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = normalise(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    // next/navigation signals a successful redirect by throwing; let it pass.
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "We couldn't sign you in. Double-check your email and password, then try again."
            : "Something went wrong. Please try again.",
      };
    }
    throw error;
  }

  return undefined;
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
