"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteImage, uploadImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkProfanity } from "@/utils/checkProfanity";

export const createBlog = async (
  prevState: any,
  formData: FormData
): Promise<string | void> => {
  const session = await auth();
  if (!session) {
    return "User not authenticated. Please login again!";
  }
  const user_id = session.user.id;

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const blogCover = formData.get("image") as File;

  if (checkProfanity(title) || checkProfanity(content)) {
    return "Inappropriate language used!";
  }

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

  const imageUpload = await uploadImage(blogCover);

  if (!imageUpload.success) {
    return imageUpload.result;
  }

  const newBlog = await prisma.blog.create({
    data: {
      title,
      slug,
      image: imageUpload.result,
      content: cleanedContent,
      category,
      author: { connect: { id: user_id } },
    },
    include: { author: { select: { id: true, slug: true } } },
  });

  redirect(`/${newBlog.author.slug}/${newBlog.slug}${"#"}`);
};

export const editBlog = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session) {
    return "User not authenticated. Please login again!";
  }
  const user_id = session.user.id;

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const newImage = formData.get("image") as File | null;

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

  if (blog.authorId === user_id || session.user.role === "ADMIN") {
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
        ...(imageUpload!.success && { image: imageUpload!.result }),
      },
    });

    redirect(`/${blog.author.slug}/${newSlug}`);
  } else {
    return "Unauthorized to edit this blog";
  }
};

export const deleteBlog = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session) {
    return "User not authenticated. Please login again!";
  }
  const user_id = session.user.id;

  const slug = formData.get("slug") as string;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { image: true, authorId: true },
  });
  if (!blog) {
    return "Blog not found";
  }

  if (blog.authorId === user_id || session.user.role === "ADMIN") {
    await prisma.$transaction(async (tx) => {
      if (blog.image) {
        const publicId = getPublicIdFromUrl(blog.image);
        if (publicId) {
          await deleteImage(publicId);
        }
      }

      await tx.blog.delete({
        where: { slug },
      });
    });

    redirect("/");
  } else {
    return "Unauthorized to delete this blog";
  }
};

export const likeBlog = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const user_id = session.user.id;

  const slug = formData.get("slug") as string;
  const path = formData.get("path") as string;

  await prisma.$transaction(async (tx) => {
    const blog = await tx.blog.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!blog) {
      throw new Error("Blog not found");
    }

    const existingLike = await tx.like.findUnique({
      where: {
        userId_blogId: {
          userId: user_id,
          blogId: blog.id,
        },
      },
    });

    if (existingLike) {
      await tx.like.delete({
        where: {
          userId_blogId: {
            userId: user_id,
            blogId: blog.id,
          },
        },
      });

      return "Blog unliked";
    }

    await tx.like.create({
      data: {
        userId: user_id,
        blogId: blog.id,
      },
    });

    return "Blog liked";
  });

  revalidatePath(path);
  return null;
};

export const addComment = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session) {
    return "User not authenticated. Please login again!";
  }
  const user_id = session.user.id;

  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const path = formData.get("path") as string;

  if (checkProfanity(content)) {
    return "Inappropriate language used!";
  }

  if (!content.trim()) {
    return "Comment content cannot be empty";
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, author: { select: { slug: true } } },
  });
  if (!blog) {
    return "Blog not found";
  }

  await prisma.comment.create({
    data: {
      content,
      blog: { connect: { id: blog.id } },
      author: { connect: { id: user_id } },
    },
  });

  revalidatePath(path);
  return null;
};

export async function deleteComment(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session) {
    return "User not authenticated. Please login again!";
  }

  const commentId = formData.get("commentId") as string;
  const path = formData.get("path") as string;

  if (!commentId) return "Comment is required!";

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  revalidatePath(path);
  return null;
}
