import { z } from "zod";
import {
  blogCategories,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from "./blog.constants";
import { checkProfanity } from "@/lib/profanity";
import { nameSchema, usernameSchema } from "../user/user.schema";

export const titleSchema = z
  .string()
  .trim()
  .min(10, "Title must be atleast 10 characters")
  .max(100, "Title must be under 100 characters")
  .refine((text) => !checkProfanity(text), "Inappropriate Title");

export const contentSchema = z.custom<BlogContent>();

export const categorySchema = z.enum(blogCategories, "Invalid Category");

export const imageSchema = z.url().refine((url) => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === "res.cloudinary.com" ||
      urlObj.hostname.endsWith(".cloudinary.com")
    );
  } catch {
    return false;
  }
}, "Invalid Image");

export const imageClientSchema = z
  .instanceof(File, { error: "Please upload an image file" })
  .refine((file) => file.size > 0, "Invalid image")
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    `Image must be under ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
  )
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    `Only ${ALLOWED_IMAGE_TYPES.map((t) => t.split("/")[1].toUpperCase()).join(
      ", "
    )} images are allowed`
  );

export const createBlogClientSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  category: categorySchema,
  images: z
    .array(imageClientSchema)
    .min(1, "At least 1 image is required")
    .max(3, "Only 3 images allowed"),
});

export const editBlogClientSchema = z
  .object({
    title: titleSchema,
    content: contentSchema,
    category: categorySchema,
    newImages: z.array(imageClientSchema),
    imagesToKeep: z.array(
      z.object({
        url: imageSchema,
        publicId: z.string().min(1, "publicId is required"),
      })
    ),
  })
  .refine((data) => {
    const totalImages = data.imagesToKeep.length + data.newImages.length;
    return totalImages >= 1 && totalImages <= 3;
  }, "Total images must be between 1 and 3");

export const blogSchema = z.object({
  id: z.string(),
  title: titleSchema,
  content: contentSchema,
  cover: imageSchema,
  category: categorySchema,
  createdAt: z.string("createdAt can't be empty"),
  updatedAt: z.string("updatedAt can't be empty"),
  author: z.object({
    name: nameSchema,
    username: usernameSchema,
    image: imageSchema.nullable(),
  }),
});
