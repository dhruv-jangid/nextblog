import Button from "@/components/button";
import { prisma } from "@/lib/db";
import { getCldImageUrl } from "next-cloudinary";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { slug: username },
    include: {
      blogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const loggedInUser = (await cookies()).get("metapress")?.value;

  const profileUrl = getCldImageUrl({
    src: `nextblog/authors/${user.id}`,
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4">
          <Image
            src={profileUrl}
            width={100}
            height={100}
            alt="User Image"
            className="rounded-xl"
          />
          <div>
            <h1 className="text-3xl">{user.name}</h1>
            <p className="text-gray-400">@{user.slug}</p>
          </div>
        </div>
        {loggedInUser === user.id && <Button>Edit Profile</Button>}
      </div>

      <div className="flex gap-4">
        <div className="bg-[#191919] px-4 py-2 rounded-lg">
          {user.blogs.length} blogs
        </div>
        <div className="bg-[#191919] px-4 py-2 rounded-lg">{user.role}</div>
      </div>

      <div className="grid gap-4">
        {user.blogs.map((blog) => (
          <div key={blog.id} className="bg-[#191919] p-4 rounded-lg">
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
          </div>
        ))}
      </div>
    </div>
  );
}
