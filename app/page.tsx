import { Carousel } from "@/components/carousel";
import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Home() {
  const blogs = await prisma.blog.findMany({
    include: { author: { select: { name: true, slug: true } } },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
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
        <div className="flex justify-center items-center min-h-[70vh] text-4xl text-black bg-[#EEEEEE] rounded-lg w-3/4 mx-auto">
          Sorry, no blogs available at this time!
        </div>
      )}
    </>
  );
}
