import "server-only";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { BlogClient } from "./client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getRedisClient } from "@/lib/redis";
import type { JSONContent } from "@tiptap/react";
import { eq, and, desc, sql } from "drizzle-orm";
import type { BlogType } from "@/lib/static/types";
import { blogs, users, likes as dbLikes, comments, likes } from "@/db/schema";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> => {
  const { username, slug } = await params;

  return {
    title: `MetaPress | ${username} | ${slug}`,
  };
};

export default async function Blog({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  const redis = await getRedisClient();
  const blogCacheKey = `blog:${username}:${slug}`;
  const cached = await redis.get(blogCacheKey);

  let blogRow: BlogType & { content: JSONContent };
  if (cached) {
    blogRow = JSON.parse(cached);
  } else {
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
      })
      .from(blogs)
      .innerJoin(users, eq(users.id, blogs.userId))
      .leftJoin(dbLikes, eq(dbLikes.blogId, blogs.id))
      .where(and(eq(blogs.slug, slug), eq(users.username, username)));

    if (!blogRows.length) {
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
        };
      }
    }
    blogRow = Object.values(grouped)[0];

    await redis.set(blogCacheKey, JSON.stringify(blogRow), { EX: 300 });
  }

  const commentsCacheKey = `comments:${blogRow.id}`;
  const cachedComments = await redis.get(commentsCacheKey);

  let actualComments;
  if (cachedComments) {
    actualComments = JSON.parse(cachedComments);
  } else {
    actualComments = await db
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

    await redis.set(commentsCacheKey, JSON.stringify(actualComments), {
      EX: 60,
    });
  }

  const likesCacheKey = `blog:${blogRow.id}:likes`;
  const cachedLikes = await redis.get(likesCacheKey);

  let totalLikes: number = 0;
  if (cachedLikes) {
    totalLikes = Number(cachedLikes);
  } else {
    const totalLikes = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(likes)
      .where(eq(likes.blogId, blogRow.id))
      .then((res: Array<{ count: number }>) => res[0]?.count ?? 0);

    await redis.set(likesCacheKey, totalLikes);
  }

  const { user } = blogRow;
  const session = await auth.api.getSession({ headers: await headers() });
  const { id, username: sessionUsername, role } = session!.user;
  const isUser = role === "admin" || id === user.id;

  const isLiked = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, id), eq(likes.blogId, blogRow.id)))
    .then((res: { length: number }) => res.length > 0);

  return (
    <BlogClient
      blog={{ ...blogRow, user, comments: actualComments }}
      username={sessionUsername!}
      isUser={!!isUser}
      isLiked={!!isLiked}
      totalLikes={totalLikes}
    />
  );
}
