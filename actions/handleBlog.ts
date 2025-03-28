"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteImage, uploadImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import { permanentRedirect, redirect, RedirectType } from "next/navigation";
import { checkProfanity } from "@/utils/checkProfanity";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const createBlog = async (
  prevState: any,
  formData: FormData
): Promise<string | void> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return "User not authenticated. Please login again!";
  }

  const { id } = session.user;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const blogCover = formData.get("image") as File;

  if (checkProfanity(title) || checkProfanity(content)) {
    return "Inappropriate language used!";
  }

  const existingBlog = await prisma.blog.findUnique({
    where: {
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, ""),
    },
  });
  if (existingBlog) {
    return "Title already taken, please choose a different title!";
  }

  const imageUpload = await uploadImage(blogCover);

  if (!imageUpload.success) {
    return imageUpload.result;
  }

  const newBlog = await prisma.blog.create({
    data: {
      title,
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, ""),
      image: imageUpload.result,
      content: content
        .replace(/<p><br><\/p>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      category,
      author: { connect: { id } },
    },
    include: { author: { select: { id: true, slug: true } } },
  });

  redirect(`/${newBlog.author.slug}/${newBlog.slug}`);
};

export const editBlog = async (
  slug: string,
  title: string,
  content: string,
  category: string,
  newImage: File | null
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return "User not authenticated. Please login again!";
  }

  const { id } = session.user;

  if (checkProfanity(title) || checkProfanity(content)) {
    return "Inappropriate language used!";
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: {
      authorId: true,
      author: { select: { slug: true } },
      image: true,
    },
  });
  if (!blog) {
    return "Blog not found";
  }

  if (blog.authorId === id || session.user.role === "ADMIN") {
    const newSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    const existingBlog = await prisma.blog.findFirst({
      where: {
        slug: newSlug,
        NOT: { slug },
      },
    });
    if (existingBlog) {
      return "Title already taken, please choose a different title!";
    }

    let imageUpload;
    if (newImage && newImage.size > 0) {
      imageUpload = await uploadImage(newImage);
      if (!imageUpload.success) {
        return imageUpload.result;
      }
      const publicId = getPublicIdFromUrl(blog.image);
      if (publicId) {
        const result = await deleteImage(publicId);
        if (!result.success) {
          return result.message;
        }
      }
    }

    await prisma.blog.update({
      where: { slug },
      data: {
        title,
        slug: newSlug,
        content,
        category,
        ...(imageUpload?.success && { image: imageUpload?.result }),
      },
    });

    if (newSlug !== slug) {
      redirect(`/${blog.author.slug}/${newSlug}`, RedirectType.replace);
    }

    return revalidatePath(`/${blog.author.slug}/${newSlug}`);
  }

  return "Unauthorized to edit this blog";
};

export const deleteBlog = async (blogSlug: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  const blog = await prisma.blog.findUnique({
    where: { slug: blogSlug },
    select: { image: true, authorId: true },
  });
  if (!blog) {
    return "Blog not found";
  }

  if (blog.authorId === id || session.user.role === "ADMIN") {
    await prisma.$transaction(async (tx: any) => {
      if (blog.image) {
        const publicId = getPublicIdFromUrl(blog.image);
        if (publicId) {
          await deleteImage(publicId);
        }
      }

      await tx.blog.delete({
        where: { slug: blogSlug },
      });
    });

    redirect("/", RedirectType.replace);
  }

  return "Unauthorized to delete this blog";
};

export const likeBlog = async (blogSlug: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  await prisma.$transaction(async (tx: any) => {
    const blog = await tx.blog.findUnique({
      where: { slug: blogSlug },
      select: { id: true },
    });
    if (!blog) {
      throw new Error("Blog not found");
    }

    const existingLike = await tx.like.findUnique({
      where: {
        userId_blogId: {
          userId: id,
          blogId: blog.id,
        },
      },
    });

    if (existingLike) {
      await tx.like.delete({
        where: {
          userId_blogId: {
            userId: id,
            blogId: blog.id,
          },
        },
      });

      return "Blog unliked";
    }

    await tx.like.create({
      data: {
        userId: id,
        blogId: blog.id,
      },
    });

    return "Blog liked";
  });

  return;
};

export const addComment = async (comment: string, blogSlug: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  const { id } = session.user;

  if (checkProfanity(comment)) {
    return "Inappropriate language used!";
  }

  if (!comment.trim()) return "Comment content cannot be empty";

  const blog = await prisma.blog.findUnique({
    where: { slug: blogSlug },
    select: { id: true, author: { select: { slug: true } } },
  });
  if (!blog) {
    return "Blog not found";
  }

  const addedComment = await prisma.comment.create({
    data: {
      content: comment,
      blog: { connect: { id: blog.id } },
      author: { connect: { id } },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
          slug: true,
        },
      },
    },
  });

  return addedComment;
};

export const deleteComment = async (commentId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    permanentRedirect("/signin");
  }

  if (!commentId) return "Comment is required!";

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return;
};
