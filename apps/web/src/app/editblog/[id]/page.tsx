import "server-only";
import { z } from "zod";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { EditBlogClient } from "./client";
import { notFound } from "next/navigation";
import { eq, and, sql } from "drizzle-orm";
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
  try {
    z.uuid().parse(id);
  } catch {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const { id: userId, username, role } = session.user;

  if (role !== "admin") {
    const [authorizedUser] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.id, id), eq(blogs.userId, userId)));
    if (!authorizedUser) {
      notFound();
    }
  }

  const [blog] = await db
    .select({
      id: blogs.id,
      slug: blogs.slug,
      title: blogs.title,
      content: blogs.content,
      category: blogs.category,
      createdAt: blogs.createdAt,
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

  return <EditBlogClient oldBlog={blog} username={username!} />;
}
