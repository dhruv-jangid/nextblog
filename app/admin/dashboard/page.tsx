import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { BlogGrid } from "@/components/bloggrid";
import { Author } from "@/components/author";
import { Trash2 } from "lucide-react";

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
    }),
  ]);

  return (
    <div className="flex flex-col gap-10 px-4 lg:px-16 py-4 lg:py-12 tracking-tight">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Recent Blogs</h2>
        <BlogGrid blogs={blogs} />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {users.map(
            (user: {
              slug: string;
              image: string | null;
              createdAt: Date;
              name: string;
              role: string;
              email: string;
            }) => (
              <div
                key={user.slug}
                className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <Author
                    date={user.createdAt}
                    image={user.image}
                    name={user.name}
                    slug={user.slug}
                  />
                  <button className="h-fit bg-red-700 cursor-pointer p-2 rounded-xl hover:bg-red-700/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Trash2 />
                  </button>
                </div>
                <div className="flex justify-between">
                  <p className="bg-white/90 text-black rounded-xl py-1 px-3 w-fit">
                    {user.role}
                  </p>
                  <h1 className="bg-white/90 text-black rounded-xl py-1 px-3 w-fit">
                    {user.email}
                  </h1>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
