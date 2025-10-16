import "server-only";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { blogs, users } from "@/db/schema";
import { Grid1 } from "@/components/grid1";

export const metadata: Metadata = {
  title: "MetaPress | Blogs",
  description: "View blogs on MetaPress",
};

export default async function Blogs() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  const cacheKey = "blogs";
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
          name: users.username,
          username: users.username,
          image: users.image,
        },
      })
      .from(blogs)
      .innerJoin(users, eq(users.id, blogs.userId))
      .orderBy(desc(blogs.createdAt));

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

  return (
    <>
      {actualBlogs.length > 0 ? (
        <div className="min-h-dvh lg:mx-16">
          <div className="mt-16 md:mt-20 ml-auto mr-6 lg:mr-12 pb-2 w-2xs lg:w-md text-end text-3xl lg:text-4xl tracking-tight border-b border-accent-foreground/50 border-dashed">
            ... All Blogs
          </div>
          <Grid1 blogs={actualBlogs} />
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-dvh text-4xl rounded-lg w-3/4 mx-auto">
          There are currently no blogs to display!
        </div>
      )}
    </>
  );
}
