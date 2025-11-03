import "server-only";
import { db } from "@/db";
import { blogImages, blogs, likes } from "@/db/schema";
import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";

export class BlogRepository {
  static find = async (blogId: string) => {
    const [row = null] = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        cover: blogs.cover,
        category: blogs.category,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        author: {
          name: blogs.authorName,
          username: blogs.authorUsername,
          image: blogs.authorImage,
        },
      })
      .from(blogs)
      .where(eq(blogs.id, blogId))
      .limit(1);

    return row;
  };

  static findMany = async (blogIds: string[]) => {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        cover: blogs.cover,
        category: blogs.category,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        author: {
          name: blogs.authorName,
          username: blogs.authorUsername,
          image: blogs.authorImage,
        },
      })
      .from(blogs)
      .where(inArray(blogs.id, blogIds));

    return rows;
  };

  static findManyByUserId = async (
    userId: string,
    pageSize: number,
    cursor?: string
  ) => {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        cover: blogs.cover,
        category: blogs.category,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        author: {
          name: blogs.authorName,
          username: blogs.authorUsername,
          image: blogs.authorImage,
        },
      })
      .from(blogs)
      .where(
        cursor
          ? and(eq(blogs.userId, userId), lt(blogs.createdAt, cursor))
          : eq(blogs.userId, userId)
      )
      .orderBy(desc(blogs.createdAt))
      .limit(pageSize);

    const nextCursor =
      rows.length === pageSize ? rows[rows.length - 1].createdAt : null;

    return { blogs: rows, nextCursor };
  };

  static findManyLikedByUserId = async (
    userId: string,
    pageSize = 10,
    cursor?: string
  ) => {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        cover: blogs.cover,
        category: blogs.category,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        author: {
          name: blogs.authorName,
          username: blogs.authorUsername,
          image: blogs.authorImage,
        },
        likedAt: likes.createdAt,
      })
      .from(blogs)
      .innerJoin(likes, eq(likes.blogId, blogs.id))
      .where(
        cursor
          ? and(eq(likes.userId, userId), lt(likes.createdAt, cursor))
          : eq(likes.userId, userId)
      )
      .orderBy(desc(likes.createdAt))
      .limit(pageSize);

    const nextCursor =
      rows.length === pageSize ? rows[rows.length - 1].likedAt : null;

    return { blogs: rows, nextCursor };
  };

  static findManyRandom = async (limit: number) => {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        cover: blogs.cover,
        category: blogs.category,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        author: {
          name: blogs.authorName,
          username: blogs.authorUsername,
          image: blogs.authorImage,
        },
      })
      .from(blogs)
      .where(gte(blogs.createdAt, sql`NOW() - INTERVAL '2 YEARS'`))
      .orderBy(sql`RANDOM()`)
      .limit(limit);

    return rows;
  };

  static create = async (data: CreateBlog) => {
    const row = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(blogs)
        .values({
          title: data.title,
          content: data.content,
          category: data.category,
          cover: data.cover,
          userId: data.userId,
          authorName: data.authorName,
          authorUsername: data.authorUsername,
          authorImage: data.authorImage,
        })
        .returning();

      const imagesToInsert = data.images.map(({ url, publicId }, index) => ({
        blogId: row.id,
        url,
        publicId,
        order: index,
      }));
      await tx.insert(blogImages).values(imagesToInsert);

      return {
        id: row.id,
        title: row.title,
        content: row.content,
        cover: row.cover,
        category: row.category,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        author: {
          name: row.authorName,
          username: row.authorUsername,
          image: row.authorImage,
        },
      };
    });

    return row;
  };

  static update = async (data: UpdateBlog) => {
    const row = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(blogs)
        .set({
          title: data.title,
          content: data.content,
          category: data.category,
          cover: data.cover,
        })
        .where(
          data.role === "admin"
            ? eq(blogs.id, data.blogId)
            : and(eq(blogs.id, data.blogId), eq(blogs.userId, data.userId))
        )
        .returning();

      if (data.imagesToDelete.length > 0) {
        await tx
          .delete(blogImages)
          .where(
            and(
              eq(blogImages.blogId, data.blogId),
              inArray(blogImages.publicId, data.imagesToDelete)
            )
          );
      }

      const existingImages = await tx
        .select({
          publicId: blogImages.publicId,
          order: blogImages.order,
        })
        .from(blogImages)
        .where(eq(blogImages.blogId, data.blogId));

      const existingPublicIds = new Set(
        existingImages.map((img) => img.publicId)
      );
      const maxExistingOrder =
        existingImages.length > 0
          ? Math.max(...existingImages.map((img) => img.order))
          : -1;

      const newImages = data.images.filter(
        (img) => !existingPublicIds.has(img.publicId)
      );

      if (newImages.length > 0) {
        await tx.insert(blogImages).values(
          newImages.map(({ url, publicId }, index) => ({
            blogId: data.blogId,
            url,
            publicId,
            order: maxExistingOrder + index + 1,
          }))
        );
      }

      return {
        id: row.id,
        title: row.title,
        content: row.content,
        cover: row.cover,
        category: row.category,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        author: {
          name: row.authorName,
          username: row.authorUsername,
          image: row.authorImage,
        },
      };
    });

    return row;
  };

  static delete = async (data: DeleteBlog) => {
    const imagesToDelete = await db.transaction(async (tx) => {
      const rows = await tx
        .select({ publicId: blogImages.publicId })
        .from(blogImages)
        .where(eq(blogImages.blogId, data.blogId));

      await tx
        .delete(blogs)
        .where(
          data.role === "admin"
            ? eq(blogs.id, data.blogId)
            : and(eq(blogs.id, data.blogId), eq(blogs.userId, data.userId))
        );

      return rows.map((image: { publicId: string }) => image.publicId);
    });

    return imagesToDelete;
  };
}
