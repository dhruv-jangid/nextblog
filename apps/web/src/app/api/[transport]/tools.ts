import "server-only";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { blogs, likes, users } from "@/db/schema";

export const getUserInfoTool = async ({ username }: { username: string }) => {
  try {
    const [user] = await db
      .select({
        name: users.name,
        username: users.username,
        createdAt: users.createdAt,
        totalBlogs: sql<number>`count(distinct ${blogs.id})`,
        totalLikes: sql<number>`count(distinct ${likes.blogId})`,
        role: users.role,
      })
      .from(users)
      .leftJoin(blogs, eq(blogs.userId, users.id))
      .leftJoin(likes, eq(likes.blogId, blogs.id))
      .where(eq(users.username, username))
      .groupBy(users.id)
      .limit(1);

    if (!user) {
      return {
        content: [
          {
            type: "text",
            text: `No user with username: "${username}". Please check the spelling.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `User found: ${JSON.stringify(
            {
              name: user.name,
              username: user.username,
              joinedOn: new Intl.DateTimeFormat("en-GB", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              }).format(new Date(user.createdAt)),
              totalBlogs: user.totalBlogs,
              totalLikes: user.totalLikes,
              role: user.role.toUpperCase(),
            },
            null,
            2
          )}`,
        },
      ],
    };
  } catch {
    return {
      content: [
        {
          type: "text",
          text: `Something went wrong. Please try again later.`,
        },
      ],
    };
  }
};
