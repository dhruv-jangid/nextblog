import Link from "next/link";
import Image from "next/image";
import { Author } from "./author";
import { Button } from "./ui/button";
import { titleFont } from "@/lib/static/fonts";
import type { BlogType } from "@/lib/static/types";

export const Carousel = ({ blog }: { blog: BlogType }) => {
  return (
    <div className="relative lg:static flex justify-between h-[92dvh] w-full border-b">
      <div className="lg:flex-[3_3_0%] flex flex-col w-full self-end gap-3 p-6 shadow-xl lg:shadow-none lg:p-0 lg:ml-8 lg:mb-8">
        <div className="flex items-center gap-4">
          <time>
            {new Intl.DateTimeFormat("en-GB", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            }).format(new Date(blog.createdAt))}
          </time>
          <Link href={`/blogs/${blog.category}`}>
            <Button variant="outline" className="tracking-tight">
              {blog.category}
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-4 lg:gap-6 lg:w-2/3 text-balance">
          <Link
            href={`/${blog.user.username}/${blog.slug}`}
            className={`${titleFont.className} text-4xl lg:text-6xl text-balance underline-hover hover:animate-pulse line-clamp-3 leading-tight lg:leading-16`}
          >
            {blog.title}
          </Link>
          <Author
            image={blog.user.image}
            name={blog.user.name}
            username={blog.user.username}
          />
        </div>
      </div>
      <div className="-z-10 lg:flex lg:relative flex-[2_2_0%] lg:border-l">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          className="object-cover w-fit"
        />
      </div>
    </div>
  );
};
