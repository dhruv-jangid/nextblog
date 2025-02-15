"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  deleteImage,
  uploadImage,
  getPublicIdFromUrl,
} from "@/utils/cloudinaryUtils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createBlog = async (
  prevState,
  formData
): Promise<string | void> => {
  const session = await auth();
  const user_id = session?.user.id;

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

  const cleanedContent = content
    .replace(/<p><br><\/p>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const image = await uploadImage(blogCover);

  if (image) {
    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        image,
        content: cleanedContent,
        category,
        author: { connect: { id: user_id } },
      },
      include: { author: { select: { id: true, slug: true } } },
    });

    redirect(`/${newBlog.author.slug}/${newBlog.slug}`);
  }

  return "Error uploading cover";
};

export const editBlog = async (prevState, formData: FormData) => {
  const session = await auth();
  const user_id = session?.user.id;

  if (!user_id) {
    return "User not authenticated. Please login again!";
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const newImage = formData.get("image") as File | null;

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: {
      authorId: true,
      slug: true,
      author: { select: { slug: true } },
      image: true,
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

  let imageUrl;
  if (newImage && newImage.size > 0) {
    if (blog.image) {
      const publicId = getPublicIdFromUrl(blog.image);
      await deleteImage(publicId!);
    }
    imageUrl = await uploadImage(newImage);
  }

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug: newSlug,
      content,
      category,
      ...(imageUrl && { image: imageUrl }),
    },
  });

  redirect(`/${blog.author.slug}/${newSlug}`);
};

export const deleteBlog = async (prevState, formData: FormData) => {
  const session = await auth();
  const user_id = session?.user.id;

  if (!user_id) {
    return "User not authenticated. Please login again!";
  }

  const id = formData.get("id") as string;

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { image: true, authorId: true },
  });

  if (!blog) {
    return "Blog not found";
  }

  if (blog.authorId !== user_id) {
    return "Unauthorized to delete this blog";
  }

  await prisma.$transaction(async (tx) => {
    if (blog.image) {
      const publicId = getPublicIdFromUrl(blog.image);
      if (publicId) {
        await deleteImage(publicId);
      }
    }

    await tx.blog.delete({
      where: { id, authorId: user_id },
    });
  });

  redirect("/");
};

export const likeBlog = async (prevState, formData: FormData) => {
  const session = await auth();
  const user_id = session?.user.id;

  if (!user_id) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const path = formData.get("path") as string;

  await prisma.$transaction(async (tx) => {
    const blog = await tx.blog.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    const existingLike = await tx.like.findUnique({
      where: {
        userId_blogId: {
          userId: user_id,
          blogId: id,
        },
      },
    });

    if (existingLike) {
      await tx.like.delete({
        where: {
          userId_blogId: {
            userId: user_id,
            blogId: id,
          },
        },
      });
      return "Blog unliked";
    }

    await tx.like.create({
      data: {
        userId: user_id,
        blogId: id,
      },
    });
    return "Blog liked";
  });

  revalidatePath(path);
};

export const addComment = async (prevState, formData: FormData) => {
  const session = await auth();
  const user_id = session?.user.id;

  if (!user_id) {
    return "User not authenticated. Please login again!";
  }

  const blogId = formData.get("blogId") as string;
  const content = formData.get("content") as string;
  const path = formData.get("path") as string;

  if (!content.trim()) {
    return "Comment content cannot be empty";
  }

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { author: { select: { slug: true } }, slug: true },
  });

  if (!blog) {
    return "Blog not found";
  }

  await prisma.comment.create({
    data: {
      content,
      blog: { connect: { id: blogId } },
      author: { connect: { id: user_id } },
    },
  });

  revalidatePath(path);
};
