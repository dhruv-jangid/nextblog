import "server-only";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { titleFont } from "@/lib/static/fonts";
import { BlogGrid } from "@/components/bloggrid";
import { blogs, likes, users } from "@/db/schema";

export const metadata: Metadata = {
  title: "MetaPress | Liked Blogs",
  description: "All liked blogs",
};

export default async function LikedBlogs() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = session!.user;
  const cacheKey = `liked:${id}`;
  const cached = await redis.get(cacheKey);

  let actualBlogs: Blog[];
  if (cached) {
    actualBlogs = JSON.parse(cached);
  } else {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        content: blogs.content,
        image: blogs.image,
        category: blogs.category,
        createdAt: blogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
        },
      })
      .from(blogs)
      .innerJoin(likes, eq(blogs.id, likes.blogId))
      .innerJoin(users, eq(users.id, blogs.userId))
      .where(eq(likes.userId, id));

    const grouped: Record<string, Blog> = {};
    for (const row of rows) {
      const key = row.slug;

      if (!grouped[key]) {
        grouped[key] = {
          id: row.id,
          title: row.title,
          slug: row.slug,
          content: row.content,
          image: row.image,
          category: row.category,
          createdAt: row.createdAt,
          user: {
            id: row.user.id,
            name: row.user.name,
            username: row.user.username,
            image: row.user.image,
          },
        };
      }
    }
    actualBlogs = Object.values(grouped);

    await redis.set(cacheKey, JSON.stringify(actualBlogs), { EX: 60 });
  }

  return actualBlogs.length > 0 ? (
    <div className="min-h-[92dvh]">
      <div className={`${titleFont.className} text-center text-4xl my-16`}>
        Liked Blogs
      </div>
      <BlogGrid blogs={actualBlogs} />
    </div>
  ) : (
    <div
      className={`${titleFont.className} flex justify-center items-center min-h-[92vh] text-4xl rounded-lg w-3/4 mx-auto`}
    >
      You dont have any liked blogs currently!
    </div>
  );
}
