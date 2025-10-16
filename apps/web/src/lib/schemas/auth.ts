import { z } from "zod/v3";
import { checkProfanity, restrictedUsernames } from "../utils";

export const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be under 50 characters")
  .regex(
    /^[a-zA-Z0-9 ]+$/,
    "Name can only contain letters, numbers, and spaces"
  )
  .refine((text) => !checkProfanity({ text }), "Inappropriate Name");

export const usernameSchema = z
  .string()
  .min(3, "Username must have atleast 3 characters")
  .max(30, "Username must be under 30 characters")
  .regex(
    /^(?!.*__)(?!.*_$)[a-z0-9](?:[a-z0-9_]*[a-z0-9])?$/,
    "Invalid Username"
  )
  .refine((val) => !restrictedUsernames.has(val), "Username not available")
  .refine((text) => !checkProfanity({ text }), "Inappropriate Username");

export const emailSchema = z
  .string()
  .refine(
    (val) =>
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i.test(
        val
      ),
    "Invalid email address"
  );

export const passwordSchema = z
  .string()
  .min(8, "Password must be atleast 8 characters")
  .max(20, "Password must be under 20 characters")
  .refine(
    (pwd) => /[a-z]/.test(pwd),
    "Password must include a lowercase letter"
  )
  .refine(
    (pwd) => /[A-Z]/.test(pwd),
    "Password must include an uppercase letter"
  )
  .refine((pwd) => /\d/.test(pwd), "Password must include a digit")
  .refine(
    (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    "Password must include a special character"
  );

export const signupSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
});

export const resetPasswordSchema = z.object({ newPassword: passwordSchema });
