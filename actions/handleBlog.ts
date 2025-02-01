"use server";

import { prisma } from "@/lib/db";
import { deleteCover, uploadCover } from "@/lib/handleCover";
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
    include: { author: { select: { id: true, slug: true } } },
  });

  if (blogCover) {
    await uploadCover(blogCover, newBlog.id);

    redirect(`/${newBlog.author.slug}/${newBlog.slug}`);
  }

  return "Error uploading cover";
};

export const editBlog = async (formData: FormData): Promise<string | void> => {
  const user_id = (await cookies()).get("metapress")?.value;

  if (!user_id) {
    return "User not authenticated. Please login again!";
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File | null;

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: {
      authorId: true,
      slug: true,
      category: true,
      author: { select: { slug: true } },
    },
  });

  if (!blog) {
    return "Blog not found";
  }

  if (blog.authorId !== user_id) {
    return "Unauthorized to edit this blog";
  }

  const newSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  const existingBlog = await prisma.blog.findFirst({
    where: {
      slug: newSlug,
      id: { not: id },
    },
  });

  if (existingBlog) {
    return "Title already taken, please choose a different title!";
  }

  if (image) {
    try {
      await uploadCover(image, id);
    } catch (error) {
      console.log(error);

      return "Error uploading image";
    }
  }

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug: newSlug,
      content,
      category,
    },
  });

  if (blog.slug !== newSlug) {
    redirect(`/${blog.author.slug}/${newSlug}`);
  }
};

export const deleteBlog = async (id: string): Promise<string | void> => {
  const user_id = (await cookies()).get("metapress")?.value;

  if (!user_id) {
    return "User not authenticated. Please login again!";
  }

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!blog) {
    return "Blog not found";
  }

  if (blog.authorId !== user_id) {
    return "Unauthorized to delete this blog";
  }

  await prisma.blog.delete({
    where: { id, authorId: user_id },
  });

  deleteCover(id);

  redirect("/");
};
