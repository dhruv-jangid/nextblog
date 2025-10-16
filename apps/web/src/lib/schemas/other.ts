import { z as z3 } from "zod/v3";
import { z, ZodError } from "zod";
import { checkProfanity } from "../utils";

export const imageSchema = z
  .string()
  .includes("cloudinary", { message: "Invalid Image" });

export const contactSchema = z3.object({
  email: z3
    .string()
    .refine(
      (email) =>
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i.test(
          email
        ),
      { message: "Invalid email address" }
    ),
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
