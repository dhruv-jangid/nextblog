"use server";

import "server-only";
import { db } from "@/db";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import type { JSONContent } from "@tiptap/react";
import { deleteImages } from "@/actions/handleCloudinary";
import { blogs, likes, comments, blogImages } from "@/db/schema";
import { blogValidator, editBlogValidator } from "@/lib/schemas/server";
import { commentValidator, getFirstZodError } from "@/lib/schemas/shared";
import { permanentRedirect, redirect, RedirectType } from "next/navigation";

export const createBlog = async ({
  title,
  content,
  category,
  image,
  images,
}: {
  title: string;
  content: JSONContent;
  category: string;
  image: string;
  images: { url: string; publicId: string }[];
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id: userId, username } = session.user;
  let slug: string | undefined;
  try {
    const newBlog = blogValidator.parse({
      title: title,
      content: content,
      category: category,
      image: image,
      images: images,
    });
    slug = newBlog.slug;

    await db.transaction(async (tx) => {
      const [{ id: blogId }] = await tx
        .insert(blogs)
        .values({ ...newBlog, userId })
        .returning();

      await tx.insert(blogImages).values(
        images.map(({ url, publicId }, index) => ({
          blogId,
          url,
          publicId,
          order: index,
        }))
      );
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect(`/${username}/${slug}`, RedirectType.replace);
};

export const editBlog = async ({
  blogId,
  blogSlug,
  title,
  content,
  category,
  image,
  images,
  imagesToDelete,
}: {
  blogId: string;
  blogSlug: string;
  title: string;
  content: JSONContent;
  category: string;
  image: string;
  images: { url: string; publicId: string }[];
  imagesToDelete: string[];
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const { id, role, username } = session.user;
  let newBlogSlug: string | undefined;

  try {
    const { slug } = editBlogValidator.parse({
      title: title,
      content: content,
      category: category,
      image: image,
      images: images,
    });
    newBlogSlug = slug;

    await db.transaction(async (tx) => {
      await tx
        .update(blogs)
        .set({
          title,
          slug,
          content,
          category,
          image,
        })
        .where(
          role === "admin"
            ? eq(blogs.id, blogId)
            : and(eq(blogs.id, blogId), eq(blogs.userId, id))
        );

      if (images.length > 0) {
        await tx.insert(blogImages).values(
          images.map(({ url, publicId }, index) => ({
            blogId,
            url,
            publicId,
            order: index,
          }))
        );
      }

      if (imagesToDelete.length > 0) {
        await tx.delete(blogImages).where(eq(blogImages.blogId, blogId));
      }
    });

    if (imagesToDelete.length > 0) {
      await deleteImages(imagesToDelete);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  if (newBlogSlug !== blogSlug) {
    permanentRedirect(`/${username}/${newBlogSlug}`, RedirectType.replace);
  } else {
    redirect(`/${username}/${blogSlug}`, RedirectType.replace);
  }
};

export const deleteBlog = async ({
  blogId,
}: {
  blogId: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id, role } = session.user;
  try {
    const imagesToDelete = await db
      .select({ publicId: blogImages.publicId })
      .from(blogImages)
      .where(eq(blogImages.blogId, blogId));
    const images = imagesToDelete.map((image) => image.publicId);
    await deleteImages(images);

    await db
      .delete(blogs)
      .where(
        role === "admin"
          ? eq(blogs.id, blogId)
          : and(eq(blogs.id, blogId), eq(blogs.userId, id))
      );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect("/", RedirectType.replace);
};

export const likeBlog = async ({
  blogId,
}: {
  blogId: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id } = session.user;
  try {
    const deleted = await db
      .delete(likes)
      .where(and(eq(likes.userId, id), eq(likes.blogId, blogId)))
      .returning();

    if (deleted.length === 0) {
      await db.insert(likes).values({
        userId: id,
        blogId,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const addComment = async ({
  blogId,
  comment,
}: {
  blogId: string;
  comment: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id: userId } = session.user;
  try {
    const content = commentValidator.parse(comment);

    await db.insert(comments).values({
      content,
      userId,
      blogId,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const deleteComment = async ({
  commentId,
}: {
  commentId: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id, role } = session.user;
  try {
    await db
      .delete(comments)
      .where(
        role === "admin"
          ? eq(comments.id, commentId)
          : and(eq(comments.id, commentId), eq(comments.userId, id))
      );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
