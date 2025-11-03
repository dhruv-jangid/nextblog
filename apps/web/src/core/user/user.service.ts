import "server-only";
import {
  BLOG_TTL,
  USER_TTL,
  USER_BLOGS_TTL,
  USER_LIKED_BLOGS_TTL,
} from "../cache/cache.ttl";
import {
  blogCK,
  userCK,
  userBlogsCK,
  userLikedCK,
  userBlogsMetaCK,
  userLikedMetaCK,
  usernameBFCK,
} from "../cache/cache.keys";
import { encodeId } from "@/lib/hashids";
import { UserRepository } from "./user.repository";
import { CacheService } from "../cache/cache.service";
import { BlogRepository } from "../blog/blog.repository";

const PAGE_SIZE = 10;

export class UserService {
  constructor(private readonly user: UserSession) {}

  async findByUsername(username: string) {
    const userExists = await CacheService.sIsMember(usernameBFCK, username);
    if (!userExists) {
      return null;
    }

    const userKey = userCK(username);
    try {
      const cached = await CacheService.hGetAll<User>(userKey);

      if (Object.keys(cached).length > 0) {
        const isSelf = this.user.id === cached.id;
        const isSelfAdmin = this.user.role === "admin";

        return { ...cached, isSelf, isSelfAdmin };
      }
    } catch {}

    const user = await UserRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    try {
      const flat: string[] = [];
      for (const [field, value] of Object.entries(user)) {
        flat.push(field, String(value));
      }

      const transaction = CacheService.pipeline();
      transaction.hSet(userKey, flat);
      transaction.expire(userKey, USER_TTL);

      await transaction.exec();
    } catch {}

    const isSelf = this.user.id === user.id;
    const isSelfAdmin = this.user.role === "admin";

    return { ...user, isSelf, isSelfAdmin };
  }

  async findBlogs(userId: string, pageSize = PAGE_SIZE, cursor?: string) {
    const userBlogsMetaKey = userBlogsMetaCK(userId);
    const userBlogsKey = userBlogsCK(userId);
    try {
      const maxScore = cursor ? new Date(cursor).getTime() : +Infinity;

      const pipeline = CacheService.pipeline();
      pipeline.get(userBlogsMetaKey);
      pipeline.zRange(userBlogsKey, maxScore, -Infinity, {
        BY: "SCORE",
        REV: true,
        LIMIT: { count: pageSize, offset: 0 },
      });

      const [meta, blogIds] = (await pipeline.execAsPipeline()) as unknown as [
        string | null,
        string[]
      ];

      if (meta === "empty") {
        return { blogs: [], nextCursor: null };
      }

      if (blogIds.length > 0) {
        const cached = await CacheService.mGet<Blog>(blogIds);

        const cachedBlogs = cached.filter((b): b is Blog => b !== null);
        const missingIds = blogIds.filter((_, i) => cached[i] === null);

        let missingBlogs: Blog[] = [];
        if (missingIds.length > 0) {
          missingBlogs = await BlogRepository.findMany(missingIds);

          if (missingBlogs.length > 0) {
            const transaction = CacheService.pipeline();
            missingBlogs.forEach((blog) => {
              const blogKey = blogCK(blog.id);
              transaction.set(blogKey, JSON.stringify(blog), {
                expiration: { type: "EX", value: BLOG_TTL },
              });
            });

            await transaction.exec();
          }
        }

        const blogsMap = new Map(
          [...cachedBlogs, ...missingBlogs].map((blog) => [blog.id, blog])
        );
        const orderedBlogs = blogIds.reduce<Blog[]>((acc, id) => {
          const blog = blogsMap.get(id);
          if (blog) {
            acc.push(blog);
          }
          return acc;
        }, []);

        const nextCursor =
          orderedBlogs.length === pageSize
            ? orderedBlogs[orderedBlogs.length - 1].createdAt
            : null;

        await CacheService.set(userBlogsMetaKey, "ok", USER_BLOGS_TTL);

        const blogs = orderedBlogs.map((blog) => ({
          ...blog,
          id: encodeId(blog.id),
        }));

        return { blogs, nextCursor };
      }
    } catch {}

    const { blogs: dbBlogs, nextCursor } =
      await BlogRepository.findManyByUserId(userId, pageSize, cursor);

    try {
      const transaction = CacheService.pipeline();
      if (dbBlogs.length > 0) {
        dbBlogs.forEach((blog) => {
          const blogKey = blogCK(blog.id);
          transaction.set(blogKey, JSON.stringify(blog), {
            expiration: { type: "EX", value: BLOG_TTL },
          });
        });

        const members = dbBlogs.map((blog) => ({
          score: new Date(blog.createdAt).getTime(),
          value: blog.id,
        }));

        transaction.zAdd(userBlogsKey, members);
        transaction.expire(userBlogsKey, USER_BLOGS_TTL);
        transaction.set(userBlogsMetaKey, "ok");
      } else {
        transaction.set(userBlogsMetaKey, "empty");
      }

      transaction.expire(userBlogsMetaKey, USER_BLOGS_TTL);

      await transaction.exec();
    } catch {}

    const blogs = dbBlogs.map((blog) => ({ ...blog, id: encodeId(blog.id) }));

    return { blogs, nextCursor };
  }

