export {};

import type { z } from "zod";
import type { userSchema } from "./user.schema";

declare global {
  type User = z.infer<typeof userSchema>;
}
