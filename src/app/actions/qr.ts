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

export async function saveQrCode(input: SaveQrInput): Promise<SaveQrResult> {
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

  const type = String(input?.type ?? "");
  if (!knownTypes.has(type)) return { error: "That QR code type isn't supported." };

  const values = cleanValues(input?.values);
  if (!values) return { error: "That QR code couldn't be saved." };

  const name = String(input?.name ?? "").trim().slice(0, 40) || "My QR Code";
  const draftKey =
    typeof input?.draftKey === "string" && /^[A-Za-z0-9-]{8,64}$/.test(input.draftKey)
      ? input.draftKey
      : null;

  const [row] = await db
    .insert(qrCodes)
    .values({ userId, type, name, values, draftKey })
    // A draft claimed twice inserts once; the second claim finds the first.
    .onConflictDoNothing({ target: [qrCodes.userId, qrCodes.draftKey] })
    .returning({ id: qrCodes.id });
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
