import { Button } from "@/components/button";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import Account from "@/public/images/account.png";
import { RxExternalLink } from "react-icons/rx";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  const user_slug = session ? session.user.slug : null;

  const user = await prisma.user.findUnique({
    where: { slug: username },
    select: {
      slug: true,
      role: true,
      name: true,
      image: true,
      blogs: {
        select: {
          title: true,
          slug: true,
          image: true,
          category: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
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
    return (
      <div className="flex justify-center items-center text-2xl w-full h-[70vh]">
        No such user! Please double check the username.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-12">
      <div className="flex flex-col gap-16 justify-center lg:flex-row items-center lg:text-base">
        <div className="flex lg:justify-center gap-8 xl:gap-16">
          <div className="relative h-30 w-30 lg:h-36 lg:w-36">
            <Image
              src={user.image || Account}
              fill={true}
              alt={user.name!}
              quality={100}
              className="rounded-full"
            />
            {user_slug === user.slug && (
              <Link
                href={`/${user.slug}/settings`}
                className="text-sm xl:text-base w-max md:hidden absolute left-1/2 -translate-x-1/2 -bottom-2 backdrop-blur-2xl text-[#EEEEEE] font-medium py-1.5 px-3 rounded-xl"
              >
                Edit Profile
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <h1 className="text-3xl font-medium">{user.slug}</h1>
              {user_slug === user.slug && (
                <Link
                  href={`/${user.slug}/settings`}
                  className="hidden md:block"
                >
                  <Button>Edit Profile</Button>
                </Link>
              )}
              {session?.user.role === "ADMIN" && user_slug === user.slug && (
                <Link href={`/admin/dashboard`} className="hidden md:block">
                  <Button>
                    <span className="flex items-center gap-1">
                      Dashboard <RxExternalLink />
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">{user.blogs.length}</h1>
                <div>Blogs</div>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">
                  {user.blogs.reduce((sum, blog) => sum + blog._count.likes, 0)}
                </h1>
                <div>Likes</div>
              </div>
            </div>

            <div className="flex gap-2 items-center text-lg font-medium">
              {user.name}
              {user.role === "ADMIN" && (
                <span className="text-red-700 text-lg">({user.role})</span>
              )}
            </div>
            {session?.user.role === "ADMIN" && user_slug === user.slug && (
              <Link href={`/admin/dashboard`} className="md:hidden">
                <Button>
                  <span className="flex items-center gap-1">
                    Dashboard <RxExternalLink />
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center my-6">
        <hr className="col-span-2 w-full md:w-3/4 border-gray-500" />
      </div>

      {user.blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {user.blogs.map((blog) => (
            <Link
              href={`/${user.slug}/${blog.slug}`}
              key={blog.slug}
              className="group bg-[#191919] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-48">
                <Image
                  src={blog.image || "/default-blog-image.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-6">
                <span className="text-gray-400 text-sm">
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>

                <h2 className="text-xl font-semibold mt-2 mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {blog.title}
                </h2>

                <div className="flex items-center justify-between pt-4 border-t border-[#252525]">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 24 24"
                      fill={blog._count.likes > 0 ? "currentColor" : "none"}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-gray-400">{blog._count.likes}</span>
                  </div>
                  <span className="text-sm text-gray-400 px-3 py-1 bg-[#252525] rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh] text-4xl rounded-lg w-3/4 mx-auto">
          Currently, this user has no published blogs!
        </div>
      )}
    </div>
  );
}
