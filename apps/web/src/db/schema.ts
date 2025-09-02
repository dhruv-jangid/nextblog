import {
  uuid,
  text,
  jsonb,
  index,
  integer,
  boolean,
  pgTable,
  varchar,
  timestamp,
  primaryKey,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { JSONContent } from "@tiptap/react";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    displayUsername: varchar("display_username", { length: 50 }),
    username: varchar("username", { length: 30 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    role: varchar("role", { length: 10 }).default("user").notNull(),
    banned: boolean("banned").default(false).notNull(),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
  },
  (table) => [
    uniqueIndex("users_email_key").on(table.email),
    uniqueIndex("users_username_key").on(table.username),
  ]
);

export const blogs = pgTable(
  "blogs",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    content: jsonb("content").$type<JSONContent>().notNull(),
    image: text("image").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("blogs_slug_key").on(table.slug),
    index("blogs_user_idx").on(table.userId),
    index("blogs_category_idx").on(table.category),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const blogImages = pgTable(
  "blog_images",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    blogId: uuid("blog_id").notNull(),
    url: text("url").unique().notNull(),
    publicId: varchar("public_id").unique().notNull(),
    order: integer("order").default(0),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.blogId], foreignColumns: [blogs.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const likes = pgTable(
  "likes",
  {
    userId: uuid("user_id").notNull(),
    blogId: uuid("blog_id").notNull(),
    likedAt: timestamp("liked_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.blogId] }),
    index("likes_user_idx").on(table.userId),
    index("likes_blog_idx").on(table.blogId),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({ columns: [table.blogId], foreignColumns: [blogs.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    content: text("content").notNull(),
    userId: uuid("user_id").notNull(),
    blogId: uuid("blog_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("comments_user_idx").on(table.userId),
    index("comments_blog_idx").on(table.blogId),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({ columns: [table.blogId], foreignColumns: [blogs.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 50 }).notNull(),
    userId: uuid("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      precision: 3,
      mode: "string",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      precision: 3,
      mode: "string",
    }),
    scope: varchar("scope", { length: 255 }),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("accounts_provider_key").on(table.providerId, table.accountId),
    index("accounts_user_idx").on(table.userId),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    userId: uuid("user_id").notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", {
      precision: 3,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 512 }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [
    uniqueIndex("sessions_token_key").on(table.token),
    index("sessions_user_idx").on(table.userId),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const verifications = pgTable("verifications", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at", {
    precision: 3,
    mode: "string",
  }).notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
