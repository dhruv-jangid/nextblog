import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany({
    include: { author: { select: { name: true, slug: true } } },
    orderBy: {
      createdAt: "desc",
    },
  });
  return <BlogGrid blogs={blogs} />;
}
