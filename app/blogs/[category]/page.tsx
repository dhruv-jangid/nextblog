import "server-only";
import { db } from "@/db";
import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { titleFont } from "@/lib/static/fonts";
import { BlogGrid } from "@/components/bloggrid";
import { blogs, users, likes } from "@/db/schema";
import type { BlogType } from "@/lib/static/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  return {
    title: `MetaPress | Blogs | ${category}`,
    description: `View ${category} blogs on MetaPress`,
  };
}

export default async function CategoryBlogs({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const rows = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      image: blogs.image,
      category: blogs.category,
      createdAt: blogs.createdAt,
      like: {
        userId: likes.userId,
        blogId: likes.blogId,
      },
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(blogs)
    .innerJoin(users, eq(users.id, blogs.userId))
    .leftJoin(likes, eq(likes.blogId, blogs.id))
    .where(eq(blogs.category, category))
    .orderBy(desc(blogs.createdAt));

  if (rows.length < 1) {
    notFound();
  }

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
        likes: [],
      };
    }

    if (row.like?.userId && row.like?.blogId) {
      grouped[key].likes.push({
        userId: row.like.userId,
        blogId: row.like.blogId,
      });
    }
  }
  const actualBlogs = Object.values(grouped);

  return (
    <div className="min-h-[85dvh]">
      <div className={`${titleFont.className} text-center text-4xl my-16`}>
        {category} Blogs
      </div>
      <BlogGrid blogs={actualBlogs} />
    </div>
  );
}
