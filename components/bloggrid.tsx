import { Button } from "@/components/button";
import { Author } from "@/components/author";
import Link from "next/link";
import Image from "next/image";
import { Like } from "@/components/like";
import { auth } from "@/lib/auth";
import { Blog } from "@/types";

export const BlogGrid = async ({ blogs }: { blogs: Blog[] }) => {
  const session = await auth();
  const userId = session?.user.id;

  return (
    <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 px-4 lg:px-8">
      {blogs.map(
        ({ title, image, createdAt, category, slug, author, likes }) => {
          const isLiked = userId
            ? likes.find((like) => userId === like.userId) !== undefined
            : false;

          return (
            <div
              key={slug}
              className="rounded-3xl p-6 border border-gray-600 flex flex-col h-[25rem] lg:h-[28rem] justify-between bg-linear-to-br from-[#191919] from-40% to-transparent"
            >
              <div className="relative h-1/2 rounded-xl overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill={true}
                  priority={false}
                  placeholder="empty"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="cursor-pointer object-cover"
                />
              </div>
              <Link
                href={`/blogs/${category}`}
                className="text-sm xl:text-base w-max"
              >
                <Button>{category}</Button>
              </Link>
              <h3 className="cursor-pointer text-xl font-medium line-clamp-3 w-10/12">
                <Link
                  href={`/${author.slug}/${slug}`}
                  className="line-clamp-2 lg:line-clamp-3 hover:text-[#EEEEEE]/80 transition-all duration-300"
                >
                  {title}
                </Link>
              </h3>
              <div className="flex justify-between items-center">
                <Like blogSlug={slug} likes={likes.length} isLiked={isLiked} />
                <Author
                  image={author.image}
                  name={author.name}
                  slug={author.slug}
                  date={createdAt.toISOString()}
                  end
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
