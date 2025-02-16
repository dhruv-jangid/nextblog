import { Carousel } from "@/components/carousel";
import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Home() {
  const blogs = await prisma.blog.findMany({
    select: {
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
    take: 4,
    cacheStrategy: {
      ttl: 60,
      swr: 60,
      tags: ["blogs"],
    },
  });
  const [firstBlog, ...remainingBlogs] = blogs;

  return (
    <>
      {blogs.length > 0 ? (
        <>
          <Carousel blog={firstBlog} />
          <BlogGrid blogs={remainingBlogs} />
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[80vh] text-4xl rounded-lg w-3/4 mx-auto">
          Sorry, no blogs available at this time!
        </div>
      )}
    </>
  );
}
