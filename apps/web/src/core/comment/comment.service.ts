import "server-only";
import {
  commentCK,
  blogCommentsCK,
  blogCommentsMetaCK,
} from "../cache/cache.keys";
import { decodeId } from "@/lib/hashids";
import { CacheService } from "../cache/cache.service";
import { CommentRepository } from "./comment.repository";
import { COMMENT_TTL, COMMENTS_TTL } from "../cache/cache.ttl";
import { createCommentSchema, deleteCommentSchema } from "./comment.schema";

const PAGE_SIZE = 10;

export class CommentService {
  constructor(private readonly user: UserSession) {}

  async findByBlogId(id: string, pageSize = PAGE_SIZE, cursor?: string) {
    const blogId = decodeId(id);
    if (!blogId) {
      throw new Error("Invalid BlogId");
    }

    const commentsKey = blogCommentsCK(blogId);
    const commentsMetaKey = blogCommentsMetaCK(blogId);
    try {
      const maxScore = cursor ? new Date(cursor).getTime() : +Infinity;

      const pipeline = CacheService.pipeline();
      pipeline.get(commentsMetaKey);
      pipeline.zRange(commentsKey, maxScore, -Infinity, {
        BY: "SCORE",
        REV: true,
        LIMIT: { offset: 0, count: pageSize },
      });

      const [meta, commentIds] =
        (await pipeline.execAsPipeline()) as unknown as [
          string | null,
          string[]
        ];

      if (meta === "empty") {
        return { comments: [], nextCursor: null };
      }

      if (commentIds.length > 0) {
        const pipeline = CacheService.pipeline();
        commentIds.forEach((commentId) => {
          const commentKey = commentCK(commentId);
          pipeline.hGetAll(commentKey);
        });

        const comments = (
          (await pipeline.execAsPipeline()) as unknown as BlogComment[]
        )
          .map((r) => ({ ...r }))
          .filter((c) => Object.keys(c).length > 0);

        if (comments.length === commentIds.length) {
          const nextCursor =
            comments.length === pageSize
              ? comments[comments.length - 1].createdAt
              : null;

          CacheService.set(commentsMetaKey, "ok", COMMENTS_TTL);

          return { comments, nextCursor };
        }
      }
    } catch {}

    const { comments, nextCursor } = await CommentRepository.findManyByBlogId(
      blogId,
      pageSize,
      cursor
    );

    try {
      const pipeline = CacheService.pipeline();
      if (comments.length > 0) {
        comments.forEach((comment) => {
          const flat: string[] = [];
          for (const [field, value] of Object.entries(comment)) {
            flat.push(field, String(value));
          }

          const commentKey = commentCK(comment.id);
          pipeline.hSet(commentKey, flat);
          pipeline.expire(commentKey, COMMENT_TTL);
        });

        const members = comments.map((comment) => ({
          score: new Date(comment.createdAt).getTime(),
          value: comment.id,
        }));

        pipeline.set(commentsMetaKey, "ok", {
          expiration: { type: "EX", value: COMMENTS_TTL },
        });
        pipeline.zAdd(commentsKey, members);
      } else {
        pipeline.set(commentsMetaKey, "empty", {
          expiration: { type: "EX", value: COMMENTS_TTL },
        });
      }

      pipeline.expire(commentsKey, COMMENTS_TTL);
      pipeline.execAsPipeline();
    } catch {}

    return { comments, nextCursor };
  }

  async create(data: CreateCommentInput) {
    createCommentSchema.parse(data);

    const blogId = decodeId(data.blogId);
    if (!blogId) {
      throw new Error("Invalid BlogId");
    }

    const comment = await CommentRepository.create({
      blogId,
      content: data.content,
      userId: this.user.id,
      authorName: this.user.name,
      authorUsername: this.user.username,
      authorImage: this.user.image ?? undefined,
    });

    try {
      const flat: string[] = [];
      for (const [field, value] of Object.entries(comment)) {
        flat.push(field, String(value));
      }

      const commentKey = commentCK(comment.id);
      const commentsKey = blogCommentsCK(blogId);
      const commentsMetaKey = blogCommentsMetaCK(blogId);

      const transaction = CacheService.pipeline();
      transaction.set(commentsMetaKey, "ok", {
        expiration: { type: "EX", value: COMMENTS_TTL },
      });
      transaction.hSet(commentKey, flat);
      transaction.expire(commentKey, COMMENT_TTL);
      transaction.zAdd(commentsKey, {
        score: new Date(comment.createdAt).getTime(),
        value: comment.id,
      });
      transaction.expire(commentsKey, COMMENTS_TTL);

      await transaction.exec();
    } catch {}

    return comment;
  }

  async delete(data: DeleteCommentInput) {
    deleteCommentSchema.parse(data);

    const blogId = decodeId(data.blogId);
    if (!blogId) {
      throw new Error("Invalid BlogId");
    }

    await CommentRepository.delete({
      commentId: data.commentId,
      blogId,
      role: this.user.role,
      userId: this.user.id,
    });

    try {
      const commentKey = commentCK(data.commentId);
      const commentsKey = blogCommentsCK(blogId);

      const transaction = CacheService.pipeline();
      transaction.del(commentKey);
      transaction.zRem(commentsKey, data.commentId);

      await transaction.exec();
    } catch {}
  }
}
