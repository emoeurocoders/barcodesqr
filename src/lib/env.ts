import "server-only";

/**
 * Server-side configuration, read once and validated at first use.
 *
 * Anything required is asserted here rather than surfacing later as a confusing
 * runtime failure deep inside a query or a sign-in callback.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local (see .env.example) and to the Vercel project settings.`,
    );
  }
  return value;
}

export const env = {
  /** Pooled Neon connection — right for serverless request handling. */
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
  /** Direct connection, used by drizzle-kit for migrations. */
  get DATABASE_URL_UNPOOLED() {
    return process.env.DATABASE_URL_UNPOOLED ?? required("DATABASE_URL");
  },
  /** Signs session cookies. Auth.js refuses to start without it. */
  get AUTH_SECRET() {
    return required("AUTH_SECRET");
  },

  /** Google OAuth client. Absent means "Continue with Google" stays off. */
  get AUTH_GOOGLE_ID() {
    return process.env.AUTH_GOOGLE_ID ?? "";
  },
  get AUTH_GOOGLE_SECRET() {
    return process.env.AUTH_GOOGLE_SECRET ?? "";
  },

  /** True once Google sign-in can actually run. */
  get googleConfigured() {
    return !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  },

  /** Resend API key. Absent means sign-in links cannot be delivered. */
  get RESEND_API_KEY() {
    return process.env.RESEND_API_KEY ?? "";
  },

  /** Sender for the sign-in link. Its domain must be verified in Resend. */
  get EMAIL_FROM() {
    return process.env.EMAIL_FROM ?? "";
  },

  /**
   * Canonical origin the sign-in link points at.
   *
   * Deliberately configured rather than read from the request's Host header:
   * an attacker who can set Host would otherwise redirect the link — and the
   * token inside it — to a domain they control.
   */
  get APP_URL() {
    return (process.env.APP_URL ?? "").replace(/\/$/, "");
  },

  /** True once all three are present and links can actually be sent. */
  get emailConfigured() {
    return !!(
      process.env.RESEND_API_KEY &&
      process.env.EMAIL_FROM &&
      process.env.APP_URL
    );
  },
};
