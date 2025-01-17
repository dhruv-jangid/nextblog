import Button from "@/components/button";
import Image from "next/image";
import User from "@/components/user";
import { getCldImageUrl } from "next-cloudinary";
import { BlogType } from "@/components/bloggrid";
import Link from "next/link";

export default async function Carousel({ blog }: { blog: BlogType[] }) {
  const imgUrl = getCldImageUrl({
    src: `nextblog/blogs/${blog.blogid}_${blog.category}_${blog.userid}`,
  });

  const authorUrl = getCldImageUrl({
    src: `nextblog/authors/${blog.userid}`,
  });

  return (
    <Link href={`/blogs/${blog.username}/${blog.blogid}`}>
      <div className="relative h-[550px] mb-10">
        <Image
          src={imgUrl}
          alt="Urban Gardening"
          fill={true}
          priority={true}
          className="mx-auto rounded-2xl object-cover"
        />
        <div className="absolute left-14 bottom-14 flex flex-col gap-4">
          <Button>{blog.category}</Button>
          <h1 className="text-white text-4xl font-bold w-3/5">{blog.title}</h1>
          <div className="flex gap-2 items-center">
            <Image
              src={authorUrl}
              alt={blog.name}
              width={42}
              height={42}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-white font-semibold leading-none">
                {blog.name}
              </h3>
              <h6 className="text-gray-300 leading-none">{blog.date}</h6>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
