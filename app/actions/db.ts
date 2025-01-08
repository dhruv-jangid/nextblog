import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" && { rejectUnauthorized: false },
});

export const query = async (
  text: string,
  values?: (string | number)[]
): Promise<unknown> => {
  const result = await pool.query(text, values);
  return result.rows;
};

export const allBlogs = async () => {
  const allBlogs = await query(
    "SELECT blogid, title, date, category, userid, name FROM users JOIN blogs ON users.userid = blogs.user_id;"
  );

  return allBlogs;
};

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing database pool...`);
  await pool.end();
  console.log("Database pool closed.");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
