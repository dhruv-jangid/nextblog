import { z, ZodError } from "zod";
import { checkProfanity } from "../utils";

export const imageSchema = z
  .string()
  .includes("cloudinary", { message: "Invalid Image" });

export const contactSchema = z.object({
  subject: z
    .string()
    .min(5, { error: "Subject must be atleast 5 characters" })
    .max(20, { error: "Subject must be under 20 characters" })
    .trim()
    .refine((text) => !checkProfanity({ text }), {
      error: "Inappropriate Subject",
    }),

  message: z
    .string()
    .min(50, { error: "Message must be atleast 50 characters" })
    .max(200, { error: "Message must be under 200 characters" })
    .trim()
    .refine((text) => !checkProfanity({ text }), {
      error: "Inappropriate Message",
    }),
});

export const commentSchema = z
  .string()
  .min(1, { error: "Comment cannot be empty" })
  .max(100, { error: "Comment must be under 100 characters" })
  .refine((text) => !checkProfanity({ text }), {
    error: "Inappropriate Comment",
  })
  .trim();

export const getFirstZodError = (error: ZodError): string => {
  const flat = z.flattenError(error);
  const fieldError = Object.values(flat.fieldErrors).flat()[0] as string;
  const formError = flat.formErrors[0];

  return fieldError || formError || "Validation Error";
};
