import "server-only";

import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { scanEvents } from "@/db/schema";

/**
 * Scan recording (JB, 2026-11-18). Called after a scan has been redirected
 * or served, so nothing here can slow or break a QR code.
 *
 * Definitions — these are what "scans" and "unique scans" mean everywhere:
 *
 * - **Bot**: a request whose user agent is a crawler, link previewer
 *   (WhatsApp, iMessage, Slack, Facebook…), script or headless browser, or a
 *   browser prefetch. Bots are stored with `bot = true` and never counted.
 * - **Scan**: every other request to /q/<slug>.
 * - **Unique scan**: the first scan of a code by one device on one day. A
 *   device is a salted hash of IP + user agent; the salt changes daily and
 *   no IP is ever stored, so it cannot be followed across days. Over a date
 *   range, uniques are the sum of the daily figures — the same phone on two
 *   different days counts twice (as privacy-first analytics tools do).
 */

/**
 * How long statistics are kept, by plan (mainB.html's pricing: "90 days
 * analytics history" on Quarterly, "180 days" on Bi-Annual). The trial gets
 * Quarterly's; /api/cron/scans enforces it and the Statistics page offers
 * no range longer than it.
 */
export const RETENTION_DAYS = { biannual: 180, default: 90 } as const;
export const retentionFor = (plan: string | null | undefined) => (plan === "biannual" ? RETENTION_DAYS.biannual : RETENTION_DAYS.default);

export type ScanContext = {
  qrId: string;
  userId: string;
  /** IANA zone of the owner, for which day the scan falls on. */
  timezone: string | null;
  userAgent: string;
  ip: string;
  referrer: string;
  country: string | null;
  region: string | null;
  city: string | null;
  /** Sec-Purpose / Purpose / X-Moz header, for prefetch detection. */
  purpose: string;
};

const BOT =
  /bot\b|bot\/|crawl|spider|slurp|preview|facebookexternalhit|facebookcatalog|meta-externalagent|whatsapp|telegram|slack|discord|skype|linkedin|pinterest|embedly|quora link|vkshare|bitlybot|tumblr|redditbot|applebot|google-inspectiontool|googleother|bingpreview|yandex|baidu|duckduck|petal|semrush|ahrefs|mj12|dotbot|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl\/|wget\/|python-|httpie|go-http-client|okhttp|java\/|libwww|axios\/|node-fetch|undici|postman|insomnia/i;

export function isBot(ua: string, purpose = "") {
  if (!ua.trim()) return true;
  if (/prefetch|prerender|preview/i.test(purpose)) return true;
  return BOT.test(ua);
}

/** Coarse device / browser / OS, from the user agent — what the panels show. */
export function parseAgent(ua: string) {
  const device = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)
    ? "Tablet"
    : /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)
      ? "Mobile"
      : "Desktop";
  const os = /iPhone|iPad|iPod/i.test(ua)
    ? "iOS"
    : /Android/i.test(ua)
      ? "Android"
      : /CrOS/i.test(ua)
        ? "ChromeOS"
        : /Windows/i.test(ua)
          ? "Windows"
          : /Mac OS X|Macintosh/i.test(ua)
            ? "macOS"
            : /Linux/i.test(ua)
              ? "Linux"
              : "Other";
  // In-app browsers first: a scan from Instagram's camera opens in Instagram.
  const browser = /Instagram/i.test(ua)
    ? "Instagram"
    : /FBAN|FBAV|FB_IAB/i.test(ua)
      ? "Facebook"
      : /SamsungBrowser/i.test(ua)
        ? "Samsung Internet"
        : /Edg(e|A|iOS)?\//i.test(ua)
          ? "Edge"
          : /OPR\/|Opera/i.test(ua)
            ? "Opera"
            : /Firefox|FxiOS/i.test(ua)
              ? "Firefox"
              : /Chrome|CriOS/i.test(ua)
                ? "Chrome"
                : /Safari/i.test(ua)
                  ? "Safari"
                  : "Other";
  return { device, os, browser };
}

/** "2026-11-18" in `tz` (UTC when unknown). */
export function dayIn(tz: string | null, at = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz || "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
  } catch {
    return at.toISOString().slice(0, 10);
  }
}

function salt() {
  return process.env.SCAN_SALT || process.env.AUTH_SECRET || "barcodesqr";
}

/** The day's device id: not reversible, and different tomorrow. */
export function visitorId(ip: string, ua: string, day: string) {
  return createHash("sha256").update(`${salt()}|${day}|${ip}|${ua}`).digest("hex").slice(0, 32);
}

const host = (raw: string) => {
  try {
    return raw ? new URL(raw).hostname.replace(/^www\./, "").slice(0, 120) : null;
  } catch {
    return null;
  }
};

/**
 * Store one scan and, unless it is a bot, add it to the code's day and
 * lifetime totals — in one statement, so a retry never double-counts the
 * totals without the event (or the other way round).
 */
async function write(c: ScanContext) {
  const bot = isBot(c.userAgent, c.purpose);
  const day = dayIn(c.timezone);
  const visitor = visitorId(c.ip, c.userAgent, day);
  const a = parseAgent(c.userAgent);
  const ev = {
    qrId: c.qrId,
    userId: c.userId,
    visitor,
    bot,
    country: c.country?.slice(0, 2).toUpperCase() || null,
    region: c.region?.slice(0, 80) || null,
    city: c.city?.slice(0, 120) || null,
    device: a.device,
    browser: a.browser,
    os: a.os,
    referrer: host(c.referrer),
  };
  if (bot) {
    await db.insert(scanEvents).values(ev);
    return;
  }
  await db.execute(sql`
    with e as (
      insert into scan_event (qr_id, user_id, visitor, bot, country, region, city, device, browser, os, referrer)
      values (${ev.qrId}, ${ev.userId}, ${visitor}, false, ${ev.country}, ${ev.region}, ${ev.city}, ${ev.device}, ${ev.browser}, ${ev.os}, ${ev.referrer})
      returning 1
    ),
    v as (
      insert into scan_visitor_day (qr_id, day, visitor) values (${c.qrId}, ${day}, ${visitor})
      on conflict do nothing
      returning 1
    ),
    d as (
      insert into scan_daily (qr_id, user_id, day, scans, uniques)
      values (${c.qrId}, ${c.userId}, ${day}, 1, (select count(*) from v))
      on conflict (qr_id, day) do update
        set scans = scan_daily.scans + 1, uniques = scan_daily.uniques + (select count(*) from v)
      returning 1
    )
    update qr_code set scans = scans + 1 where id = ${c.qrId} and exists (select 1 from e) and exists (select 1 from d)
  `);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Record a scan, retrying a failed write (JB: "failed analytics writes can
 * be retried") — three attempts over about four seconds, which rides out a
 * database cold start or a dropped connection. Never throws: a scan that
 * still cannot be written is logged, and the QR code has long since done
 * its job.
 */
export async function recordScan(c: ScanContext) {
  for (let attempt = 1; ; attempt++) {
    try {
      await write(c);
      return;
    } catch (e) {
      if (attempt >= 3) {
        console.error("[scans] could not record a scan after 3 attempts", { qrId: c.qrId, error: String(e) });
        return;
      }
      await wait(attempt === 1 ? 500 : 3000);
    }
  }
}
