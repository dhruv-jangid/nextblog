import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

export const query = async (text: string, params: any) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

process.on("SIGTERM", async () => {
  console.log("Closing database pool...");
  await pool.end();
  console.log("Database pool closed.");
  process.exit(0);
});
