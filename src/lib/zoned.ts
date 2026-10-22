/**
 * Wall-clock times in a named time zone, without a date library.
 *
 * Event and Business store what the creator typed ("2026-06-09", "18:00")
 * plus the IANA zone their browser was in when they saved (`timezone`).
 * These turn that into a real instant, the same on the server as in any
 * browser — the dashboard re-encodes codes server-side, where the visitor's
 * own zone is unknown.
 */

/** The browser's zone, or "" where there is none to read (the server). */
export function localTimeZone(): string {
  try {
    return typeof window === "undefined" ? "" : Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

/** How far `tz` is ahead of UTC at instant `ms`, in ms. */
function offsetAt(ms: number, tz: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/**
 * "2026-06-09" + "18:00" in `tz` → epoch ms, or null when malformed or the
 * zone is unknown. Two passes so a time beside a DST change lands right.
 */
export function zonedToUtc(date: string, time: string, tz: string): number | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})/.exec(time);
  if (!d || !t) return null;
  const wall = Date.UTC(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]);
  try {
    let ms = wall - offsetAt(wall, tz);
    ms = wall - offsetAt(ms, tz);
    return ms;
  } catch {
    return null;
  }
}

/** Minutes past midnight of `ms` in `tz`. */
export function minutesInZone(ms: number, tz: string): number | null {
  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", hour: "2-digit", minute: "2-digit" })
        .formatToParts(new Date(ms))
        .map((p) => [p.type, p.value]),
    );
    return +parts.hour * 60 + +parts.minute;
  } catch {
    return null;
  }
}
