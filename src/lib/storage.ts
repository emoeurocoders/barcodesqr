import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "./env";

/**
 * Cloudflare R2, spoken to over its S3-compatible API.
 *
 * Uploads do NOT pass through the app. The browser asks `/api/uploads` for a
 * short-lived signed URL and PUTs the bytes straight to R2, because a request
 * that goes through a serverless function is capped at 4.5 MB on Vercel and
 * the create flow accepts a 50 MB video.
 */

/** Reused across hot reloads; the client holds a keep-alive agent pool. */
const globalForS3 = globalThis as unknown as { r2?: S3Client };

function client() {
  const existing = globalForS3.r2;
  if (existing) return existing;

  const s3 = new S3Client({
    region: env.STORAGE_REGION,
    endpoint: env.STORAGE_ENDPOINT,
    // R2 serves this account's endpoint as a virtual host
    // (bucket.account.r2.cloudflarestorage.com), so path style is off unless
    // a deployment says otherwise.
    forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
    },
  });

  if (process.env.NODE_ENV !== "production") globalForS3.r2 = s3;
  return s3;
}

/** How long a signed upload URL stays usable. */
const UPLOAD_TTL_SECONDS = 300;

/**
 * Where an upload lands.
 *
 * The name the visitor's file had is deliberately NOT part of the key: it is
 * attacker-controlled text that would end up in a public URL. It is kept
 * alongside the key in the field's stored value, which is where the UI reads
 * it from anyway.
 */
export function uploadKey(kind: string, filename: string) {
  const ext = /\.([a-z0-9]{1,8})$/i.exec(filename)?.[1]?.toLowerCase() ?? "bin";
  const folder = kind.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "file";
  return `uploads/${folder}/${crypto.randomUUID()}.${ext}`;
}

/**
 * A signed PUT the browser can use once, for exactly this file.
 *
 * Both the content type and the byte count are signed, so the URL cannot be
 * reused to push something bigger or of a different type than the one the
 * server approved — without that, the size limit would only exist in the
 * client and anyone could fill the bucket.
 */
export async function presignUpload({
  key,
  contentType,
  contentLength,
}: {
  key: string;
  contentType: string;
  contentLength: number;
}) {
  return getSignedUrl(
    client(),
    new PutObjectCommand({
      Bucket: env.STORAGE_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
    }),
    {
      expiresIn: UPLOAD_TTL_SECONDS,
      // Both, explicitly. This set REPLACES the signer's default rather than
      // adding to it, so naming only content-length silently unsigns the
      // content type — and an unsigned type on a public bucket means a file
      // can be stored as text/html and served as a page from our own origin.
      signableHeaders: new Set(["content-length", "content-type"]),
    },
  );
}

/**
 * The URL a scanner reads the file back from.
 *
 * Today that is the bucket's r2.dev address. Cloudflare rate-limits r2.dev and
 * does not support it for production traffic, so this becomes a custom domain
 * before launch — which is a change to STORAGE_PUBLIC_BASE_URL alone.
 */
export function publicUrl(key: string) {
  return `${env.STORAGE_PUBLIC_BASE_URL}/${key}`;
}
