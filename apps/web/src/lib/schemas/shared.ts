import {
  checkProfanity,
  blogCategories,
  restrictedUsernames,
} from "@/lib/utils";
import { z, ZodError } from "zod";
import type { JSONContent } from "@tiptap/react";

export const nameValidator = z
  .string()
  .min(3, { error: "Name must be at least 3 characters" })
  .max(50, { error: "Name must be under 50 characters" })
  .regex(/^[a-zA-Z0-9 ]+$/, {
    error: "Name can only contain letters, numbers, and spaces",
  })
  .refine((text) => !checkProfanity({ text }), {
    error: "Inappropriate Name",
  })
  .trim();

export const usernameValidator = z
  .string()
  .min(3, { error: "Username must have atleast 3 characters" })
  .max(30, { error: "Username must be under 30 characters" })
  .regex(/^(?!.*__)(?!.*_$)[a-z0-9](?:[a-z0-9_]*[a-z0-9])?$/, {
    error: "Invalid Username",
  })
  .refine((val) => !restrictedUsernames.has(val), {
    error: "Username not available",
  })
  .refine((text) => !checkProfanity({ text }), {
    error: "Inappropriate Username",
  })
  .trim()
  .toLowerCase();

export const emailValidator = z.email({ error: "Invalid email address" });

export const passwordValidator = z
  .string()
  .min(8, { error: "Password must be atleast 8 characters" })
  .max(20, { error: "Password must be under 20 characters" })
  .refine((pwd) => /[a-z]/.test(pwd), {
    error: "Password must include a lowercase letter",
  })
  .refine((pwd) => /[A-Z]/.test(pwd), {
    error: "Password must include an uppercase letter",
  })
  .refine((pwd) => /\d/.test(pwd), {
    error: "Password must include a digit",
  })
  .refine((pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), {
    error: "Password must include a special character",
  });

export const credentialsValidator = z.object({
  name: nameValidator,
  username: usernameValidator,
  email: emailValidator,
  password: passwordValidator,
});

export const titleValidator = z
  .string()
  .min(10, { error: "Title must be atleast 10 characters" })
  .max(100, { error: "Title must be under 100 characters" })
  .refine((text) => !checkProfanity({ text }), {
    error: "Inappropriate Title",
  })
  .trim();

export const contentValidator = z.any() as z.ZodType<JSONContent>;

export const categoryValidator = z.enum(blogCategories, {
  error: "Invalid Category",
});

export const contactValidator = z.object({
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

export const commentValidator = z
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
