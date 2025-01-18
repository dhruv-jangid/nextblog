import { IoMdHeartEmpty } from "react-icons/io";
import { prisma } from "@/lib/db";
import type { Blog } from "@prisma/client";
import { Button } from "@/components/button";
import { Author } from "@/components/author";
import { CloudImage } from "@/components/cloudimage";

export default async function Blog({
  params,
}: {
  params: {
    username: string;
    id: string;
  };
}) {
  const { username, id } = await params;

  const blog = await prisma.blog.findUnique({
    include: { author: { select: { name: true, slug: true } } },
    where: { slug: id, author: { slug: username } },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="flex flex-col gap-10 px-16 py-12">
      <div className="flex flex-col gap-6">
        <Button>{blog.category}</Button>
        <h1 className="text-3xl rounded-lg w-3/5 font-semibold">
          {blog.title}
        </h1>
        <Author
          date={blog.createdAt}
          slug={blog.author.slug}
          publicId={blog.authorId}
          name={blog.author.name}
        />
      </div>
      <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
        <CloudImage
          publicId={`${blog.id}_${blog.category}_${blog.authorId}`}
          alt={blog.title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
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
