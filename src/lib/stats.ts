import "server-only";

import { and, count, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import { qrCodes, scanDaily, scanEvents } from "@/db/schema";
import { zonedToUtc } from "./zoned";
import { dayIn } from "./scans";
import { continentOf } from "./continents";

/**
 * What member_stats.html shows, for one owner. Every query filters on the
 * signed-in user's id, so one customer can never see another's scans.
 * Totals and the chart come from `scan_daily`; the breakdowns from the raw
 * events in the range (bots left out everywhere).
 */

export type Ranked = { label: string; count: number; key: string; sub?: string };

export type Stats = {
  days: number;
  codes: number;
  scans: number;
  uniques: number;
  series: { day: string; scans: number; uniques: number }[];
  byCode: Ranked[];
  byType: Ranked[];
  byUrl: Ranked[];
  byCity: Ranked[];
  byCountry: Ranked[];
  byContinent: Ranked[];
  byDevice: Ranked[];
  byBrowser: Ranked[];
  byOs: Ranked[];
};

const addDays = (d: string, n: number) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day + n)).toISOString().slice(0, 10);
};

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

/** Where a code sends people, for "Destination URLs". */
function destination(type: string, v: Record<string, string>) {
  const raw = type === "payment" ? v.paymentLink : type === "applink" ? v.fallbackUrl || v.iosUrl || v.androidUrl : v.url;
  if (!raw) return null;
  return raw.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "") || null;
}

function rank(rows: { key: string | null; n: number }[], label: (k: string) => string, unknown = "Unknown"): Ranked[] {
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.key ?? "", (m.get(r.key ?? "") ?? 0) + Number(r.n));
  return [...m.entries()]
    .map(([key, n]) => ({ key, count: n, label: key ? label(key) : unknown }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export async function loadStats(userId: string, opts: { days: number; qrId?: string; timezone: string | null }): Promise<Stats> {
  const tz = opts.timezone || "UTC";
  const today = dayIn(tz);
  // "Last 30 days" is today and the 30 before it — 31 points, as the
  // mockup's sample (Jul 21 – Aug 20) plots.
  const first = addDays(today, -opts.days);
  const since = new Date(zonedToUtc(first, "00:00", tz) ?? Date.parse(`${first}T00:00:00Z`));

  const codeFilter = opts.qrId ? eq(qrCodes.id, opts.qrId) : undefined;
  const [{ n: codes }] = await db
    .select({ n: count() })
    .from(qrCodes)
    .where(and(eq(qrCodes.userId, userId), codeFilter));

  const daily = await db
    .select({ day: scanDaily.day, scans: sql<number>`sum(${scanDaily.scans})`, uniques: sql<number>`sum(${scanDaily.uniques})` })
    .from(scanDaily)
    .where(and(eq(scanDaily.userId, userId), gte(scanDaily.day, first), opts.qrId ? eq(scanDaily.qrId, opts.qrId) : undefined))
    .groupBy(scanDaily.day);
  const byDay = new Map(daily.map((d) => [d.day, d]));
  const series = Array.from({ length: opts.days + 1 }, (_, i) => {
    const day = addDays(first, i);
    const d = byDay.get(day);
    return { day, scans: Number(d?.scans ?? 0), uniques: Number(d?.uniques ?? 0) };
  });

  const where = and(eq(scanEvents.userId, userId), eq(scanEvents.bot, false), gte(scanEvents.at, since), opts.qrId ? eq(scanEvents.qrId, opts.qrId) : undefined);
  const group = (col: typeof scanEvents.country | typeof scanEvents.device | typeof scanEvents.browser | typeof scanEvents.os) =>
    db.select({ key: col, n: count() }).from(scanEvents).where(where).groupBy(col);

  const [codesRows, cityRows, countryRows, deviceRows, browserRows, osRows] = await Promise.all([
    db
      .select({ id: qrCodes.id, name: qrCodes.name, type: qrCodes.type, values: qrCodes.values, n: count() })
      .from(scanEvents)
      .innerJoin(qrCodes, eq(qrCodes.id, scanEvents.qrId))
      .where(where)
      .groupBy(qrCodes.id, qrCodes.name, qrCodes.type, qrCodes.values)
      .orderBy(desc(count())),
    db.select({ city: scanEvents.city, country: scanEvents.country, n: count() }).from(scanEvents).where(where).groupBy(scanEvents.city, scanEvents.country),
    group(scanEvents.country),
    group(scanEvents.device),
    group(scanEvents.browser),
    group(scanEvents.os),
  ]);

  const byCode = codesRows.map((r) => ({ key: r.id, label: r.name, sub: r.type, count: Number(r.n) }));
  const byType = rank(codesRows.map((r) => ({ key: r.type, n: Number(r.n) })), (k) => k);
  const byUrl = rank(
    codesRows.map((r) => ({ key: destination(r.type, r.values), n: Number(r.n) })).filter((r) => r.key),
    (k) => k,
  );
  const byCountry = rank(countryRows.map((r) => ({ key: r.key, n: Number(r.n) })), countryName);
  const byContinent = rank(countryRows.map((r) => ({ key: r.key ? continentOf(r.key) : null, n: Number(r.n) })), (k) => k);
  const byCity = rank(
    cityRows.map((r) => ({ key: r.city ? `${r.city}|${r.country ?? ""}` : null, n: Number(r.n) })),
    (k) => k.split("|")[0],
  ).map((r) => ({ ...r, sub: r.key.split("|")[1] || undefined }));

  return {
    days: opts.days,
    codes: Number(codes),
    scans: series.reduce((a, d) => a + d.scans, 0),
    uniques: series.reduce((a, d) => a + d.uniques, 0),
    series,
    byCode,
    byType,
    byUrl,
    byCity,
    byCountry,
    byContinent,
    byDevice: rank(deviceRows.map((r) => ({ key: r.key, n: Number(r.n) })), (k) => k),
    byBrowser: rank(browserRows.map((r) => ({ key: r.key, n: Number(r.n) })), (k) => k),
    byOs: rank(osRows.map((r) => ({ key: r.key, n: Number(r.n) })), (k) => k),
  };
}
