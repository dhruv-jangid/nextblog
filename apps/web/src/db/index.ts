import { Pool as PgPool } from "pg";
import { Pool } from "@neondatabase/serverless";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";

const url = process.env.DATABASE_URL!;
const isProd = process.env.NODE_ENV === "production";

const globalForDb = globalThis as unknown as {
  pgPool: PgPool | undefined;
  neonPool: Pool | undefined;
  db: any | undefined;
};

export const db =
  globalForDb.db ??
  (() => {
    let database;
    if (isProd) {
      if (!globalForDb.neonPool) {
        globalForDb.neonPool = new Pool({ connectionString: url });
      }
      database = neonDrizzle(globalForDb.neonPool);
    } else {
      if (!globalForDb.pgPool) {
        globalForDb.pgPool = new PgPool({ connectionString: url });
      }
      database = pgDrizzle(globalForDb.pgPool);
    }
    globalForDb.db = database;
    return database;
  })();
