import type { BlogWithAuthor } from "@/app/createblog/page";
import { Button } from "@/components/button";
import { Author } from "./author";
import { CloudImage } from "@/components/cloudimage";
import Link from "next/link";

export const Carousel: React.FC<{
  blog: BlogWithAuthor;
}> = ({ blog }) => {
  return (
    <div className="relative h-[70vh] w-full mb-10">
      <CloudImage
        publicId={blog.id}
        alt={blog.title}
        fill={true}
        priority={true}
        className="rounded-2xl"
      />
      <div className="absolute left-14 bottom-14 flex flex-col gap-4">
        <Button>
          <Link href={`/blogs/${blog.category}`}>{blog.category}</Link>
        </Button>
        <Link href={`/${blog.author.slug}/${blog.slug}`}>
          <h1 className="text-white text-3xl font-bold w-3/5">{blog.title}</h1>
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
