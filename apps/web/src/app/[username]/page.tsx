import "server-only";
import { db } from "@/db";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { ProfileImage } from "./profileimg";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { BlogGrid } from "@/components/bloggrid";
import { users, blogs, likes } from "@/db/schema";
import { SquareArrowOutUpRight } from "lucide-react";
import { notFound, redirect } from "next/navigation";

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

export default async function Username({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  const { username } = await params;
  const cacheKey = `user:${username}`;
  const cached = await redis.get(cacheKey);

  let userRow: User;
  let actualBlogs: Blog[];
  if (cached) {
    const parsedData = JSON.parse(cached) as {
      userRow: User;
      actualBlogs: Blog[];
    };
    userRow = parsedData.userRow;
    actualBlogs = parsedData.actualBlogs;
  } else {
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

    userRow = {
      ...rows[0].user,
      totalLikes: rows[0].totalLikes ?? 0,
    };

    const blogMap = new Map<string, Blog>();
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
    actualBlogs = Array.from(blogMap.values());

    await redis.set(cacheKey, JSON.stringify({ userRow, actualBlogs }), {
      EX: 60 * 10,
    });
  }

  const isSelf = session.user.username === userRow.username;
  const isSelfAdmin = session.user.role === "admin" && isSelf;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-8 xl:gap-12 w-full py-11 lg:py-22">
        <div className="h-30 w-30 lg:h-36 lg:w-36">
          <ProfileImage
            imageUrl={userRow.image}
            isUser={isSelf}
            name={userRow.name!}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-1.5 items-center">
            <h1 className={`${titleFont.className} text-3xl mr-2`}>
              {userRow.username}
            </h1>
            {isSelf && (
              <Link href="/account/profile" className="hidden md:block">
                <Button variant="secondary">Edit Profile</Button>
              </Link>
            )}
            {isSelfAdmin && (
              <Link href={`/admin/dashboard`} className="hidden md:block">
                <Button variant="secondary">
                  <span className="flex items-center gap-1.5">
                    Dashboard <SquareArrowOutUpRight />
                  </span>
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              {actualBlogs.length}
              <span className="text-muted-foreground">Blogs</span>
            </div>
            <div className="flex items-center gap-2">
              {userRow.totalLikes}
              <span className="text-muted-foreground">Likes</span>
            </div>
          </div>
          <div className="flex gap-2 items-center text-lg opacity-85">
            {userRow.name}
            {userRow.role === "admin" && (
              <span className="text-lg text-red-500">
                ({userRow.role.toUpperCase()})
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            {isSelf && (
              <Link href="/account/profile" className="md:hidden">
                <Button>Edit Profile</Button>
              </Link>
            )}
            {isSelfAdmin && (
              <Link href={`/admin/dashboard`} className="md:hidden">
                <Button>
                  Dashboard <SquareArrowOutUpRight />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {actualBlogs.length > 0 ? (
        <div className="min-h-[60dvh]">
          <BlogGrid blogs={actualBlogs} />
        </div>
      ) : (
        <div
          className={`${titleFont.className} flex justify-center items-center min-h-[59vh] text-4xl w-full border-t text-muted-foreground`}
        >
          {isSelf ? (
            <Link href="/createblog">
              <Button variant="secondary">Create your first blog</Button>
            </Link>
          ) : (
            "This user has no published blogs!"
          )}
        </div>
      )}
    </div>
  );
}