  async findLikedBlogsById(
    userId: string,
    pageSize = PAGE_SIZE,
    cursor?: string
  ) {
    const userLikedMetaKey = userLikedMetaCK(userId);
    const userLikedKey = userLikedCK(userId);
    try {
      const maxScore = cursor ? new Date(cursor).getTime() : +Infinity;

      const pipeline = CacheService.pipeline();
      pipeline.get(userLikedMetaKey);
      pipeline.zRangeWithScores(userLikedKey, maxScore, -Infinity, {
        REV: true,
        LIMIT: { count: pageSize, offset: 0 },
      });

      const [meta, blogsWithScores] =
        (await pipeline.execAsPipeline()) as unknown as [
          string | null,
          { value: string; score: number }[]
        ];

      if (meta === "empty") {
        return { blogs: [], nextCursor: null };
      }

      if (blogsWithScores.length > 0) {
        const blogIds = blogsWithScores.map((b) => b.value);

        const cached = await CacheService.mGet<Blog>(blogIds);

        const cachedBlogs = cached.filter((b): b is Blog => b !== null);
        const missingBlogsIds = blogIds.filter((_, i) => cached[i] === null);

        let missingBlogs: Blog[] = [];
        if (missingBlogsIds.length > 0) {
          missingBlogs = await BlogRepository.findMany(missingBlogsIds);

          if (missingBlogs.length > 0) {
            const pipeline = CacheService.pipeline();
            missingBlogs.forEach((blog) => {
              const blogKey = blogCK(blog.id);
              pipeline.set(blogKey, JSON.stringify(blog), {
                expiration: { type: "EX", value: BLOG_TTL },
              });
            });

            await pipeline.exec();
          }
        }

        const blogsMap = new Map(
          [...cachedBlogs, ...missingBlogs].map((b) => [b.id, b])
        );
        const orderedBlogs = blogIds.reduce<Blog[]>((acc, id) => {
          const blog = blogsMap.get(id);
          if (blog) {
            acc.push(blog);
          }
          return acc;
        }, []);
        const blogs = orderedBlogs.map((blog) => ({
          ...blog,
          id: encodeId(blog.id),
        }));

        const nextCursor =
          blogsWithScores.length === pageSize
            ? blogsWithScores[blogsWithScores.length - 1].score
            : null;

        await CacheService.set(userLikedMetaKey, "ok", USER_LIKED_BLOGS_TTL);

        return { blogs, nextCursor };
      }
    } catch {}

    const { blogs: dbBlogs, nextCursor } =
      await BlogRepository.findManyLikedByUserId(userId, pageSize, cursor);

    const fixedBlogs = dbBlogs.map(({ likedAt, ...blog }) => blog);

    try {
      const transaction = CacheService.pipeline();
      if (dbBlogs.length > 0) {
        fixedBlogs.forEach((blog) => {
          const blogKey = blogCK(blog.id);
          transaction.set(blogKey, JSON.stringify(blog), {
            expiration: { type: "EX", value: BLOG_TTL },
          });
        });

        const members = dbBlogs.map((blog) => ({
          score: new Date(blog.likedAt).getTime(),
          value: blog.id,
        }));

        transaction.zAdd(userLikedKey, members);
        transaction.set(userLikedMetaKey, "ok");
      } else {
        transaction.set(userLikedMetaKey, "empty");
      }

      transaction.expire(userLikedKey, USER_LIKED_BLOGS_TTL);
      transaction.expire(userLikedMetaKey, USER_LIKED_BLOGS_TTL);

      await transaction.exec();
    } catch {}

    const blogs = fixedBlogs.map((blog) => ({
      ...blog,
      id: encodeId(blog.id),
    }));

    return { blogs, nextCursor };
  }
}
