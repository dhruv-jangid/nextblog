import "server-only";
import {
  titleValidator,
  contentValidator,
  categoryValidator,
} from "@/lib/schemas/shared";
import { z } from "zod";
import { slugifyTitle } from "@/lib/utils";

export const imageValidator = z
  .string()
  .includes("cloudinary", { message: "Invalid Image" });

export const blogValidator = z
  .object({
    title: titleValidator,
    content: contentValidator,
    category: categoryValidator,
    image: imageValidator,
    images: z
      .array(
        z.object({
          url: imageValidator,
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

export const editBlogValidator = z
  .object({
    title: titleValidator,
    content: contentValidator,
    category: categoryValidator,
    image: imageValidator,
    images: z
      .array(
        z.object({
          url: imageValidator,
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
