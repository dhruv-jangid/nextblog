import Image from "next/image";
import { getCldImageUrl } from "next-cloudinary";
import { IoMdHeartEmpty } from "react-icons/io";
import { prisma } from "@/lib/db";

export default async function Blog({
  params,
}: {
  params: { username: string; id: string };
}) {
  const { username, id } = await params;
  console.log(username, id);
  const blog = await prisma.blog.findUnique({
    include: { author: { select: { name: true, slug: true } } },
    where: { slug: id, author: { slug: username } },
  });
  const imgUrl = getCldImageUrl({
    src: `nextblog/blogs/${blog.id}_${blog.category}_${blog.authorId}`,
  });

  return (
    <div className="flex flex-col gap-4 px-8">
      <div className="flex justify-center">
        <h1 className="text-3xl bg-[#191919] rounded-lg py-2 px-4">
          {blog.title}
        </h1>
      </div>
      <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
        <Image
          src={imgUrl}
          alt={blog.title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex justify-between text-lg">
        <h2 className="bg-[#191919] rounded-lg py-2 px-4">{blog.category}</h2>
        <div className="flex gap-4">
          <h2 className="bg-[#191919] rounded-lg py-2 px-4">
            {new Date(blog.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </h2>
          <h2 className="bg-[#191919] rounded-lg py-2 px-4">
            {blog.author.name}
          </h2>
        </div>
      </div>
      <div
        className="text-lg bg-[#191919] p-6 rounded-lg"
        id="blogdesc"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
      <div className="flex justify-end">
        <IoMdHeartEmpty size={36} className="cursor-pointer" />
      </div>
    </div>
  );
}
