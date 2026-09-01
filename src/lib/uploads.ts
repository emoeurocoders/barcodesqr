import { fieldSchema } from "@/components/create/fieldSchema";

/**
 * What the server will sign, and what the browser will offer to pick.
 *
 * Both sides read this one module: a limit enforced only in the client is not
 * a limit, and a limit that disagrees with the client is a file the visitor
 * was invited to choose and then refused.
 */

export type UploadTarget = { accept?: string; maxSizeMb: number };

/**
 * The per-link logo in the multi-link editor. It has no entry in the field
 * schema — the links field serialises its own rows — so its limits live here
 * rather than being hardcoded a second time in the editor.
 */
export const LINK_LOGO_FIELD = "linkLogo";
const LINK_LOGO: UploadTarget = { accept: "image/*", maxSizeMb: 2 };

/** The limits for one file field, or null if that field takes no file. */
export function uploadTarget(type: string, field: string): UploadTarget | null {
  if (field === LINK_LOGO_FIELD) return LINK_LOGO;

  const found = fieldSchema[type]?.find(
    (f) => f.name === field && f.type === "file",
  );
  if (!found) return null;

  return { accept: found.accept, maxSizeMb: found.maxSizeMb ?? 5 };
}

/**
 * Does a file satisfy an `accept` list?
 *
 * Takes the name and type rather than a File so the route handler, which only
 * ever sees the two strings, can ask exactly the question the browser asked.
 */
export function matchesAccept(
  filename: string,
  contentType: string,
  accept?: string,
) {
  const wanted = (accept ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!wanted.length) return true;

  const name = filename.toLowerCase();
  const type = contentType.toLowerCase();
  return wanted.some((a) =>
    a.startsWith(".")
      ? name.endsWith(a)
      : a.endsWith("/*")
        ? type.startsWith(a.slice(0, -1))
        : type === a,
  );
}
