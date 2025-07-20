import "server-only";
import { db } from "@/db";
import type { Metadata } from "next";
import { DeleteUserBtn } from "./client";
import { desc, eq, sql } from "drizzle-orm";
import { Author } from "@/components/author";
import { titleFont } from "@/lib/static/fonts";
import { BlogGrid } from "@/components/bloggrid";
import { blogs, users, likes } from "@/db/schema";
import type { BlogType } from "@/lib/static/types";

export const metadata: Metadata = {
  title: "Admin | Dashboard",
};

export default async function AdminDashboard() {
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
      likes: {
        userId: likes.userId,
        blogId: likes.blogId,
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

    if (row.likes?.userId && row.likes?.blogId) {
      grouped[key].likes.push({
        userId: row.likes.userId,
        blogId: row.likes.blogId,
      });
    }
  }
  const actualBlogs = Object.values(grouped);

  const actualUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      image: users.image,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      totalBlogs: sql<number>`count(${blogs.id})`,
      totalLikes: sql<number>`count(distinct ${likes})`,
    })
    .from(users)
    .leftJoin(blogs, eq(users.id, blogs.userId))
    .leftJoin(likes, eq(likes.blogId, blogs.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return (
    <div className="flex flex-col gap-10">
      <h1
        className={`${titleFont.className} text-4xl font-medium text-end border-b pb-12 p-16`}
      >
        Admin Dashboard
      </h1>

      <div className="flex flex-col gap-6 pb-12 px-16 border-b">
        <h2 className="text-2xl text-end">Recent Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {actualUsers.map((user) => (
            <div
              key={user.username}
              className="rounded-4xl p-7 flex flex-col gap-4 border"
            >
              <div className="flex justify-between">
                <Author
                  image={user.image}
                  name={user.name}
                  username={user.username}
                />
                {!(user.role === "admin") && <DeleteUserBtn userId={user.id} />}
              </div>
              <div className="flex flex-col ml-1.5 gap-1">
                <span>
                  <span className="tracking-tight">Display Name - </span>
                  {user.name}
                </span>
                <span>
                  <span className="tracking-tight">Email - </span>
                  {user.email}
                </span>
                <span>
                  <span className="tracking-tight">Blogs - </span>
                  {user.totalBlogs}
                </span>
                <span>
                  <span className="tracking-tight">Likes - </span>
                  {user.totalLikes}
                </span>
                <span>
                  <span className="tracking-tight">Created - </span>
                  {new Intl.DateTimeFormat("en-GB", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </span>
                <span className={`${user.role === "admin" && "text-red-500"}`}>
                  <span className="tracking-tight">Role - </span>
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl text-end mr-16">Recent Blogs</h2>
      <BlogGrid blogs={actualBlogs} />
    </div>
  );
}
