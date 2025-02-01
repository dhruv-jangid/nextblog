import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import BlogPage from "@/components/blogpage";

export default async function Blog({
  params,
}: {
  params: {
    username: string;
    id: string;
  };
}) {
  const { username, id } = await params;

  const blog = await prisma.blog.findUnique({
    include: { author: { select: { id: true, name: true, slug: true } } },
    where: { slug: id, author: { slug: username } },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const isAuthor = (await cookies()).get("metapress")?.value === blog.author.id;

  return <BlogPage blog={blog} isAuthor={isAuthor} />;
}
