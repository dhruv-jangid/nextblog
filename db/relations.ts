import {
  users,
  blogs,
  likes,
  accounts,
  comments,
  sessions,
  blogImages,
} from "@/db/schema";
import { relations } from "drizzle-orm/relations";

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  likes: many(likes),
  comments: many(comments),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  likes: many(likes),
  comments: many(comments),
  users: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
  blogImages: many(blogImages),
}));

export const blogImagesRelations = relations(blogImages, ({ one }) => ({
  blog: one(blogs, { fields: [blogImages.blogId], references: [blogs.id] }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [likes.blogId],
    references: [blogs.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [comments.blogId],
    references: [blogs.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
