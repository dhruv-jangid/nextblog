import "server-only";
import { z } from "zod";
import { idSchema } from "../common/common.schema";
import { commentContentSchema } from "@/shared/common/common.schema";

export const createCommentSchema = z.object({
  blogId: idSchema,
  content: commentContentSchema,
});

export const deleteCommentSchema = z.object({
  commentId: idSchema,
  blogId: idSchema,
});
