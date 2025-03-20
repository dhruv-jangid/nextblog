import { Button } from "@/components/button";
import { Author } from "@/components/author";
import Link from "next/link";
import Image from "next/image";
import { Like } from "@/components/like";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const BlogGrid = async ({
  blogs,
}: {
  blogs: {
    title: string;
    slug: string;
    image: string;
    category: string;
    createdAt: Date;
    likes: {
      blogId: string;
      userId: string;
    }[];
    author: {
      id: string;
      slug: string;
      image: string | null;
      name: string;
    };
  }[];
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user.id;

  return (
    <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-10">
      {blogs.map(
        ({ title, image, createdAt, category, slug, author, likes }) => {
          const isLiked = userId
            ? likes.find((like) => userId === like.userId) !== undefined
            : false;

          return (
            <div
              key={slug}
              className="rounded-4xl flex flex-col bg-neutral-900 hover:-translate-y-1 hover:translate-x-1 transition-transform ease-out duration-500 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-rose-300"
            >
              <Link
                href={`/${author.slug}/${slug}`}
                className="rounded-t-4xl overflow-hidden"
              >
                <Image
                  src={image}
                  alt={title}
                  width={250}
                  height={150}
                  priority={false}
                  placeholder="empty"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="cursor-pointer w-full h-full hover:animate-pulse"
                />
              </Link>
              <div className="flex flex-col gap-6 p-6 justify-between h-1/2 rounded-t-3xl">
                <div className="flex justify-between gap-6 cursor-pointer text-xl font-medium line-clamp-3 w-full">
                  <Link
                    href={`/${author.slug}/${slug}`}
                    className="line-clamp-2 text-balance tracking-tight hover:animate-pulse transition-all duration-300"
                  >
                    {title}
                  </Link>
                  <Link
                    href={`/blogs/${category}`}
                    className="text-sm xl:text-base w-max"
                  >
                    <Button>{category}</Button>
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <Author
                    image={author.image}
                    name={author.name}
                    slug={author.slug}
                    date={createdAt}
                  />
                  <Like
                    blogSlug={slug}
                    likes={likes.length}
                    isLiked={isLiked}
                  />
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
