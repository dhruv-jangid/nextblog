import {
  titleValidator,
  contentValidator,
  categoryValidator,
} from "@/lib/schemas/shared";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/heic",
];

export const imageValidatorClient = z
  .instanceof(File)
  .refine((file) => file.size > 0, { error: "Image is required" })
  .refine((file) => file.size < MAX_FILE_SIZE, {
    error: "Image(s) must be under 5MB",
  })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    error: "Only JPG, PNG, or HEIC images allowed",
  });

export const blogValidatorClient = z.object({
  title: titleValidator,
  content: contentValidator,
  category: categoryValidator,
  images: z
    .array(imageValidatorClient)
    .min(1, "At least 1 image is required")
    .max(3, "Only 3 images allowed"),
});

export const editBlogValidatorClient = z
  .object({
    title: titleValidator,
    content: contentValidator,
    category: categoryValidator,
    newImages: z.array(imageValidatorClient),
    imagesToKeep: z.array(
      z.object({
        url: z.string().includes("cloudinary", { message: "Invalid Image" }),
        publicId: z.string().min(1, "publicId is required"),
      })
    ),
  })
  .refine(
    (data) => {
      const totalImages = data.imagesToKeep.length + data.newImages.length;
      return totalImages >= 1 && totalImages <= 3;
    },
    {
      error: "Total images must be between 1 and 3",
    }
  );
