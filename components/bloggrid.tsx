import Link from "next/link";
import Image from "next/image";
import { Author } from "@/components/author";
import { Button } from "@/components/ui/button";
import type { BlogType } from "@/lib/static/types";

export const BlogGrid = async ({ blogs }: { blogs: BlogType[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 outline outline-accent-foreground">
      {blogs.map(({ id, title, image, category, slug, user }) => {
        return (
          <div
            key={id}
            className="relative flex flex-col min-h-96 h-[50dvh] max-h-[500px] justify-end outline outline-accent-foreground"
          >
            <Link href={`/${user.username}/${slug}`}>
              <Image
                src={image}
                alt={title}
                fill
                priority={false}
                placeholder="empty"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="cursor-pointer object-cover -z-50"
              />
            </Link>
            <div className="flex flex-col gap-6 p-6 bg-accent border-t">
              <div className="flex justify-between gap-6 w-full overflow-visible line-clamp-2">
                <Link
                  href={`/${user.username}/${slug}`}
                  className="text-2xl text-balance w-3/4 cursor-pointer tracking-tight hover:animate-pulse underline-hover"
                >
                  {title}
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <Author
                  image={user.image}
                  name={user.name}
                  username={user.username}
                />
                <Link
                  href={`/blogs/${category}`}
                  className="text-sm xl:text-base w-max"
                >
                  <Button variant="outline">{category}</Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
