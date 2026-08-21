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
};
