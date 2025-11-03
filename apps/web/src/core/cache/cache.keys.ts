import "server-only";

export const blogCK = (blogId: string) => `blog:${blogId}`;
export const commentCK = (blogId: string) => `comment:${blogId}`;

export const blogLikesCountCK = (blogId: string) =>
  `blog:${blogId}:likes:count`;
export const blogLikesCK = (blogId: string) => `blog:${blogId}:likes`;
export const blogCommentsCK = (blogId: string) => `blog:${blogId}:comments`;
export const blogCommentsMetaCK = (blogId: string) =>
  `blog:${blogId}:comments:meta`;

export const usernameBFCK = "usernames";
export const userCK = (username: string) => `user:${username}`;
export const userBlogsCK = (userId: string) => `user:${userId}:blogs`;
export const userBlogsMetaCK = (userId: string) => `user:${userId}:blogs:meta`;
export const userLikedCK = (userId: string) => `user:${userId}:liked`;
export const userLikedMetaCK = (userId: string) => `user:${userId}:liked:meta`;

export const feedBlogsCK = "feed:blogs";
