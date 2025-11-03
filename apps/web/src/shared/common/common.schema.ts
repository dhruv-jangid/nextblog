import { z } from "zod";
import { checkProfanity } from "@/lib/profanity";
import { imageSchema } from "../blog/blog.schema";
import { nameSchema, usernameSchema } from "../user/user.schema";

export const emailSchema = z.email("Invalid email address");

export const commentContentSchema = z
  .string()
  .min(1, "Comment cannot be empty")
  .max(100, "Comment must be under 100 characters")
  .refine((text) => !checkProfanity(text), "Inappropriate Comment")
  .trim();

export const commentSchema = z.object({
  id: z.string(),
  content: commentContentSchema,
  createdAt: z.string(),
  authorName: nameSchema,
  authorUsername: usernameSchema,
  authorImage: imageSchema.nullable(),
});

export const contactUserSchema = z.object({
  email: emailSchema,
});

export const newsletterSchema = z.object({
  email: emailSchema,
});
