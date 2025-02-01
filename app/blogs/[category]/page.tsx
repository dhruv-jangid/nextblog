import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";

export default async function Blogs({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const blogs = await prisma.blog.findMany({
    where: { category: category },
    include: { author: { select: { name: true, slug: true } } },
    orderBy: {
      createdAt: "desc",
    },
  });
  return <BlogGrid blogs={blogs} />;
}
