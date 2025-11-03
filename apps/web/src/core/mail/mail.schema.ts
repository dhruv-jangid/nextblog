import "server-only";
import { z } from "zod";
import { emailSchema } from "@/shared/common/common.schema";

export const mailSchema = z.object({
  to: emailSchema,
  subject: z.string(),
  text: z.string(),
});
