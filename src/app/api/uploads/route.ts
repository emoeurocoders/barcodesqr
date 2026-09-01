import type { NextRequest } from "next/server";

import { presignUpload, publicUrl, uploadKey } from "@/lib/storage";
import { env } from "@/lib/env";
import { matchesAccept, uploadTarget } from "@/lib/uploads";

/**
 * Hands the browser a one-shot signed URL for a file it is about to upload.
 *
 * The bytes never come here — see src/lib/storage.ts for why. What this route
 * does is decide whether that file is allowed at all, and sign only for the
 * exact type and size it approved.
 *
 * Deliberately open to signed-out visitors: the creator is usable before the
 * paywall, so requiring a session would break the main path through step 2.
 * That makes the checks below the only thing standing between the bucket and
 * the internet, which is why they run against the field schema rather than
 * trusting anything in the request.
 */

/** The signer needs Node's crypto, not the Edge runtime. */
export const runtime = "nodejs";

type Body = {
  type?: unknown;
  field?: unknown;
  filename?: unknown;
  contentType?: unknown;
  size?: unknown;
};

const bad = (message: string, status = 400) =>
  Response.json({ error: message }, { status });

export async function POST(request: NextRequest) {
  if (!env.storageConfigured) {
    // Say so plainly rather than 500ing out of the env getter — a dev without
    // R2 keys should get a legible answer.
    return bad("File uploads are not configured on this environment.", 503);
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return bad("Expected a JSON body.");
  }

  const { type, field, filename, contentType, size } = body;
  if (
    typeof type !== "string" ||
    typeof field !== "string" ||
    typeof filename !== "string" ||
    typeof contentType !== "string" ||
    typeof size !== "number"
  ) {
    return bad("Expected type, field, filename, contentType and size.");
  }

  const target = uploadTarget(type, field);
  if (!target) return bad(`${type}.${field} does not accept a file.`);

  if (!Number.isInteger(size) || size <= 0) {
    return bad("That file is empty.");
  }
  if (size > target.maxSizeMb * 1024 * 1024) {
    return bad(`This file is too large — the maximum size is ${target.maxSizeMb} MB.`);
  }
  if (!matchesAccept(filename, contentType, target.accept)) {
    return bad("That file type isn't supported.");
  }

  const key = uploadKey(field === "linkLogo" ? "logo" : type, filename);

  return Response.json({
    key,
    uploadUrl: await presignUpload({ key, contentType, contentLength: size }),
    url: publicUrl(key),
  });
}
