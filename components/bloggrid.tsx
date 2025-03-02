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
    <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8">
      {blogs.map(
        ({ title, image, createdAt, category, slug, author, likes }) => {
          const isLiked = userId
            ? likes.find((like) => userId === like.userId) !== undefined
            : false;

          return (
            <div
              key={slug}
              className="rounded-3xl p-6 border border-gray-600 flex flex-col h-[25rem] lg:h-[26rem] justify-between bg-linear-to-br from-[#191919] from-40% to-transparent hover:-translate-y-1 hover:translate-x-1 transition-transform ease-out duration-500 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-[#EEEEEE]"
            >
              <Link
                href={`/${author.slug}/${slug}`}
                className="relative h-1/2 rounded-xl overflow-hidden"
              >
                <Image
                  src={image}
                  alt={title}
                  fill={true}
                  priority={false}
                  placeholder="empty"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="cursor-pointer object-cover"
                />
              </Link>
              <Link
                href={`/blogs/${category}`}
                className="text-sm xl:text-base w-max"
              >
                <Button>{category}</Button>
              </Link>
              <h3 className="cursor-pointer text-xl font-medium line-clamp-3 w-5/6">
                <Link
                  href={`/${author.slug}/${slug}`}
                  className="line-clamp-2 text-balance tracking-tight hover:text-[#EEEEEE]/80 transition-all duration-300"
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
                  date={createdAt}
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
