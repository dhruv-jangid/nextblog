import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Blogs({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      createdAt: true,
      likes: { select: { blogId: true, userId: true } },
      author: { select: { name: true, slug: true, id: true } },
    },
    where: { category: category },
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
