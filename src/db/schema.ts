import type { AdapterAccountType } from "next-auth/adapters";
import {
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
