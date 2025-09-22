import { z as z3 } from "zod/v3";
import { z, ZodError } from "zod";
import { checkProfanity } from "../utils";

export const imageSchema = z
  .string()
  .includes("cloudinary", { message: "Invalid Image" });

export const contactSchema = z3.object({
  subject: z3
    .string()
    .min(5, "Subject must be atleast 5 characters")
    .max(20, "Subject must be under 20 characters")
    .trim()
    .refine((text) => !checkProfanity({ text }), "Inappropriate Subject"),

  message: z3
    .string()
    .min(50, "Message must be atleast 50 characters")
    .max(200, "Message must be under 200 characters")
    .trim()
    .refine((text) => !checkProfanity({ text }), "Inappropriate Message"),
});

export const commentSchema = z
  .string()
  .min(1, "Comment cannot be empty")
  .max(100, "Comment must be under 100 characters")
  .refine((text) => !checkProfanity({ text }), "Inappropriate Comment")
  .trim();

export const getFirstZodError = (error: ZodError): string => {
  const flat = z.flattenError(error);
  const fieldError = Object.values(flat.fieldErrors).flat()[0] as string;
  const formError = flat.formErrors[0];

  return fieldError || formError || "Validation Error";
};
