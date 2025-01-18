import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string; id: string };
}): Promise<Metadata> {
  const { username, id } = await params;

  const blog = await prisma.blog.findUnique({
    where: {
      slug: id,
      author: {
        slug: username,
      },
    },
    select: {
      title: true,
      content: true,
    },
  });

  if (!blog) {
    return {
      title: "Blog",
      description: "MetaPress Blog",
    };
  }

  return {
    title: blog.title,
    description: blog.title,
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
