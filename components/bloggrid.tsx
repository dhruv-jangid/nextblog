"use client";

import { Button } from "@/components/button";
import { Author } from "@/components/author";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import type { BlogWithAuthor } from "@/app/createblog/page";

const Card: React.FC<BlogWithAuthor> = ({
  id,
  title,
  createdAt,
  category,
  authorId,
  slug,
  author: { slug: username, name },
}) => {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer rounded-2xl p-6 border border-gray-600 flex flex-col h-[30rem] justify-between bg-[#191919]"
      onClick={() => {
        router.push(`/${username}/${slug}`);
      }}
    >
      <div className="relative h-1/2 rounded-lg overflow-hidden">
        <CldImage
          src={`nextblog/blogs/${id}_${category}_${authorId}`}
          alt={title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <Button>{category}</Button>
      <h3 className="text-xl font-medium line-clamp-3 w-10/12 font-[Degular Variable Text]">
        {title}
      </h3>
      <Author
        publicId={authorId}
        name={name}
        slug={username}
        date={createdAt}
      />
    </div>
  );
};

export const BlogGrid: React.FC<{
  blogs: BlogWithAuthor[];
}> = ({ blogs }) => {
  return (
    <div className="grid grid-cols-3 gap-8 px-4">
      {blogs.map((blog) => (
        <Card key={blog.id} {...blog} />
      ))}
    </div>
  );
};
