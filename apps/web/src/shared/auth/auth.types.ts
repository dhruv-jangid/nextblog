export {};

import type { auth } from "@/lib/auth";

declare global {
  type UserSession = (typeof auth.$Infer.Session)["user"];

  type OAuth = "google" | "github";
}
