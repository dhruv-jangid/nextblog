import type { BlogWithAuthor } from "@/app/createblog/page";
import { Button } from "@/components/button";
import { Author } from "./author";
import { CloudImage } from "@/components/cloudimage";
import Link from "next/link";

export const Carousel: React.FC<{
  blog: BlogWithAuthor;
}> = ({ blog }) => {
  return (
    <div className="relative h-[50vh] lg:h-[40vh] xl:h-[80vh] w-full mb-10">
      <CloudImage
        publicId={blog.id}
        alt={blog.title}
        fill={true}
        priority={true}
        className="rounded-3xl bg-gradient-to-bl from-[#191919] from-40% to-transparent"
      />
      <div className="absolute left-10 md:left-14 bottom-10 md:bottom-14 flex flex-col gap-4">
        <Button>
          <Link href={`/blogs/${blog.category}`} className="text-sm md:text-md">
            {blog.category}
          </Link>
        </Button>

        <Link href={`/${blog.author.slug}/${blog.slug}`}>
          <h1 className="text-white text-2xl lg:text-3xl font-bold w-4/5 md:w-3/5 line-clamp-3">
            {blog.title}
          </h1>
        </Link>
        <Author
          date={blog.createdAt}
          slug={blog.author.slug}
          publicId={blog.authorId}
          name={blog.author.name}
        />
      </div>
    </div>
  );
};
