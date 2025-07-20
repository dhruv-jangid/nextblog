import "server-only";
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { titleFont } from "@/lib/static/fonts";
import { Carousel } from "@/components/carousel";
import { BlogGrid } from "@/components/bloggrid";
import { blogs, likes, users } from "@/db/schema";
import type { BlogType } from "@/lib/static/types";

export default async function Home() {
  const rows = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      content: blogs.content,
      category: blogs.category,
      image: blogs.image,
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
    .orderBy(desc(blogs.createdAt));

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

  const actualBlogs = Object.values(grouped).slice(0, 7);
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
