import "server-only";
import { db } from "@/db";
import { redis } from "@/lib/redis";
import { Grid1 } from "@/components/grid1";
import { eq, desc, count } from "drizzle-orm";
import { blogs, users, likes } from "@/db/schema";
import { VerticalList } from "@/components/v-list";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const cacheKey = "homepage:blogs";
  const cached = await redis.get(cacheKey);

  let actualBlogs: Blog[];
  if (cached) {
    actualBlogs = JSON.parse(cached);
  } else {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        content: blogs.content,
        category: blogs.category,
        image: blogs.image,
        createdAt: blogs.createdAt,
        likeCount: count(likes.blogId).as("likeCount"),
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
        },
      })
      .from(blogs)
      .innerJoin(users, eq(users.id, blogs.userId))
      .leftJoin(likes, eq(likes.blogId, blogs.id))
      .groupBy(blogs.id, users.id)
      .orderBy(desc(blogs.createdAt))
      .limit(10);

    const grouped: Record<string, Blog> = {};
    for (const row of rows) {
      const key = row.slug;

      if (!grouped[key]) {
        grouped[key] = {
          id: row.id,
          title: row.title,
          slug: row.slug,
          image: row.image,
          category: row.category,
          createdAt: row.createdAt,
          likeCount: row.likeCount,
          user: {
            id: row.user.id,
            name: row.user.name,
            username: row.user.username,
            image: row.user.image,
          },
        };
      }
    }
    actualBlogs = Object.values(grouped);

    await redis.set(cacheKey, JSON.stringify(actualBlogs), { EX: 60 });
  }

  const [Blog1, Blog2, ...remainingBlogs] = actualBlogs;

  const lovedOnes = [...actualBlogs].sort(
    (a, b) => (b.likeCount || 0) - (a.likeCount || 0)
  );

  return (
    <>
      {actualBlogs.length > 0 ? (
        <>
          <section className="flex flex-col xl:flex-row lg:m-8 lg:p-6 bg-accent rounded-b-none lg:rounded-xl lg:border">
            <div className="w-1/2 text-9xl lg:text-[10rem] leading-24 lg:leading-30 pl-8 pt-16 pb-8 lg:pb-16 lg:pl-12 tracking-tight">
              <div>BL</div>
              <div className="ml-10">OG-</div>
              <div>NEW</div>
              <div className="flex items-center gap-8">
                <span>S</span>
                <span className="inline-flex flex-col text-2xl lg:text-3xl leading-5 lg:leading-6">
                  <span className="tracking-tight w-max">Latest News </span>
                  <span className="ml-10 tracking-tight w-max">
                    and updates
                  </span>
                </span>
              </div>
            </div>
            <VerticalList blogs={[Blog1, Blog2]} />
          </section>
          <div className="text-3xl lg:text-4xl ml-auto text-end tracking-tighter w-xs lg:w-lg border-b border-dashed mt-16 mr-8 lg:mr-16">
            ... Recent Blogs
          </div>
          <Grid1 blogs={remainingBlogs} />
          <Separator />
          <div className="text-3xl lg:text-4xl ml-auto text-end tracking-tighter w-xs lg:w-lg border-b border-dashed mt-16 mr-8 lg:mr-16">
            ... Loved Ones
          </div>
          <Grid1 blogs={lovedOnes} />
        </>
      ) : (
        <div className="flex justify-center items-center min-h-dvh text-4xl mx-auto">
          Oops! There are no blogs to display currently, please check back
          later.
        </div>
      )}
    </>
  );
}
