import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import sharp from "sharp";

import { db } from "@/db";
import { env } from "@/lib/env";
import { qrCodes } from "@/db/schema";
import { vcard } from "@/components/create/encodeQr";
import { defaultCrop, fileSrc, parseStoredFile } from "@/components/create/storedValues";

/**
 * The hosted vCard's "Add contact": the contact as a .vcf, photo inside —
 * the one thing a vCard QR code cannot carry (JB, 2026-10-23).
 *
 * The photo is cut the way the customer framed it in the creator (the crop's
 * position and zoom over a square frame) and shrunk to 400px JPEG, so the
 * file stays small enough for every phone's contacts app.
 */

export const dynamic = "force-dynamic";

const SIZE = 400;

async function photoBase64(raw: string | undefined): Promise<string | null> {
  const stored = parseStoredFile(raw);
  const url = fileSrc(stored);
  // Only ever our own bucket: the URL came from the browser, and fetching
  // whatever it names would let anyone point this server at anything.
  const base = env.storageConfigured ? env.STORAGE_PUBLIC_BASE_URL + "/" : "";
  if (!stored || !url || !base || !url.startsWith(base)) return null;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const input = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(input).rotate().metadata();
    const w = meta.autoOrient?.width ?? meta.width ?? 0;
    const h = meta.autoOrient?.height ?? meta.height ?? 0;
    if (!w || !h) return null;
    // `object-fit: cover` into a square at object-position x% y%, then the
    // adjuster's zoom about the centre of that square.
    const c = stored.crop ?? defaultCrop;
    const side = Math.min(w, h);
    const left = (w - side) * (c.x / 100);
    const top = (h - side) * (c.y / 100);
    const zoom = Math.max(1, c.zoom || 1);
    const inner = side / zoom;
    const region = {
      left: Math.round(left + (side - inner) / 2),
      top: Math.round(top + (side - inner) / 2),
      width: Math.round(inner),
      height: Math.round(inner),
    };
    const out = await sharp(input).rotate().extract(region).resize(SIZE, SIZE).jpeg({ quality: 80 }).toBuffer();
    return out.toString("base64");
  } catch (e) {
    console.error("[contact.vcf] photo", e);
    return null;
  }
}

/** vCard lines over 75 octets continue on the next line after a space. */
function fold(line: string) {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(" " + line.slice(i, i + 74));
  return parts.join("\r\n");
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[A-Za-z0-9]{6,16}$/.test(slug)) return new NextResponse("Not found", { status: 404 });
  const [row] = await db
    .select({ type: qrCodes.type, values: qrCodes.values })
    .from(qrCodes)
    .where(eq(qrCodes.slug, slug))
    .limit(1);
  if (!row || row.type !== "vcard") return new NextResponse("Not found", { status: 404 });

  const v = row.values;
  const lines = vcard(v).split("\n");
  const photo = await photoBase64(v.photo);
  if (photo) lines.splice(lines.length - 1, 0, `PHOTO;ENCODING=b;TYPE=JPEG:${photo}`);
  const body = lines.map(fold).join("\r\n") + "\r\n";

  const name = [v.firstName, v.lastName].filter(Boolean).join(" ").replace(/[^\w\- ]+/g, "").trim() || "contact";
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      // Inline: iOS and Android open a .vcf straight into "Add contact".
      "Content-Disposition": `inline; filename="${name}.vcf"`,
      "Cache-Control": "no-store",
    },
  });
}
