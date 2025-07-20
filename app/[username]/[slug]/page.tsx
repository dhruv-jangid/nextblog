import "server-only";
import { db } from "@/db";
import BlogPage from "./client";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import type { JSONContent } from "@tiptap/react";
import type { BlogType } from "@/lib/static/types";
import { blogs, users, likes as dbLikes, comments } from "@/db/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;

  return {
    title: `MetaPress | ${username} | ${slug}`,
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  const { username, slug } = await params;
  const blogRows = await db
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
      likes: {
        userId: dbLikes.userId,
        blogId: dbLikes.blogId,
      },
    })
    .from(blogs)
    .innerJoin(users, eq(users.id, blogs.userId))
    .leftJoin(dbLikes, eq(dbLikes.blogId, blogs.id))
    .where(and(eq(blogs.slug, slug), eq(users.username, username)));

  if (blogRows.length < 1) {
    notFound();
  }

  const grouped: Record<string, BlogType & { content: JSONContent }> = {};
  for (const row of blogRows) {
    const key = row.slug;

    if (!grouped[key]) {
      grouped[key] = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        image: row.image,
        content: row.content,
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
  const blogRow = Object.values(grouped)[0];

  const actualComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      user: {
        name: users.name,
        image: users.image,
        username: users.username,
      },
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.userId))
    .where(eq(comments.blogId, blogRow.id))
    .orderBy(desc(comments.createdAt));

  const { likes, user } = blogRow;
  const { id, role } = session!.user;
  const isUser = role === "admin" || id === user.id;
  const isLiked = likes.some((like) => like.userId === id);

  return (
    <BlogPage
      blog={{ ...blogRow, user, likes, comments: actualComments }}
      isUser={isUser}
      isLiked={isLiked}
      username={user.username}
    />
  );
}
