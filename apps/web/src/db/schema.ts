import {
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
  type PgTimestampConfig,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { dbDefaults } from "./defaults";
import { generateSnowflake } from "@/db/snowflake";

const {
  // Users
  DEFAULT_NAME,
  NAME_LENGTH,
  USERNAME_LENGTH,
  EMAIL_LENGTH,
  EMAIL_VERIFIED_DEFAULT,
  ROLE_LENGTH,
  DEFAULT_ROLE,
  BANNED_DEFAULT,
  // Blogs
  TITLE_LENGTH,
  CATEGORY_LENGTH,
  LIKES_DEFAULT,
  // BlogImages
  ORDER_DEFAULT,
  IP_ADDRESS_LENGTH,
  // Accounts
  ACCOUNT_ID_LENGTH,
  PROVIDER_ID_LENGTH,
  SCOPE_LENGTH,
  PASSWORD_LENGTH,
  USER_AGENT_LENGTH,
  // Sessions
  TOKEN_LENGTH,
  // Verifications
  IDENTIFIER_LENGTH,
  VALUE_LENGTH,
} = dbDefaults;

// Defaults
const ID_LENGTH = 20;
const id = varchar("id", { length: ID_LENGTH })
  .primaryKey()
  .$defaultFn(() => generateSnowflake())
  .notNull();
const timestampConfig: PgTimestampConfig = {
  precision: 3,
  mode: "string",
  withTimezone: true,
};
const createdAt = timestamp("created_at", timestampConfig)
  .$type<string>()
  .defaultNow()
  .notNull();
const updatedAt = timestamp("updated_at", timestampConfig)
  .$type<string>()
  .defaultNow()
  .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
  .notNull();
const authorName = varchar("author_name", { length: NAME_LENGTH }).notNull();
const authorUsername = varchar("author_username", {
  length: USERNAME_LENGTH,
}).notNull();
const authorImage = text("author_image");

export const users = pgTable(
  "users",
  {
    id,
    name: varchar("name", { length: NAME_LENGTH })
      .default(DEFAULT_NAME)
      .notNull(),
    displayUsername: varchar("display_username", { length: NAME_LENGTH }),
    username: varchar("username", { length: USERNAME_LENGTH })
      .unique()
      .notNull(),
    email: varchar("email", { length: EMAIL_LENGTH }).notNull(),
    emailVerified: boolean("email_verified")
      .default(EMAIL_VERIFIED_DEFAULT)
      .notNull(),
    image: text("image"),
    createdAt,
    updatedAt,
    role: varchar("role", { length: ROLE_LENGTH })
      .default(DEFAULT_ROLE)
      .notNull(),
    banned: boolean("banned").default(BANNED_DEFAULT).notNull(),
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
    id,
    title: varchar("title", { length: TITLE_LENGTH }).notNull(),
    content: jsonb("content").$type<BlogContent>().notNull(),
    cover: text("cover").notNull(),
    category: varchar("category", { length: CATEGORY_LENGTH }).notNull(),
    authorName,
    authorUsername,
    authorImage,
    likes: integer("likes").default(LIKES_DEFAULT).notNull(),
    userId: varchar("user_id", { length: ID_LENGTH }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("blogs_user_idx").on(table.userId),
    index("blogs_category_idx").on(table.category),
    index("blogs_created_at_idx").on(table.createdAt),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const blogImages = pgTable(
  "blog_images",
  {
    id,
    blogId: varchar("blog_id", { length: ID_LENGTH }).notNull(),
    url: text("url").notNull(),
    publicId: varchar("public_id").notNull(),
    order: integer("order").notNull().default(ORDER_DEFAULT),
    createdAt,
  },
  (table) => [
    uniqueIndex("blog_images_order_key").on(table.blogId, table.order),
    foreignKey({ columns: [table.blogId], foreignColumns: [blogs.id] })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const likes = pgTable(
  "likes",
  {
    userId: varchar("user_id", { length: ID_LENGTH }).notNull(),
    blogId: varchar("blog_id", { length: ID_LENGTH }).notNull(),
    createdAt,
    updatedAt,
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
    id,
    content: text("content").notNull(),
    blogId: varchar("blog_id", { length: ID_LENGTH }).notNull(),
    userId: varchar("user_id", { length: ID_LENGTH }).notNull(),
    authorName,
    authorUsername,
    authorImage,
    createdAt,
    updatedAt,
  },
  (table) => [
    index("comments_user_idx").on(table.userId),
    index("comments_blog_idx").on(table.blogId),
    index("comments_created_at_idx").on(table.createdAt),
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
    id,
    accountId: varchar("account_id", { length: ACCOUNT_ID_LENGTH }).notNull(),
    providerId: varchar("provider_id", {
      length: PROVIDER_ID_LENGTH,
    }).notNull(),
    userId: varchar("user_id", { length: ID_LENGTH }).notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", timestampConfig),
    refreshTokenExpiresAt: timestamp(
      "refresh_token_expires_at",
      timestampConfig
    ),
    scope: varchar("scope", { length: SCOPE_LENGTH }),
    password: varchar("password", { length: PASSWORD_LENGTH }),
    createdAt,
    updatedAt,
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
    id,
    userId: varchar("user_id", { length: ID_LENGTH }).notNull(),
    token: varchar("token", { length: TOKEN_LENGTH }).notNull(),
    expiresAt: timestamp("expires_at", timestampConfig).notNull(),
    createdAt,
    updatedAt,
    ipAddress: varchar("ip_address", { length: IP_ADDRESS_LENGTH }),
    userAgent: varchar("user_agent", { length: USER_AGENT_LENGTH }),
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
  id,
  identifier: varchar("identifier", { length: IDENTIFIER_LENGTH }).notNull(),
  value: varchar("value", { length: VALUE_LENGTH }).notNull(),
  expiresAt: timestamp("expires_at", timestampConfig).notNull(),
  createdAt,
  updatedAt,
});
