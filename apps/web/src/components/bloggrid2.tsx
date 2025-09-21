import Link from "next/link";
import Image from "next/image";
import { Author } from "./author";
import { Button } from "./ui/button";

export const BlogGrid2 = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {blogs.map(({ id, title, image, category, slug, user }) => {
        return (
          <div
            key={id}
            className="relative flex flex-col min-h-96 h-[50dvh] max-h-[500px] justify-end outline group"
          >
            <Link
              href={`/${user!.username}/${slug}`}
              className="relative block h-full overflow-hidden"
            >
              <Image
                src={image!}
                alt={title!}
                fill
                priority={false}
                placeholder="empty"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="cursor-pointer object-cover -z-50 group-hover:blur-sm transition-all duration-200"
              />
            </Link>
            <div className="flex flex-col gap-6 p-6 bg-primary-foreground border-t">
              <div className="flex justify-between gap-6 w-3/4 overflow-visible">
                <Link
                  href={`/${user!.username}/${slug}`}
                  className="text-2xl text-balance cursor-pointer tracking-tight hover:animate-pulse underline-hover"
                >
                  <span className="line-clamp-2">{title}</span>
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <Author
                  image={user!.image}
                  name={user!.name!}
                  username={user!.username!}
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
