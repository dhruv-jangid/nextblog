import "server-only";
import { db } from "@/db";
import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import { EditBlogClient } from "./client";
import { notFound } from "next/navigation";
import { blogImages, blogs } from "@/db/schema";

export const metadata: Metadata = {
  title: "MetaPress | Edit Blog",
  description: "Edit blog on MetaPress",
};

export default async function EditBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [blog] = await db
    .select({
      id: blogs.id,
      slug: blogs.slug,
      title: blogs.title,
      content: blogs.content,
      category: blogs.category,
      images: sql<Array<{ url: string; publicId: string }>>`
      array_agg(
        json_build_object(
          'url', ${blogImages.url},
          'publicId', ${blogImages.publicId}
        )
      )
    `,
    })
    .from(blogs)
    .innerJoin(blogImages, eq(blogImages.blogId, id))
    .where(eq(blogs.id, id))
    .groupBy(blogs.id, blogs.title, blogs.content, blogs.category);

  if (!blog) {
    notFound();
  }

  return (
    <EditBlogClient
      blogId={blog.id}
      blogSlug={blog.slug}
      oldTitle={blog.title}
      oldContent={blog.content}
      oldCategory={blog.category}
      oldImages={blog.images}
    />
  );
}
