import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany({
    include: { author: { select: { name: true, slug: true } } },
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
  return <BlogGrid blogs={blogs} />;
}
