import * as schema from "./schema";
import { Pool as PgPool } from "pg";
import { Pool } from "@neondatabase/serverless";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";

const url = process.env.DATABASE_URL!;
const isProd = process.env.NODE_ENV === "production";

type DatabaseType =
  | ReturnType<typeof pgDrizzle<typeof schema>>
  | ReturnType<typeof neonDrizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  pgPool: PgPool | undefined;
  neonPool: Pool | undefined;
  db: DatabaseType | undefined;
};

export const db: DatabaseType =
  globalForDb.db ??
  (() => {
    let database: DatabaseType;

    if (isProd) {
      if (!globalForDb.neonPool) {
        globalForDb.neonPool = new Pool({ connectionString: url });
      }
      database = neonDrizzle(globalForDb.neonPool, { schema });
    } else {
      if (!globalForDb.pgPool) {
        globalForDb.pgPool = new PgPool({ connectionString: url });
      }
      database = pgDrizzle(globalForDb.pgPool, { schema });
    }

    globalForDb.db = database;
    return database;
  })();
