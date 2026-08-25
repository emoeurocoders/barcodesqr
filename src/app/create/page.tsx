import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
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
async function canDownload() {
  const session = await auth();
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
 * footer, the shell is exactly viewport height, and the form area scrolls
 * inside the card rather than the window.
 */
export default async function CreatePage() {
  return (
    <div className="flex h-dvh flex-col bg-bg-alt p-2.5 sm:p-4">
      <CreateWizard entitled={await canDownload()} />
    </div>
  );
}
