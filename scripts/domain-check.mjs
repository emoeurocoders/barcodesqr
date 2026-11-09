#!/usr/bin/env node
/**
 * Is this origin serving the current app, safely? Run it before and after
 * pointing www.barcodesqr.com at the project (docs/DOMAIN.md):
 *
 *   npm run -s domain:check -- https://www.barcodesqr.com
 *   npm run -s domain:check -- https://www.barcodesqr.com --slugs kazdMMpn,lwaoDEZM
 *   npm run -s domain:check -- https://www.barcodesqr.com --db "$PROD_DATABASE_URL"
 *
 * Checks, each printed ok / FAIL:
 *   1. https answers; http:// and the bare domain reach https://www in ONE
 *      hop each (no loops, no detours to *.vercel.app);
 *   2. it is the same deployment as --reference (default the vercel.app
 *      alias), by the deployment id in the HTML;
 *   3. /q/preview is our "not active" page, not a stock 404 — i.e. the
 *      hosted-page route exists here;
 *   4. every --slugs code opens: a page (200) or a redirect that leaves for
 *      the customer's own link, never back to us or to vercel.app;
 *   5. with --db: one hosted code per type from that database is fetched,
 *      and its scan count must go up by exactly one; event.ics and
 *      contact.vcf are fetched where those types exist.
 *
 * Exit code 1 if anything failed.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const origin = (args.find((a) => /^https?:\/\//.test(a)) ?? "https://www.barcodesqr.com").replace(/\/$/, "");
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const reference = (opt("reference") ?? "https://barcodesqr.vercel.app").replace(/\/$/, "");
const slugs = (opt("slugs") ?? "").split(",").filter(Boolean);
const dbUrl = opt("db");

let failed = 0;
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => {
  failed++;
  console.log(`  FAIL ${m}`);
};
const host = new URL(origin).hostname;
const apex = host.replace(/^www\./, "");

/** One request, redirects NOT followed. */
const hop = (url) => fetch(url, { redirect: "manual", headers: { "user-agent": "barcodesqr-domain-check" } });

async function chain(url, max = 6) {
  const seen = [url];
  let res = await hop(url);
  while (res.status >= 300 && res.status < 400 && seen.length <= max) {
    const next = new URL(res.headers.get("location"), seen.at(-1)).href;
    if (seen.includes(next)) return { seen: [...seen, next], loop: true, res };
    seen.push(next);
    res = await hop(next);
  }
  return { seen, loop: false, res };
}

const deploymentId = (html) => (html.match(/dpl_[A-Za-z0-9]+/) ?? [])[0] ?? null;

console.log(`Checking ${origin} (reference ${reference})\n`);

console.log("1. HTTPS and redirects");
try {
  const r = await hop(`${origin}/`);
  if (r.status === 200) ok(`${origin}/ -> 200`);
  else bad(`${origin}/ -> ${r.status}`);
} catch (e) {
  bad(`${origin}/ unreachable: ${e.message}`);
}
// A *.vercel.app alias has no bare domain of its own to redirect.
const starts = /vercel\.app$/.test(host) ? [`http://${host}/`] : [`http://${host}/`, `https://${apex}/`, `http://${apex}/`];
for (const start of starts) {
  if (start === `${origin}/`) continue;
  try {
    const c = await chain(start);
    const end = c.seen.at(-1);
    if (c.loop) bad(`${start} loops: ${c.seen.join(" -> ")}`);
    else if (!/vercel\.app$/.test(host) && /vercel\.app/.test(c.seen.join(" "))) bad(`${start} passes through vercel.app: ${c.seen.join(" -> ")}`);
    else if (new URL(end).origin !== origin) bad(`${start} ends at ${end}, not ${origin}`);
    else if (c.seen.length - 1 > 2) bad(`${start} takes ${c.seen.length - 1} hops: ${c.seen.join(" -> ")}`);
    else ok(`${start} -> ${end} (${c.seen.length - 1} hop${c.seen.length === 2 ? "" : "s"})`);
  } catch (e) {
    bad(`${start}: ${e.message}`);
  }
}

console.log("2. Same deployment as the reference");
try {
  const [a, b] = await Promise.all([fetch(`${origin}/`).then((r) => r.text()), fetch(`${reference}/`).then((r) => r.text())]);
  const ia = deploymentId(a);
  const ib = deploymentId(b);
  if (!ia) bad(`${origin} names no deployment id — not this project's build`);
  else if (ia !== ib) bad(`${origin} is ${ia}, reference is ${ib}`);
  else ok(`both serve ${ia}`);
} catch (e) {
  bad(e.message);
}

console.log("3. The hosted-page route exists");
try {
  const r = await hop(`${origin}/q/preview`);
  const html = await r.text();
  if (/isn.{0,8}t active/i.test(html)) ok(`/q/preview -> ${r.status}, "not active" page`);
  else bad(`/q/preview -> ${r.status}, ${/could not be found/i.test(html) ? "a stock 404 (old deployment?)" : "unexpected page"}`);
} catch (e) {
  bad(e.message);
}

async function checkSlug(slug, label = slug) {
  const r = await hop(`${origin}/q/${slug}`);
  if (r.status === 200) return ok(`/q/${label} -> 200 page`), true;
  if (r.status >= 300 && r.status < 400) {
    const to = new URL(r.headers.get("location"), origin);
    if (to.hostname === host || to.hostname === apex || /vercel\.app$/.test(to.hostname)) {
      bad(`/q/${label} redirects back to ${to.href}`);
      return false;
    }
    if (to.protocol !== "https:") {
      bad(`/q/${label} redirects to non-https ${to.href}`);
      return false;
    }
    ok(`/q/${label} -> ${r.status} ${to.href}`);
    return true;
  }
  bad(`/q/${label} -> ${r.status}`);
  return false;
}

if (slugs.length) {
  console.log("4. Given codes");
  for (const s of slugs) await checkSlug(s).catch((e) => bad(`${s}: ${e.message}`));
}

if (dbUrl) {
  console.log("5. One code per hosted type, scan counted");
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);
  const rows = await sql`
    select distinct on (type) type, slug, scans from qr_code
    where slug is not null
      and type in ('pdf','image','video','mp3','social','menu','business','coupon','multilink','applink','event','payment','feedback','vcard')
    order by type, created_at desc`;
  if (!rows.length) bad("no hosted codes in that database");
  for (const row of rows) {
    const before = Number(row.scans);
    if (!(await checkSlug(row.slug, `${row.slug} (${row.type})`).catch((e) => bad(e.message)))) continue;
    const [after] = await sql`select scans from qr_code where slug = ${row.slug}`;
    // Not exact when someone else scans it meanwhile — re-run if so.
    const n = Number(after.scans) - before;
    if (n === 1) ok(`  scans ${before} -> ${after.scans}`);
    else bad(`  scans ${before} -> ${after.scans} for ${row.type}`);
    const file = row.type === "event" ? "event.ics" : row.type === "vcard" ? "contact.vcf" : null;
    if (file) {
      const f = await hop(`${origin}/q/${row.slug}/${file}`);
      const type = f.headers.get("content-type") ?? "";
      if (f.status === 200 && /calendar|vcard/.test(type)) ok(`  ${file} -> 200 ${type}`);
      else bad(`  ${file} -> ${f.status} ${type}`);
    }
  }
}

console.log(failed ? `\n${failed} FAILED` : "\nALL OK");
process.exit(failed ? 1 : 0);
