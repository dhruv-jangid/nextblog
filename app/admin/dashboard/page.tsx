import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { BlogGrid } from "@/components/bloggrid";
import { Author } from "@/components/author";
import { User } from "@prisma/client";
import { DeleteUserBtn } from "./deleteuser";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [blogs, users] = await Promise.all([
    prisma.blog.findMany({
      select: {
        title: true,
        slug: true,
        image: true,
        category: true,
        createdAt: true,
        likes: { select: { blogId: true, userId: true } },
        author: {
          select: { name: true, slug: true, id: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 60,
        swr: 60,
        tags: ["blogs"],
      },
      take: 9,
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        tags: ["blogs"],
      },
      take: 9,
    }),
  ]);

  return (
    <div className="flex flex-col gap-10 px-4 lg:px-16 py-4 lg:py-12 tracking-tight">
      <h1 className="text-3xl font-bold text-rose-300 text-end">
        Admin Dashboard
      </h1>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-end">Recent Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {users.map((user: Omit<User, "emailVerified" | "updatedAt">) => (
            <div
              key={user.slug}
              className="bg-neutral-900 rounded-4xl p-5 flex flex-col gap-4"
            >
              <div className="flex justify-between">
                <Author
                  date={user.createdAt}
                  image={user.image}
                  name={user.name}
                  slug={user.slug}
                />
                <DeleteUserBtn id={user.id} name={user.name} />
              </div>
              <div className="flex flex-col text-neutral-300 leading-tight ml-1.5">
                <span>{user.email}</span>
                <span>{user.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-end">Recent Blogs</h2>
        <BlogGrid blogs={blogs} />
      </div>
    </div>
  );
}
