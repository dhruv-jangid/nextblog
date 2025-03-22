import { Button } from "@/components/button";
import { Author } from "@/components/author";
import Link from "next/link";
import Image from "next/image";
import type { Blog, Like, User } from "@prisma/client";

export const Carousel = ({
  blog,
}: {
  blog: Omit<Blog, "id" | "content" | "authorId" | "updatedAt"> & {
    likes: Pick<Like, "userId" | "blogId">[];
    author: Pick<User, "id" | "name" | "slug" | "image">;
  };
}) => {
  return (
    <div className="relative rounded-4xl overflow-hidden h-[40vh] md:h-[70vh] max-h-[48rem] w-full mb-10">
      <Image
        src={blog.image}
        alt={blog.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute left-8 md:left-14 bottom-8 md:bottom-14 text-base flex flex-col gap-2 sm:gap-4 w-2/3 md:w-1/2">
        <Link href={`/blogs/${blog.category}`} className="text-sm xl:text-base">
          <Button roseVariant>{blog.category}</Button>
        </Link>
        <Link
          href={`/${blog.author.slug}/${blog.slug}`}
          className="text-xl antialiased md:text-3xl xl:text-4xl font-bold line-clamp-2 text-balance hover:animate-pulse sm:line-clamp-3"
        >
          {blog.title}
        </Link>
        <Author
          date={blog.createdAt}
          image={blog.author.image}
          name={blog.author.name}
          slug={blog.author.slug}
        />
      </div>
    </div>
  );
};
