import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      image: true,
      category: true,
      createdAt: true,
      likes: { select: { blogId: true, userId: true } },
      author: { select: { name: true, slug: true, id: true, image: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    cacheStrategy: {
      ttl: 60,
      swr: 60,
      tags: ["blogs"],
    },
  });

  return (
    <>
      {blogs.length > 0 ? (
        <div className="px-4 xl:px-8 mt-2">
          <BlogGrid blogs={blogs} />
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[80vh] text-4xl rounded-lg w-3/4 mx-auto">
          Sorry, no blogs available at this time!
        </div>
      )}
    </>
  );
}
