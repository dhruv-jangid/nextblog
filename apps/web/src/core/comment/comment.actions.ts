"use server";

import "server-only";
import { ZodError } from "zod";
import { getFirstZodError } from "@/lib/utils";
import { AuthService } from "../auth/auth.service";
import { CommentService } from "./comment.service";

export const createComment = async (data: CreateCommentInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const commentService = new CommentService(session);
    const comment = await commentService.create(data);

    return comment;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const deleteComment = async (data: DeleteCommentInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const commentService = new CommentService(session);
    await commentService.delete(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else {
      throw new Error("Something went wrong");
    }
  }
};
