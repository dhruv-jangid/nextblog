import { users } from "@/db/schema";

export type BlogType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
};

export type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
    username: string;
  };
};

export type UserType = Pick<
  typeof users.$inferSelect,
  "id" | "name" | "image" | "username" | "role"
> & { totalLikes: number };
