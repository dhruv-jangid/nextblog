import { Button } from "@/components/button";
import { Author } from "@/components/author";
import { CloudImage } from "@/components/cloudimage";
import Link from "next/link";

type BlogWithAuthorAndLikes = {
  id: string;
  title: string;
  slug: string;
  category: string;
  createdAt: Date;
  likes: { blogId: string; userId: string }[];
  author: { name: string; slug: string; id: string };
};

export const Carousel = ({ blog }: { blog: BlogWithAuthorAndLikes }) => {
  return (
    <div className="relative h-[50vh] lg:h-[80vh] max-h-[24rem] sm:max-h-[40rem] w-full mb-10">
      <CloudImage
        publicId={blog.id}
        alt={blog.title}
        fill={true}
        priority={true}
        className="rounded-3xl bg-linear-to-bl from-[#191919] from-40% to-transparent object-cover"
      />
      <div className="absolute left-8 md:left-14 bottom-8 md:bottom-14 text-base flex flex-col gap-2 sm:gap-4">
        <Link
          href={`/blogs/${blog.category}`}
          className="text-sm xl:text-base w-max"
        >
          <Button>{blog.category}</Button>
        </Link>

        <Link href={`/${blog.author.slug}/${blog.slug}`}>
          <h1 className="text-white text-xl md:text-3xl xl:text-4xl font-bold w-2/3 md:w-3/5 line-clamp-2 sm:line-clamp-3">
            {blog.title}
          </h1>
        </Link>
        <Author
          date={blog.createdAt.toISOString()}
          slug={blog.author.slug}
          publicId={blog.author.id}
          name={blog.author.name}
        />
      </div>
    </div>
  );
};
