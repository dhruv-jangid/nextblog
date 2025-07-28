import "server-only";
import { db } from "@/db";
import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { blogs, users } from "@/db/schema";
import { getRedisClient } from "@/lib/redis";
import { titleFont } from "@/lib/static/fonts";
import type { JSONContent } from "@tiptap/react";
import { BlogGrid } from "@/components/bloggrid";
import type { BlogType } from "@/lib/static/types";

export const metadata: Metadata = {
  title: "MetaPress | Blogs",
  description: "View blogs on MetaPress",
};

export default async function Blogs() {
  const redis = await getRedisClient();
  const cacheKey = "blogs";
  const cached = await redis.get(cacheKey);

  let actualBlogs;
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
          name: users.username,
          username: users.username,
          image: users.image,
        },
      })
      .from(blogs)
      .innerJoin(users, eq(users.id, blogs.userId))
      .orderBy(desc(blogs.createdAt));

    const grouped: Record<string, BlogType & { content: JSONContent }> = {};
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

  return (
    <>
      {actualBlogs.length > 0 ? (
        <div className="min-h-[92dvh]">
          <div className={`${titleFont.className} text-center text-4xl my-16`}>
            All Blogs
          </div>
          <BlogGrid blogs={actualBlogs} />
        </div>
      ) : (
        <div
          className={`${titleFont.className} flex justify-center items-center min-h-[92vh] text-4xl rounded-lg w-3/4 mx-auto`}
        >
          There are currently no blogs to display!
        </div>
      )}
    </>
  );
}
