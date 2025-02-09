import { Button } from "@/components/button";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cookieSession = (await cookies()).get("metapress");
  const user_id = cookieSession ? JSON.parse(cookieSession.value).id : null;

  const user = await prisma.user.findUnique({
    where: { slug: username },
    include: {
      blogs: {
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          createdAt: true,
          likes: { select: { blogId: true, userId: true } },
          author: { select: { name: true, slug: true, id: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
      tags: ["blogs"],
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-12">
      <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center lg:text-base">
        <div className="flex lg:justify-center items-center gap-4">
          <Image
            src={user.image!}
            width={112}
            height={112}
            alt={user.name!}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-gray-400 text-lg">
              @{user.slug}{" "}
              {user.role === "ADMIN" && (
                <span className="text-blue-500">({user.role})</span>
              )}
            </p>
          </div>
        </div>

        {user_id === user.id && (
          <Link
            href={`/${user.slug}/settings`}
            className="text-sm xl:text-base w-max"
          >
            <Button>Edit Profile</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-2 text-base">
        <h2>Total Blogs: {user.blogs.length}</h2>
      </div>

      <div className="grid gap-4">
        {user.blogs.map((blog) => (
          <Link
            href={`/${user.slug}/${blog.slug}`}
            key={blog.id}
            className="bg-[#191919] p-4 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <h2 className="text-xl mb-2">{blog.title}</h2>
            <p className="text-gray-400 mb-2">{blog.category}</p>
            <p className="text-sm text-gray-400">
              {new Date(blog.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
