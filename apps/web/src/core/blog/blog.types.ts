export {};

import type {
  createBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
  likeUnlikeSchema,
} from "./blog.schema";
import type { z } from "zod";

declare global {
  type CreateBlogInput = z.infer<typeof createBlogSchema>;
  type CreateBlog = CreateBlogInput & {
    userId: string;
    authorName: string;
    authorUsername: string;
    authorImage: string | undefined;
  };

  type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
  type UpdateBlog = UpdateBlogInput & {
    userId: string;
    role: string;
  };

  type DeleteBlogInput = z.infer<typeof deleteBlogSchema>;
  type DeleteBlog = DeleteBlogInput & {
    userId: string;
    role: string;
  };

  type LikeUnlikeBlogInput = z.infer<typeof likeUnlikeSchema>;
  type LikeUnlikeBlog = LikeUnlikeBlogInput & { userId: string };
}
