import "server-only";
import { encodeId } from "@/lib/hashids";
import { MailService } from "../mail/mail.service";
import { CacheService } from "../cache/cache.service";
import { BLOG_TTL, FEED_TTL } from "../cache/cache.ttl";
import { BlogRepository } from "../blog/blog.repository";
import { blogCK, feedBlogsCK } from "../cache/cache.keys";
import { contactMessage } from "@/core/mail/mail.constants";

const FEED_LIMIT = 20;

export class CommonService {
  static getBlogsFeed = async (limit = FEED_LIMIT) => {
    const blogsFeedKey = feedBlogsCK;
    try {
      const blogIds = await CacheService.sRandMembers(blogsFeedKey, limit);

      if (blogIds.length > 0) {
        const cached = await CacheService.mGet<Blog>(
          blogIds.map((id) => blogCK(id))
        );

        const cachedBlogs = cached.filter((b): b is Blog => b !== null);
        if (cachedBlogs.length === blogIds.length) {
          const blogs = cachedBlogs.map((blog) => ({
            ...blog,
            id: encodeId(blog.id),
          }));

          return blogs;
        }

        const missingBlogsIds = blogIds.filter((_, i) => cached[i] === null);

        const dbBlogs = await BlogRepository.findMany(missingBlogsIds);

        if (dbBlogs.length > 0) {
          const transaction = CacheService.pipeline();
          dbBlogs.forEach((blog) => {
            const blogKey = blogCK(blog.id);
            transaction.set(blogKey, JSON.stringify(blog), {
              expiration: { type: "EX", value: BLOG_TTL },
            });
          });

          await transaction.exec();
        }

        const blogsMap = new Map(
          [...cachedBlogs, ...dbBlogs].map((b) => [b.id, b])
        );
        const orderedBlogs = blogIds.reduce<Blog[]>((acc, blogId) => {
          const blog = blogsMap.get(blogId);
          if (blog) {
            acc.push(blog);
          }
          return acc;
        }, []);
        const blogs = orderedBlogs.map((blog) => ({
          ...blog,
          id: encodeId(blog.id),
        }));

        return blogs;
      }
    } catch {}

    const dbBlogs = await BlogRepository.findManyRandom(limit);

    if (dbBlogs.length > 0) {
      try {
        const transaction = CacheService.pipeline();
        dbBlogs.forEach((blog) => {
          const blogKey = blogCK(blog.id);
          transaction.set(blogKey, JSON.stringify(blog), {
            expiration: { type: "EX", value: BLOG_TTL },
          });
        });

        const blogIds = dbBlogs.map((blog) => blog.id);
        transaction.sAdd(blogsFeedKey, blogIds);
        transaction.expire(blogsFeedKey, FEED_TTL);

        await transaction.exec();
      } catch {}
    }

    const blogs = dbBlogs.map((blog) => ({
      ...blog,
      id: encodeId(blog.id),
    }));

    return blogs;
  };

  static async contactUser(data: ContactUser) {
    await MailService.send({
      subject: "MetaPress Team",
      to: data.email,
      text: contactMessage,
    });
  }

  static async subscribeNewsletter(data: SubscribeNewsLetter) {
    await MailService.send({
      subject: "Newsletter Subscription",
      to: data.email,
      text: `Thanks for subscribing to our newsletter!`,
    });
  }
}
