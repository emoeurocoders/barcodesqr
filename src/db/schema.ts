import type { AdapterAccountType } from "next-auth/adapters";
import {
  bigserial,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Auth.js's standard tables, plus the columns this product needs.
 *
 * The adapter ignores columns it does not know about, so extra fields are safe
 * as long as they are nullable or defaulted.
 */
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  /**
   * bcrypt hash. Null for accounts that only ever signed in through an OAuth
   * provider, so "has a password" is a real question we can answer.
   */
  passwordHash: text("password_hash"),

  /** When the password was last set or changed — My Account's "Last updated". */
  passwordUpdatedAt: timestamp("password_updated_at", { withTimezone: true }),

  // My Account → Profile (member_myaccount.html). `name` above stays Auth.js's
  // display name; these are the customer's own fields. Phone and company are
  // optional, as the page says.
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  company: text("company"),
  /** ISO 3166 alpha-2, from the page's country list. */
  country: text("country"),

  // My Account → Preferences.
  /** Only "en" exists; the column is here so a second language needs no migration. */
  language: text("language").notNull().default("en"),
  /** IANA zone the members area shows dates in; null = the browser's own. */
  timezone: text("timezone"),

  /** Drives what the dashboard unlocks; billing sets it later. */
  plan: text("plan", { enum: ["free", "trial", "quarterly", "biannual"] })
    .notNull()
    .default("free"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

/**
 * Password reset links.
 *
 * Stores a hash of the token, never the token itself — a leaked database read
 * should not hand over working reset links. Rows are deleted once used.
 */
export const passwordResetTokens = pgTable("password_reset_token", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * A customer's QR codes.
 *
 * `values` is the step-2 form exactly as the creator holds it — the same flat
 * map of strings the encoder and the previews read — so a code can be
 * re-encoded, re-rendered or re-opened for editing without a per-type schema.
 * What the code encodes is derived from it (`encodeQr`), never stored, so a
 * fix to the encoder reaches every saved code.
 *
 * `draftKey` is the random key the browser gives a draft before checkout.
 * Claiming a draft twice — two tabs, a refresh mid-claim — hits the unique
 * index and inserts nothing the second time.
 */
export const qrCodes = pgTable(
  "qr_code",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    name: text("name").notNull(),
    values: jsonb("values").$type<Record<string, string>>().notNull(),
    draftKey: text("draft_key"),
    /**
     * The short code a hosted type's QR points at: /q/<slug>. Random, not
     * sequential, so codes cannot be walked. Set once at insert and never
     * changed — it is printed.
     */
    slug: text("slug").notNull().unique(),
    /**
     * Lifetime scans, bots excluded — the dashboard's Scans column. Kept on
     * the row so the list never has to count events. Statistics read the
     * tables below.
     */
    scans: integer("scans").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("qr_code_user_created_idx").on(t.userId, t.createdAt),
    uniqueIndex("qr_code_user_draft_idx").on(t.userId, t.draftKey),
  ],
);

/* ---- Scan analytics (JB, 2026-11-18: stay on Neon) -------------------------
 *
 * Every visit to /q/<slug> is one `scan_event`, recorded after the visitor
 * has been sent on (lib/scans.ts). Bots are stored with `bot` set and left
 * out of every count. `scan_daily` holds each code's per-day totals, kept up
 * to date as events arrive, so the Statistics chart never counts raw rows.
 * Raw events and daily rows are pruned past the owner's plan retention
 * (90 / 180 days) by /api/cron/scans.
 */

export const scanEvents = pgTable(
  "scan_event",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    qrId: text("qr_id")
      .notNull()
      .references(() => qrCodes.id, { onDelete: "cascade" }),
    /** The code's owner, copied in so every statistics query filters on it. */
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
    /**
     * A daily, salted hash of IP + user agent: the same phone scanning twice
     * on one day is one unique; nothing reversible is kept (no IP).
     */
    visitor: text("visitor").notNull(),
    bot: boolean("bot").notNull().default(false),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    device: text("device"),
    browser: text("browser"),
    os: text("os"),
    /** Host only (instagram.com), when the scan arrived with one. */
    referrer: text("referrer"),
  },
  (t) => [index("scan_event_user_at_idx").on(t.userId, t.at), index("scan_event_qr_at_idx").on(t.qrId, t.at)],
);

export const scanDaily = pgTable(
  "scan_daily",
  {
    qrId: text("qr_id")
      .notNull()
      .references(() => qrCodes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** The day in the owner's time zone when the scan happened. */
    day: date("day", { mode: "string" }).notNull(),
    scans: integer("scans").notNull().default(0),
    uniques: integer("uniques").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.qrId, t.day] }), index("scan_daily_user_day_idx").on(t.userId, t.day)],
);

/** Who has already been counted today, per code — what makes `uniques` unique. */
export const scanVisitorDay = pgTable(
  "scan_visitor_day",
  {
    qrId: text("qr_id")
      .notNull()
      .references(() => qrCodes.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
    visitor: text("visitor").notNull(),
  },
  (t) => [primaryKey({ columns: [t.qrId, t.day, t.visitor] })],
);
