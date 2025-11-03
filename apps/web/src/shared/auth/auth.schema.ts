import { z } from "zod";
import { emailSchema } from "../common/common.schema";
import { nameSchema, usernameSchema } from "../user/user.schema";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./auth.constants";

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
  .max(PASSWORD_MAX_LENGTH, "Password must be under 20 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    "Password must include uppercase, lowercase, digit, and special character"
  );

export const signupSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
});

export const forgetPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({ newPassword: passwordSchema });
