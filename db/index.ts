import { Pool as PgPool } from "pg";
import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";

const url = process.env.DATABASE_URL!;
const isProd = process.env.NODE_ENV === "production";

const globalForDb = globalThis as unknown as {
  pgPool: PgPool | undefined;
  db: any | undefined;
};

export const db =
  globalForDb.db ??
  (() => {
    let database;
    if (isProd) {
      const client = neon(url);
      database = neonDrizzle(client);
    } else {
      if (!globalForDb.pgPool) {
        globalForDb.pgPool = new PgPool({ connectionString: url });
      }
      database = pgDrizzle(globalForDb.pgPool);
    }
    globalForDb.db = database;
    return database;
  })();
