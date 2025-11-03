import "server-only";

export const BLOG_TTL = 86400;

export const USER_TTL = 86400;
export const USER_BLOGS_TTL = 21600;
export const USER_LIKED_BLOGS_TTL = 86400;

export const COMMENT_TTL = 21600;
export const COMMENTS_TTL = COMMENT_TTL - 60;

export const FEED_TTL = BLOG_TTL + 60;
