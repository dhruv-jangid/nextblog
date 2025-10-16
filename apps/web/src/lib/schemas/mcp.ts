import "server-only";
import { z } from "zod/v3";

export const usernameValidator = z
  .string()
  .min(3, { message: "Username must have atleast 3 characters" })
  .max(30, { message: "Username must be under 30 characters" })
  .regex(/^(?!.*__)(?!.*_$)[a-z0-9](?:[a-z0-9_]*[a-z0-9])?$/, {
    message: "Invalid Username",
  })
  .trim()
  .toLowerCase();
