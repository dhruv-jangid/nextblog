import { BlogGrid } from "@/components/bloggrid";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

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
      image: true,
      category: true,
      createdAt: true,
      likes: { select: { blogId: true, userId: true } },
      author: { select: { name: true, slug: true, id: true, image: true } },
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

  if (blogs.length < 1) {
    notFound();
  }
  return (
    <div className="min-h-[80dvh] mt-2">
      <BlogGrid blogs={blogs} />
    </div>
  );
}
