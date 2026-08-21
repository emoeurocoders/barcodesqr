import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import { env } from "@/lib/env";

import * as schema from "./schema";

/**
 * WebSocket driver rather than neon-http.
 *
 * neon-http throws the moment you call db.transaction(), and at runtime rather
 * than compile time. Registration writes a user and its credentials together,
 * so transactions have to work.
 */
neonConfig.webSocketConstructor = ws;

/** Reused across hot reloads so dev doesn't exhaust the connection pool. */
const globalForDb = globalThis as unknown as { pool?: Pool };

const pool =
  globalForDb.pool ?? new Pool({ connectionString: env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
export { schema };
