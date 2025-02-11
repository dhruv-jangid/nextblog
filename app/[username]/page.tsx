import { Button } from "@/components/button";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  const user_id = session ? session.user.id : null;

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
      <div className="flex flex-col gap-16 justify-center lg:flex-row items-center lg:text-base">
        <div className="flex lg:justify-center gap-8 xl:gap-16">
          <div className="relative h-30 w-30 lg:h-36 lg:w-36">
            <Image
              src={user.image!}
              fill={true}
              alt={user.name!}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-6 items-center">
              <h1 className="text-3xl font-semibold">
                {user.slug}
                {user.role === "ADMIN" && (
                  <span className="text-blue-500">({user.role})</span>
                )}
              </h1>
              {user_id === user.id && (
                <Link
                  href={`/${user.slug}/settings`}
                  className="text-sm xl:text-base w-max hidden md:block"
                >
                  <Button>Edit Profile</Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 text-lg">
              {user.blogs.length}
              <div>Blogs</div>
            </div>

            <div className="text-xl font-medium">{user.name}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center my-6">
        <hr className="col-span-2 w-full md:w-3/4 border-gray-500" />
      </div>

      {user.blogs.length > 0 ? (
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
      ) : (
        <div className="flex justify-center items-center min-h-[60vh] text-4xl rounded-lg w-3/4 mx-auto">
          Currently, this user has no blogs!
        </div>
      )}
    </div>
  );
}
