import "server-only";
import { db } from "@/db";
import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { titleFont } from "@/lib/static/fonts";
import type { JSONContent } from "@tiptap/react";
import { BlogGrid } from "@/components/bloggrid";
import { blogs, users, likes } from "@/db/schema";
import type { BlogType } from "@/lib/static/types";

export const metadata: Metadata = {
  title: "MetaPress | Blogs",
  description: "View blogs on MetaPress",
};

export default async function Blogs() {
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
      likes: {
        userId: likes.userId,
        blogId: likes.blogId,
      },
    })
    .from(blogs)
    .innerJoin(users, eq(users.id, blogs.userId))
    .leftJoin(likes, eq(likes.blogId, blogs.id))
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
        likes: [],
      };
    }

    if (row.likes?.userId && row.likes?.blogId) {
      grouped[key].likes.push({
        userId: row.likes.userId,
        blogId: row.likes.blogId,
      });
    }
  }
  const actualBlogs = Object.values(grouped);

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
