import "server-only";
import { db } from "@/db";
import { redis } from "@/lib/redis";
import { eq, desc } from "drizzle-orm";
import { blogs, users } from "@/db/schema";
import { titleFont } from "@/lib/static/fonts";
import { Carousel } from "@/components/carousel";
import { BlogGrid } from "@/components/bloggrid";
import type { BlogType } from "@/lib/static/types";

export default async function Home() {
  const cacheKey = "homepage:blogs";
  const cached = await redis.get(cacheKey);

  let actualBlogs: BlogType[];
  if (cached) {
    actualBlogs = JSON.parse(cached);
  } else {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        content: blogs.content,
        category: blogs.category,
        image: blogs.image,
        createdAt: blogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
        },
      })
      .from(blogs)
      .innerJoin(users, eq(users.id, blogs.userId))
      .orderBy(desc(blogs.createdAt))
      .limit(17);

    const grouped: Record<string, BlogType> = {};
    for (const row of rows) {
      const key = row.slug;

      if (!grouped[key]) {
        grouped[key] = {
          id: row.id,
          title: row.title,
          slug: row.slug,
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
  const [firstBlog, ...remainingBlogs] = actualBlogs;

  return (
    <>
      {actualBlogs.length > 0 ? (
        <>
          <Carousel blog={firstBlog} />
          <BlogGrid blogs={remainingBlogs} />
        </>
      ) : (
        <div
          className={`${titleFont.className} flex justify-center items-center min-h-[92vh] text-4xl mx-auto`}
        >
          There are currently no blogs to display!
        </div>
      )}
    </>
  );
}
