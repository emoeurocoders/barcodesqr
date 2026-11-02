import { splitWhen } from "@/components/create/encodeQr";
import { zonedToUtc } from "./zoned";

/**
 * One event, as every calendar needs it (JB, 2026-11-02: Apple, Google and
 * Outlook from the hosted event page). Built from what the creator stores:
 * `startsAt`/`endsAt` as typed ("2026-06-09T18:00"), `allDay`, and the IANA
 * `timezone` those times are in.
 *
 * - No end: one hour after the start (calendars need an end; the page says
 *   nothing it does not know).
 * - An end time with no end date that is not after the start runs past
 *   midnight, into the next day.
 * - All-day: dates only; the end date is inclusive here and exclusive in
 *   every calendar format, hence the +1 day.
 */

export const DEFAULT_MINUTES = 60;

type Values = Record<string, string | undefined>;

export type EventWindow =
  | { allDay: true; startDate: string; endDate: string }
  | { allDay: false; start: number; end: number };

const DAY = 86_400_000;

/** "2026-06-09" + n days. */
function addDays(date: string, n: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * DAY).toISOString().slice(0, 10);
}

/** The event's window, or null while the start is incomplete. */
export function eventWindow(v: Values, fallbackTz = "UTC"): EventWindow | null {
  const s = splitWhen(v.startsAt);
  const e = splitWhen(v.endsAt);
  if (!s.date) return null;
  if (v.allDay === "true") {
    const endDate = e.date && e.date >= s.date ? e.date : s.date;
    return { allDay: true, startDate: s.date, endDate };
  }
  if (!s.time) return null;
  const tz = v.timezone || fallbackTz;
  const start = zonedToUtc(s.date, s.time, tz);
  if (start === null) return null;
  let end: number | null;
  if (!e.date && !e.time) end = start + DEFAULT_MINUTES * 60_000;
  else {
    end = zonedToUtc(e.date || s.date, e.time || "23:59", tz);
    if (end !== null && !e.date && end <= start) end += DAY;
  }
  return { allDay: false, start, end: end ?? start + DEFAULT_MINUTES * 60_000 };
}

/** False only when an end was given and it is not after the start. */
export function endAfterStart(v: Values) {
  const s = splitWhen(v.startsAt);
  const e = splitWhen(v.endsAt);
  if (!(e.date || e.time) || !s.date) return true;
  if (v.allDay === "true") return !e.date || e.date >= s.date;
  if (!s.time) return true;
  // Wall-clock comparison: both times are in the same zone.
  const start = `${s.date}T${s.time}`;
  const end = `${e.date || s.date}T${e.time || "23:59"}`;
  if (!e.date) return true; // crosses midnight when earlier — see eventWindow
  return end > start;
}

const utcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
const dateStamp = (d: string) => d.replace(/-/g, "");

/** RFC 5545 text: backslash, semicolon, comma and line breaks escaped. */
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Lines over 75 octets folded, as the format requires. */
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (new TextEncoder().encode(cur + ch).length > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = ch;
    } else cur += ch;
  }
  out.push(cur);
  return out.join("\r\n ");
}

/** A whole .ics file for the event, or null while it is incomplete. */
export function icsFile(v: Values, uid: string, fallbackTz?: string): string | null {
  const w = eventWindow(v, fallbackTz);
  if (!w) return null;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BarcodesQR//Event//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}@barcodesqr.com`,
    `DTSTAMP:${utcStamp(Date.now())}`,
    `SUMMARY:${icsText((v.eventTitle ?? "").trim())}`,
    ...(w.allDay
      ? [`DTSTART;VALUE=DATE:${dateStamp(w.startDate)}`, `DTEND;VALUE=DATE:${dateStamp(addDays(w.endDate, 1))}`]
      : [`DTSTART:${utcStamp(w.start)}`, `DTEND:${utcStamp(w.end)}`]),
    ...((v.location ?? "").trim() ? [`LOCATION:${icsText(v.location!.trim())}`] : []),
    ...((v.description ?? "").trim() ? [`DESCRIPTION:${icsText(v.description!.trim())}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Google Calendar's "create event" page, filled in. */
export function googleCalendarUrl(v: Values, fallbackTz?: string): string | null {
  const w = eventWindow(v, fallbackTz);
  if (!w) return null;
  const dates = w.allDay
    ? `${dateStamp(w.startDate)}/${dateStamp(addDays(w.endDate, 1))}`
    : `${utcStamp(w.start)}/${utcStamp(w.end)}`;
  const q = new URLSearchParams({ action: "TEMPLATE", text: (v.eventTitle ?? "").trim(), dates });
  if ((v.description ?? "").trim()) q.set("details", v.description!.trim());
  if ((v.location ?? "").trim()) q.set("location", v.location!.trim());
  if (v.timezone) q.set("ctz", v.timezone);
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** Outlook on the web's compose page, filled in. */
export function outlookCalendarUrl(v: Values, fallbackTz?: string): string | null {
  const w = eventWindow(v, fallbackTz);
  if (!w) return null;
  const q = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: (v.eventTitle ?? "").trim(),
    startdt: w.allDay ? w.startDate : new Date(w.start).toISOString(),
    enddt: w.allDay ? addDays(w.endDate, 1) : new Date(w.end).toISOString(),
    allday: String(w.allDay),
  });
  if ((v.description ?? "").trim()) q.set("body", v.description!.trim());
  if ((v.location ?? "").trim()) q.set("location", v.location!.trim());
  return `https://outlook.live.com/calendar/0/action/compose?${q}`;
}
