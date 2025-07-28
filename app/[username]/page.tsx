import "server-only";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { ProfileClient } from "./client";
import { notFound } from "next/navigation";
import { getRedisClient } from "@/lib/redis";
import { users, blogs, likes } from "@/db/schema";
import type { BlogType, UserType } from "@/lib/static/types";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> => {
  const { username } = await params;

  return {
    title: `MetaPress | ${username}`,
    description: `View the profile of ${username}.`,
  };
};

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { username } = await params;

  const redis = await getRedisClient();
  const cacheKey = `user:${username}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    const { userRow, actualBlogs } = JSON.parse(cached) as {
      userRow: UserType & { totalLikes: number };
      actualBlogs: BlogType[];
    };

    const { username: sUsername, role } = session!.user;
    const isSelf = sUsername === userRow.username;
    const isSelfAdmin = role === "admin" && isSelf;

    return (
      <ProfileClient
        userRow={userRow}
        actualBlogs={actualBlogs}
        isSelf={isSelf}
        isSelfAdmin={isSelfAdmin}
      />
    );
  }

  const rows = await db
    .select({
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        role: users.role,
      },
      blog: {
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        image: blogs.image,
        category: blogs.category,
        createdAt: blogs.createdAt,
      },
      totalLikes: sql<number>`count(${likes.blogId}) OVER (PARTITION BY ${users.id})`,
    })
    .from(users)
    .leftJoin(blogs, eq(users.id, blogs.userId))
    .leftJoin(likes, eq(likes.blogId, blogs.id))
    .where(eq(users.username, username));

  if (!rows.length || !rows[0].user) {
    notFound();
  }

  const userRow = {
    ...rows[0].user,
    totalLikes: rows[0].totalLikes ?? 0,
  };

  const blogMap = new Map<string, BlogType>();
  for (const row of rows) {
    const blog = row.blog;
    if (!blog?.id) {
      continue;
    }

    if (!blogMap.has(blog.slug)) {
      blogMap.set(blog.slug, {
        ...blog,
        user: userRow,
      });
    }
  }
  const actualBlogs = Array.from(blogMap.values());

  await redis.set(cacheKey, JSON.stringify({ userRow, actualBlogs }), {
    EX: 60 * 10,
  });

  const { username: sUsername, role } = session!.user;
  const isSelf = sUsername === userRow.username;
  const isSelfAdmin = role === "admin" && isSelf;

  return (
    <ProfileClient
      userRow={userRow}
      actualBlogs={actualBlogs}
      isSelf={isSelf}
      isSelfAdmin={isSelfAdmin}
    />
  );
}
