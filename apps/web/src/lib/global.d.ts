export {};

import type { auth } from "./auth";
import type { JSONContent } from "@tiptap/react";
import type { blogs, comments, users } from "@/db/schema";

declare global {
  type Blog = Partial<
    typeof blogs.$inferSelect & {
      user: Partial<typeof users.$inferSelect>;
      likeCount?: number;
    }
  >;
  type BlogContent = JSONContent;
  type BlogComment = Partial<
    typeof comments.$inferSelect & { user: Partial<typeof users.$inferSelect> }
  >;

  type User = Partial<typeof users.$inferSelect & { totalLikes: number }>;

  type Session = typeof auth.$Infer.Session;
}
