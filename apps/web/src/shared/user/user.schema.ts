import { z } from "zod";
import { checkProfanity } from "@/lib/profanity";
import { restrictedUsernames } from "@/shared/user/user.constants";

export const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be under 50 characters")
  .regex(
    /^[a-zA-Z0-9 ]+$/,
    "Name can only contain letters, numbers, and spaces"
  )
  .refine((text) => !checkProfanity(text), "Inappropriate Name");

export const usernameSchema = z
  .string()
  .min(3, "Username must have atleast 3 characters")
  .max(30, "Username must be under 30 characters")
  .regex(
    /^(?!.*__)(?!.*_$)[a-z0-9](?:[a-z0-9_]*[a-z0-9])?$/,
    "Invalid Username"
  )
  .refine((val) => !restrictedUsernames.has(val), "Username not available")
  .refine((text) => !checkProfanity(text), "Inappropriate Username");

export const userSchema = z.object({
  id: z.string(),
  name: nameSchema,
  username: usernameSchema,
  image: z.string().nullable(),
  role: z.string(),
});
