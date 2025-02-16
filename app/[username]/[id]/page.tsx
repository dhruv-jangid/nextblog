import { prisma } from "@/lib/db";
import BlogPage from "@/components/blogpage";
import { auth } from "@/lib/auth";
import { permanentRedirect } from "next/navigation";

export default async function Blog({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username, id } = await params;

  const blog = await prisma.blog.findUnique({
    select: {
      title: true,
      slug: true,
      image: true,
      createdAt: true,
      content: true,
      category: true,
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          author: { select: { name: true, image: true, slug: true } },
          content: true,
          createdAt: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
      },
    },
    where: { slug: id, author: { slug: username } },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
      tags: ["blogs"],
    },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const session = await auth();
  if (!session) {
    permanentRedirect("/");
  }
  const userId = session ? session.user.id : null;
  const isAuthor = userId === blog.author.id;
  const isLiked = blog.likes.some((like) => like.userId === userId);
  const userSlug = session.user.slug;

  return (
    <BlogPage
      blog={blog}
      isAuthor={isAuthor}
      isLiked={isLiked}
      userSlug={userSlug}
    />
  );
}
