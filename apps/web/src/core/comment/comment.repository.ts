import "server-only";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";

export class CommentRepository {
  static findManyByBlogId = async (
    blogId: string,
    pageSize = 10,
    cursor?: string
  ) => {
    const rows = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        authorName: comments.authorName,
        authorUsername: comments.authorUsername,
        authorImage: comments.authorImage,
      })
      .from(comments)
      .where(
        cursor
          ? and(eq(comments.blogId, blogId), lt(comments.createdAt, cursor))
          : eq(comments.blogId, blogId)
      )
      .orderBy(desc(comments.createdAt))
      .limit(pageSize);

    const nextCursor =
      rows.length === pageSize ? rows[rows.length - 1].createdAt : null;

    return { comments: rows, nextCursor };
  };

  static create = async (data: CreateComment) => {
    const [row] = await db
      .insert(comments)
      .values({
        blogId: data.blogId,
        userId: data.userId,
        content: data.content,
        authorName: data.authorName,
        authorUsername: data.authorUsername,
        authorImage: data.authorImage,
      })
      .returning();

    return {
      id: row.id,
      content: row.content,
      createdAt: row.createdAt,
      authorName: row.authorName,
      authorUsername: row.authorUsername,
      authorImage: row.authorImage,
    };
  };

  static delete = async (data: DeleteComment) => {
    await db
      .delete(comments)
      .where(
        data.role === "admin"
          ? eq(comments.id, data.commentId)
          : and(
              eq(comments.id, data.commentId),
              eq(comments.userId, data.userId)
            )
      );
  };
}
