import { Pool as PgPool } from "pg";
import { Pool as NeonPool } from "@neondatabase/serverless";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";

const url = process.env.DATABASE_URL!;
const isProd = process.env.NODE_ENV === "production";

export const db = isProd
  ? neonDrizzle(new NeonPool({ connectionString: url }))
  : pgDrizzle(new PgPool({ connectionString: url }));
