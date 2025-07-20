import "server-only";
import { db } from "@/db";
import Link from "next/link";
import { auth } from "@/lib/auth";
import ProfileImg from "./client";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { eq, desc, sql } from "drizzle-orm";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { BlogGrid } from "@/components/bloggrid";
import { users, blogs, likes } from "@/db/schema";
import type { BlogType } from "@/lib/static/types";
import { SquareArrowOutUpRight } from "lucide-react";

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
  const [userRow] = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      image: users.image,
      role: users.role,
      totalLikes: sql<number>`count(distinct ${likes})`,
    })
    .from(users)
    .leftJoin(blogs, eq(blogs.userId, users.id))
    .leftJoin(likes, eq(likes.blogId, blogs.id))
    .where(eq(users.username, username))
    .groupBy(users.id);

  if (!userRow) {
    notFound();
  }

  const blogsRaw = await db
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
      likes: {
        userId: likes.userId,
        blogId: likes.blogId,
      },
    })
    .from(blogs)
    .innerJoin(users, eq(users.id, blogs.userId))
    .leftJoin(likes, eq(likes.blogId, blogs.id))
    .where(eq(blogs.userId, userRow.id))
    .orderBy(desc(blogs.createdAt));

  const grouped: Record<string, BlogType> = {};
  for (const row of blogsRaw) {
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

    if (row.likes?.userId && row.likes?.blogId) {
      grouped[key].likes.push({
        userId: row.likes.userId,
        blogId: row.likes.blogId,
      });
    }
  }
  const actualBlogs = Object.values(grouped);

  const { username: sUsername, role } = session!.user;
  const isSelf = sUsername === userRow.username;
  const isSelfAdmin = role === "admin" && isSelf;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-16 justify-center lg:flex-row items-center lg:text-base">
        <div className="flex lg:justify-center gap-8 xl:gap-16 w-full py-22 pb-18">
          <div className="h-30 w-30 lg:h-36 lg:w-36">
            <ProfileImg
              imageUrl={userRow.image}
              isUser={userRow.username === sUsername}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <h1 className={`${titleFont.className} text-3xl`}>
                {userRow.username}
              </h1>
              {isSelf && (
                <Link href="settings/profile" className="hidden md:block">
                  <Button>Edit Profile</Button>
                </Link>
              )}
              {isSelfAdmin && (
                <Link href={`/admin/dashboard`} className="hidden md:block">
                  <Button>
                    <span className="flex items-center gap-1.5">
                      Dashboard <SquareArrowOutUpRight size={18} />
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                {actualBlogs.length}
                <span className="opacity-70">Blogs</span>
              </div>
              <div className="flex items-center gap-2">
                {userRow.totalLikes}
                <span className="opacity-70">Likes</span>
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
                <Link href="settings?tab=profile" className="md:hidden">
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
      </div>

      {actualBlogs.length > 0 ? (
        <BlogGrid blogs={actualBlogs} />
      ) : (
        <div
          className={`${titleFont.className} flex justify-center items-center min-h-[59vh] text-4xl w-full border-t`}
        >
          This user has no published blogs!
        </div>
      )}
    </div>
  );
}
