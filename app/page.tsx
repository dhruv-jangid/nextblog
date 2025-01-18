import { Carousel } from "@/components/carousel";
import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Home() {
  const blogs = await prisma.blog.findMany({
    include: { author: { select: { name: true, slug: true } } },
  });

  return (
    <>
      <Carousel blog={blogs[0]} />
      <BlogGrid blogs={blogs} />
    </>
  );
}
