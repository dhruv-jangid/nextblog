import { Pool } from "pg";
import { postCover } from "./postCover";

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
    "SELECT blogid, title, description, date, category, userid, username, name FROM users JOIN blogs ON users.userid = blogs.user_id;"
  );

  return allBlogs;
};

export const insertBlog = async (
  title: string,
  description: string,
  date: string,
  user_id: number,
  category: string,
  blogCover: File
) => {
  try {
    const blogId = await query(
      "INSERT INTO blogs (title, description, date, user_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING blogid",
      [title, description, date, user_id, category]
    );
    const result = await postCover(
      blogCover,
      `${blogId[0].blogid}_${category}_${user_id}`
    );
    console.log(result);

    return blogId;
  } catch (error) {
    console.log(error);
  }
};

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing database pool...`);
  await pool.end();
  console.log("Database pool closed.");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
