import "server-only";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { blogs, users } from "@/db/schema";
import { titleFont } from "@/lib/static/fonts";
import { BlogGrid2 } from "@/components/bloggrid2";
import { notFound, redirect } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> => {
  const { category } = await params;

  return {
    title: `MetaPress | Blogs | ${category}`,
    description: `View ${category} blogs on MetaPress`,
  };
};

export default async function BlogCategory({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  const { category } = await params;
  const cacheKey = `category:${category}`;
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
      .innerJoin(users, eq(users.id, blogs.userId))
      .where(eq(blogs.category, category))
      .orderBy(desc(blogs.createdAt));

    if (rows.length < 1) {
      notFound();
    }

    const grouped: Record<string, Blog> = {};
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

  return (
    <div className="min-h-[85dvh] mx-16">
      <div
        className={`${titleFont.className} text-center text-4xl py-16 border-b`}
      >
        {category} Blogs
      </div>
      <BlogGrid2 blogs={actualBlogs} />
    </div>
  );
}
