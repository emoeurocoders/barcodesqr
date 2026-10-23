"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { qrCodes, users } from "@/db/schema";
import { fieldSchema } from "@/components/create/fieldSchema";

/**
 * Save a finished QR code to the signed-in customer's account.
 *
 * Called two ways: straight from the creator's Next by someone who has
 * already paid, and from the dashboard when it claims a draft the browser
 * stashed before checkout (see lib/pendingQr.ts). Everything the browser sends
 * is untrusted, so it is checked here, not there.
 */

export type SaveQrInput = {
  type: string;
  name: string;
  values: Record<string, string>;
  /** The draft's random key, when this is a claimed draft. */
  draftKey?: string;
};

export type SaveQrResult = { id: string } | { error: string };

/** Every format the creator offers, by the key the encoder knows it by. */
const knownTypes = new Set(Object.keys(fieldSchema));

/**
 * Generous for any form the creator draws — the longest values are a
 * 500-character message, ten image URLs or a video thumbnail — and small
 * enough that the column cannot be used as free storage.
 */
const MAX_VALUES_JSON = 64 * 1024;

function cleanValues(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  const entries = Object.entries(raw as Record<string, unknown>);
  if (entries.length > 200) return null;
  for (const [k, v] of entries) {
    if (typeof k !== "string" || k.length > 64 || typeof v !== "string") return null;
    out[k] = v;
  }
  return JSON.stringify(out).length <= MAX_VALUES_JSON ? out : null;
}

/** The signed-in, paying customer's id — or the message to show instead. */
async function payingUser(): Promise<{ userId: string } | { error: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Please sign in to save your QR code." };

  // Saving is what payment buys; read the plan fresh, as the create page does.
  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user || user.plan === "free") {
    return { error: "Start your trial to save this QR code." };
  }
  return { userId };
}

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** 8 random base62 characters: short to print, impossible to guess or walk. */
function newSlug() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  // 256 % 62 skews a few characters very slightly; irrelevant for this.
  return Array.from(bytes, (b) => ALPHABET[b % 62]).join("");
}

const cleanName = (raw: unknown) => String(raw ?? "").trim().slice(0, 40) || "My QR Code";

export async function saveQrCode(input: SaveQrInput): Promise<SaveQrResult> {
  const who = await payingUser();
  if ("error" in who) return who;
  const { userId } = who;

  const type = String(input?.type ?? "");
  if (!knownTypes.has(type)) return { error: "That QR code type isn't supported." };

  const values = cleanValues(input?.values);
  if (!values) return { error: "That QR code couldn't be saved." };

  const name = cleanName(input?.name);
  const draftKey =
    typeof input?.draftKey === "string" && /^[A-Za-z0-9-]{8,64}$/.test(input.draftKey)
      ? input.draftKey
      : null;

  // A fresh short code per attempt; 62^8 makes a clash vanishingly rare,
  // but one is retried rather than surfacing as a failed save.
  let row: { id: string } | undefined;
  for (let attempt = 0; ; attempt++) {
    try {
      [row] = await db
        .insert(qrCodes)
        .values({ userId, type, name, values, draftKey, slug: newSlug() })
        // A draft claimed twice inserts once; the second claim finds the first.
        .onConflictDoNothing({ target: [qrCodes.userId, qrCodes.draftKey] })
        .returning({ id: qrCodes.id });
      break;
    } catch (e) {
      if (attempt >= 3 || !String((e as Error)?.message ?? e).includes("slug")) throw e;
    }
  }
  if (row) return { id: row.id };

  if (draftKey) {
    const [existing] = await db
      .select({ id: qrCodes.id })
      .from(qrCodes)
      .where(and(eq(qrCodes.userId, userId), eq(qrCodes.draftKey, draftKey)))
      .limit(1);
    if (existing) return { id: existing.id };
  }
  return { error: "That QR code couldn't be saved." };
}

/**
 * Save changes to an existing code, from the creator opened with `?edit=`.
 * The type cannot change: a different type is a different code.
 *
 * What an edit does to the printed code depends on the type — see the note
 * the creator shows while editing. Static codes carry their content, so the
 * image changes; hosted ones keep their image.
 */
export async function updateQrCode(input: {
  id: string;
  name: string;
  values: Record<string, string>;
}): Promise<SaveQrResult> {
  const who = await payingUser();
  if ("error" in who) return who;

  const values = cleanValues(input?.values);
  if (!values || typeof input?.id !== "string") return { error: "That QR code couldn't be saved." };

  const [row] = await db
    .update(qrCodes)
    .set({ name: cleanName(input.name), values, updatedAt: new Date() })
    .where(and(eq(qrCodes.id, input.id), eq(qrCodes.userId, who.userId)))
    .returning({ id: qrCodes.id });
  return row ? { id: row.id } : { error: "That QR code couldn't be found." };
}

/**
 * Delete one of the customer's codes. Only the row goes: files it uploaded
 * stay in the bucket until the reaper in LAUNCH.md exists.
 */
export async function deleteQrCode(id: string): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Please sign in." };
  if (typeof id !== "string") return { error: "That QR code couldn't be found." };
  const [row] = await db
    .delete(qrCodes)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)))
    .returning({ id: qrCodes.id });
  return row ? { ok: true } : { error: "That QR code couldn't be found." };
}
