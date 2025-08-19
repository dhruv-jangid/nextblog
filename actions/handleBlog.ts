"use server";

import "server-only";
import { db } from "@/db";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { getRedisClient } from "@/lib/redis";
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

    let blogId: string | undefined;
    await db.transaction(async (tx: any) => {
      const [{ id }] = await tx
        .insert(blogs)
        .values({ ...newBlog, userId })
        .returning();
      blogId = id;

      await tx.insert(blogImages).values(
        images.map(({ url, publicId }, index) => ({
          blogId: id,
          url,
          publicId,
          order: index,
        }))
      );
    });

    const redis = await getRedisClient();
    await redis.set(`blog:${blogId}:likes`, "0");
    await redis.del(`user:${username}`);
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

  const { id, username, role } = session.user;
  let newSlug = blogSlug;
  try {
    const { slug } = editBlogValidator.parse({
      title: title,
      content: content,
      category: category,
      image: image,
      images: images,
    });
    newSlug = slug;

    await db.transaction(async (tx: any) => {
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

  const redis = await getRedisClient();
  await redis.del("homepage:blogs");
  await redis.del(`blog:${username}:${blogSlug}`);
  if (newSlug !== blogSlug) {
    await redis.del(`user:${username}`);
    permanentRedirect(`/${username}/${newSlug}`, RedirectType.replace);
  } else {
    redirect(`/${username}/${blogSlug}`, RedirectType.replace);
  }
};

export const deleteBlog = async ({
  blogId,
  blogSlug,
}: {
  blogId: string;
  blogSlug: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id, username, role } = session.user;
  let images: string[] = [];
  try {
    await db.transaction(async (tx: any) => {
      const imagesToDelete = await tx
        .select({ publicId: blogImages.publicId })
        .from(blogImages)
        .where(eq(blogImages.blogId, blogId));
      images = imagesToDelete.map(
        (image: { publicId: string }) => image.publicId
      );

      await tx
        .delete(blogs)
        .where(
          role === "admin"
            ? eq(blogs.id, blogId)
            : and(eq(blogs.id, blogId), eq(blogs.userId, id))
        );
    });

    await deleteImages(images);

    const redis = await getRedisClient();
    await redis.del(`blog:${username}:${blogSlug}`);
    await redis.del(`comments:${blogId}`);
    await redis.del(`user:${username}`);
    await redis.del("homepage:blogs");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
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

    const key = `blog:${blogId}:likes`;
    const redis = await getRedisClient();

    if (deleted.length === 0) {
      await db.insert(likes).values({
        userId: id,
        blogId,
      });

      await redis.incr(key);
    } else {
      await redis.decr(key);
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

    const redis = await getRedisClient();
    await redis.del(`comments:${blogId}`);
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
  blogId,
}: {
  commentId: string;
  blogId: string;
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

    const redis = await getRedisClient();
    await redis.del(`comments:${blogId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
