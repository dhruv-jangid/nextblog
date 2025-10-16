import { z } from "zod";
import { imageSchema } from "./other";
import type { JSONContent } from "@tiptap/react";
import { blogCategories, checkProfanity, slugifyTitle } from "../utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/heic",
];

export const titleSchema = z
  .string()
  .min(10, "Title must be atleast 10 characters")
  .max(100, "Title must be under 100 characters")
  .refine((text) => !checkProfanity({ text }), "Inappropriate Title")
  .trim();

export const contentSchema = z.any() as z.ZodType<JSONContent>;

export const categorySchema = z.enum(blogCategories, "Invalid Category");

export const createBlogSchema = z
  .object({
    title: titleSchema,
    content: contentSchema,
    category: categorySchema,
    image: imageSchema,
    images: z
      .array(
        z.object({
          url: imageSchema,
          publicId: z.string().min(1, "publicId is required"),
        })
      )
      .min(1, "At least 1 image is required")
      .max(3, "Only 3 images allowed"),
  })
  .transform((data) => ({
    ...data,
    slug: slugifyTitle({ title: data.title }),
  }));

export const editBlogSchema = z
  .object({
    title: titleSchema,
    content: contentSchema,
    category: categorySchema,
    image: imageSchema,
    images: z
      .array(
        z.object({
          url: imageSchema,
          publicId: z.string().min(1, "publicId is required"),
        })
      )
      .min(1, "At least 1 image is required")
      .max(3, "Only 3 images allowed"),
  })
  .transform((data) => ({
    ...data,
    slug: slugifyTitle({ title: data.title }),
  }));

export const imageClientSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Image is required")
  .refine((file) => file.size < MAX_FILE_SIZE, "Image(s) must be under 5MB")
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    "Only JPG, PNG, or HEIC images allowed"
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
    newImages: z.array(imageSchema),
    imagesToKeep: z.array(
      z.object({
        url: z.string().includes("cloudinary", { error: "Invalid Image" }),
        publicId: z.string().min(1, "publicId is required"),
      })
    ),
  })
  .refine((data) => {
    const totalImages = data.imagesToKeep.length + data.newImages.length;
    return totalImages >= 1 && totalImages <= 3;
  }, "Total images must be between 1 and 3");
