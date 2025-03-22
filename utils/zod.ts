import { z } from "zod";

export const slugValidator = z
  .string({ required_error: "Username is required!" })
  .min(3, "Username must have at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(
    /^[a-z][a-z0-9_.]*$/,
    "Username must start with lowercase letter and contain only a-z, 0-9, . and _"
  );

export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(20, "Password must be at most 20 characters long")
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /\d/.test(password), {
    message: "Password must contain at least one digit",
  })
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: "Password must contain at least one special character",
  });
