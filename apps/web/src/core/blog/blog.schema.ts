import "server-only";
import {
  imageSchema,
  titleSchema,
  contentSchema,
  categorySchema,
} from "@/shared/blog/blog.schema";
import { z } from "zod";
import { idSchema } from "../common/common.schema";

export const createBlogSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  category: categorySchema,
  cover: imageSchema,
  images: z
    .array(
      z.object({
        url: imageSchema,
        publicId: z.string().min(1, "publicId is required"),
      })
    )
    .min(1, "At least 1 image is required")
    .max(3, "Only 3 images allowed"),
});

export const updateBlogSchema = z.object({
  blogId: idSchema,
  title: titleSchema,
  content: contentSchema,
  category: categorySchema,
  cover: imageSchema,
  images: z
    .array(
      z.object({
        url: imageSchema,
        publicId: z.string().min(1, "publicId is required"),
      })
    )
    .min(1, "At least 1 image is required")
    .max(3, "Only 3 images allowed"),
  imagesToDelete: z.array(z.string()),
});

export const deleteBlogSchema = z.object({
  blogId: idSchema,
});

export const likeUnlikeSchema = z.object({
  blogId: idSchema,
});
