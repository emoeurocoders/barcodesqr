import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import type { Session } from "next-auth";

import { auth } from "@/auth";
import { db } from "@/db";
import { qrCodes, users } from "@/db/schema";
import { CreateWizard } from "@/components/create/CreateWizard";

export const metadata: Metadata = {
  title: "Create a QR code — BarcodesQR",
  description:
    "Choose a QR code type and create a dynamic, editable QR code in seconds.",
};

/**
 * Whether this visitor may download what they build.
 *
 * Read from the database rather than the session token: the plan can change
 * between sign-in and now, and a JWT minted before checkout would still say
 * "free" for thirty days.
 */
async function canDownload(session: Session | null) {
  const id = session?.user?.id;
  if (!id) return false;

  const [row] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return !!row && row.plan !== "free";
}

/**
 * The creator is a full-screen app, not a marketing page: no site header or
 * footer. On desktop the shell is exactly viewport height and the form area
 * scrolls inside the card rather than the window; below `md`
 * (create_mobile*.html) it is an ordinary scrolling page. JB, 2026-10-15:
 * no logo or menu anywhere in the mobile create flow.
 */
/**
 * The code being edited, when the dashboard sent us here with `?edit=` —
 * only ever one of the signed-in customer's own.
 */
async function editingCode(session: Session | null, id: string | undefined) {
  const userId = session?.user?.id;
  if (!userId || !id) return undefined;
  const [row] = await db
    .select({ id: qrCodes.id, type: qrCodes.type, name: qrCodes.name, values: qrCodes.values })
    .from(qrCodes)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)))
    .limit(1);
  return row;
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const [session, { edit }] = await Promise.all([auth(), searchParams]);
  const [entitled, editing] = await Promise.all([canDownload(session), editingCode(session, edit)]);
  return (
    // The wizard draws its own shell: step 1 is a page, step 2 a card.
    // Keyed on the code being edited, so its values seed a fresh wizard.
    <CreateWizard key={editing?.id ?? "new"} entitled={entitled} editing={editing} />
  );
}
