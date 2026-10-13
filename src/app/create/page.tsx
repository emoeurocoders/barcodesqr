import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { CreateWizard } from "@/components/create/CreateWizard";
import { Header } from "@/components/layout/Header";

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
 * On desktop the creator is a full-screen app, not a marketing page: no site
 * header or footer, the shell is exactly viewport height, and the form area
 * scrolls inside the card rather than the window.
 *
 * Below `md` it is create_mobile*.html instead: the site header on top and
 * an ordinary scrolling page under it. Their files end in the site footer
 * too; the PM asked for the body only, so it is left off.
 */
export default async function CreatePage() {
  const session = await auth();
  return (
    // `pt-px`: in create_mobile*.html the drawer sits inside the header, so
    // their `#mainHdr + section { margin-top: 71px }` applies — one more than
    // the 70px the shared header clears on mobile.
    <div className="bg-white pt-px md:flex md:h-dvh md:flex-col md:bg-bg-alt md:p-4">
      <div className="md:hidden">
        <Header user={session?.user} />
      </div>
      <CreateWizard entitled={await canDownload(session)} />
    </div>
  );
}
