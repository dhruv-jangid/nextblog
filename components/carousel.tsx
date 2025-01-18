"use client";

import type { BlogWithAuthor } from "@/app/createblog/page";
import { Button } from "@/components/button";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

export const Carousel: React.FC<{
  blog: BlogWithAuthor;
}> = ({ blog }) => {
  const router = useRouter();
  return (
    <div
      className="relative h-[70vh] w-full mb-10 cursor-pointer"
      onClick={() => {
        router.push(`/${blog.author.slug}/${blog.slug}`);
      }}
    >
      <CldImage
        src={`nextblog/blogs/${blog.id}_${blog.category}_${blog.authorId}`}
        alt={blog.title}
        fill={true}
        priority={true}
        className="rounded-2xl object-cover"
      />
      <div className="absolute left-14 bottom-14 flex flex-col gap-4">
        <Button>{blog.category}</Button>
        <h1 className="text-white text-4xl font-bold w-3/5">{blog.title}</h1>
        <div
          className="flex gap-2 items-center"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${blog.author.slug}`);
          }}
        >
          <CldImage
            src={`nextblog/authors/${blog.authorId}`}
            alt={blog.author.name}
            width={42}
            height={42}
            priority={true}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-white font-semibold leading-none">
              {blog.author.name}
            </h3>
            <h6 className="text-gray-300 leading-none">
              {new Date(blog.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};
