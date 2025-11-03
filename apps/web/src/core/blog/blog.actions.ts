"use server";

import "server-only";
import { ZodError } from "zod";
import { BlogService } from "./blog.service";
import { getFirstZodError } from "@/lib/utils";
import { AuthService } from "../auth/auth.service";
import { redirect, RedirectType } from "next/navigation";

export const createBlog = async (data: CreateBlogInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  let blogId: string;
  try {
    const blogService = new BlogService(session);
    blogId = await blogService.create(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect(`/${session.username}/${blogId}`, RedirectType.replace);
};

export const editBlog = async (data: UpdateBlogInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const blogService = new BlogService(session);
    await blogService.update(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect(`/${session.username}/${data.blogId}`);
};

export const deleteBlog = async (data: DeleteBlogInput): Promise<void> => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const blogService = new BlogService(session);
    await blogService.delete(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const likeBlog = async (data: LikeUnlikeBlogInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const blogService = new BlogService(session);
    await blogService.like(data);
  } catch {
    throw new Error("Something went wrong");
  }
};

export const unlikeBlog = async (data: LikeUnlikeBlogInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const blogService = new BlogService(session);
    await blogService.unLike(data);
  } catch {
    throw new Error("Something went wrong");
  }
};
