import fs from "node:fs";
import {
  S3Client, HeadBucketCommand, PutObjectCommand, GetObjectCommand,
  DeleteObjectCommand, ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// .env.local, not .env
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (m) process.env[m[1]] = m[2];
}

const ENDPOINT = process.env.STORAGE_ENDPOINT;
const BUCKET = process.env.STORAGE_BUCKET;
const PATH_STYLE = process.env.STORAGE_FORCE_PATH_STYLE === "true";

const s3 = new S3Client({
  region: process.env.STORAGE_REGION || "auto",
  endpoint: ENDPOINT,
  forcePathStyle: PATH_STYLE,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  },
});

const ok = (s) => console.log(`  ok   ${s}`);
const bad = (s, e) => console.log(`  FAIL ${s}\n       ${e.name}: ${e.message}`);

console.log(`endpoint=${ENDPOINT}\nbucket=${BUCKET}\npathStyle=${PATH_STYLE}\n`);

const ORIGINS = (process.env.STORAGE_CORS_ORIGINS || "http://localhost:3000").split(",");
const key = `_healthcheck/${process.pid}-probe.txt`;
const body = "barcodesqr r2 probe";

console.log("1. credentials + bucket reachable");
try { await s3.send(new HeadBucketCommand({ Bucket: BUCKET })); ok("HeadBucket"); }
catch (e) { bad("HeadBucket", e); process.exit(1); }

console.log("2. write");
try {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: body, ContentType: "text/plain",
  }));
  ok(`PutObject ${key}`);
} catch (e) { bad("PutObject", e); process.exit(1); }

console.log("3. read back");
try {
  const r = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const got = await r.Body.transformToString();
  if (got === body) ok(`GetObject round-trips (${r.ContentType})`);
  else bad("GetObject", new Error(`got ${JSON.stringify(got)}`));
} catch (e) { bad("GetObject", e); }

console.log("4. list");
try {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 5 }));
  ok(`ListObjectsV2 — ${r.KeyCount ?? 0} key(s), bucket total unknown`);
  for (const o of r.Contents ?? []) console.log(`       ${o.Key} (${o.Size}b)`);
} catch (e) { bad("ListObjectsV2", e); }

console.log("5. presigned PUT (browser-direct upload path)");
try {
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: BUCKET, Key: `${key}.presigned`, ContentType: "text/plain",
  }), { expiresIn: 300 });
  const res = await fetch(url, {
    method: "PUT", body, headers: { "content-type": "text/plain" },
  });
  if (res.ok) ok(`presigned PUT -> ${res.status}`);
  else bad("presigned PUT", new Error(`${res.status} ${(await res.text()).slice(0, 300)}`));
  console.log(`       host: ${new URL(url).host}`);
} catch (e) { bad("presigned PUT", e); }

console.log("6. presigned GET");
try {
  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 300 });
  const res = await fetch(url);
  ok(`presigned GET -> ${res.status} ${res.ok ? (await res.text()) : ""}`);
} catch (e) { bad("presigned GET", e); }

console.log("7. anonymous public read (is the bucket public?)");
const base = process.env.STORAGE_PUBLIC_BASE_URL;
if (!base) {
  console.log("  --   STORAGE_PUBLIC_BASE_URL is empty; nothing to test");
} else {
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/${key}`);
    console.log(res.ok ? `  ok   public GET -> ${res.status}` : `  FAIL public GET -> ${res.status}`);
  } catch (e) { bad("public GET", e); }
}

console.log("8. CORS preflight from the app origin (what a browser really sends)");
for (const origin of ORIGINS) {
  try {
    const url = await getSignedUrl(s3, new PutObjectCommand({
      Bucket: BUCKET, Key: `${key}.cors`, ContentType: "text/plain",
    }), { expiresIn: 300 });
    const res = await fetch(url, {
      method: "OPTIONS",
      headers: {
        origin,
        "access-control-request-method": "PUT",
        "access-control-request-headers": "content-type",
      },
    });
    const allow = res.headers.get("access-control-allow-origin");
    if (allow) ok(`${origin} -> ${res.status}, allow-origin: ${allow}`);
    else bad(origin, new Error(`${res.status} with no access-control-allow-origin header`));
  } catch (e) { bad(origin, e); }
}

console.log("9. cleanup");
for (const k of [key, `${key}.presigned`, `${key}.cors`]) {
  try { await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: k })); ok(`DeleteObject ${k}`); }
  catch (e) { bad(`DeleteObject ${k}`, e); }
}
