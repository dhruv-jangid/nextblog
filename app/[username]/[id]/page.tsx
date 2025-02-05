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
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      content: true,
      category: true,
      likes: {
        select: {
          userId: true,
        },
      },

      author: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    where: { slug: id, author: { slug: username } },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const cookieStore = await cookies();
  const userId = JSON.parse(cookieStore.get("metapress")?.value).id;

  const isAuthor = userId === blog.author.id;

  const isLiked = blog.likes.find((like) => userId === like.userId);

  return <BlogPage blog={blog} isAuthor={isAuthor} isLiked={isLiked} />;
}
