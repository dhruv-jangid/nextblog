"use server";

import { prisma } from "@/lib/db";
import { uploadCover } from "@/lib/uploadCover";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createBlog = async (
  prevState: null,
  formData: {
    title: string;
    blogCover: File;
    content: string;
    category: string;
  }
): Promise<string | void> => {
  const user_id = (await cookies()).get("metapress")?.value;

  if (!user_id) {
    return "User not authenticated. Please login again!";
  }

  const { title, blogCover, content, category } = formData;

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  const existingBlog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (existingBlog) {
    return "Title already taken, please choose a different title!";
  }

  const newBlog = await prisma.blog.create({
    data: {
      title,
      slug,
      content,
      category,
      authorId: user_id,
    },
    include: { author: { select: { slug: true } } },
  });

  if (blogCover) {
    await uploadCover(
      blogCover,
      `${newBlog.id}_${newBlog.category}_${newBlog.author.slug}`
    );

    redirect(`/${newBlog.author.slug}/${newBlog.slug}`);
  }

  return "Error uploading cover";
};
