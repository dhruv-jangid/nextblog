import { db } from "@/db";
import { blogs } from "@/db/schema";
import { redis } from "@/lib/redis";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const BATCH_SIZE = 100;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON] Starting likes sync from cache to database");

    const cacheKeys = await redis.keys("blog:*:likes:count");

    if (cacheKeys.length === 0) {
      console.log("[CRON] No cached likes found");
      return NextResponse.json({
        success: true,
        message: "No likes to sync",
        synced: 0,
      });
    }

    console.log(`[CRON] Found ${cacheKeys.length} blogs with cached likes`);

    let totalSynced = 0;
    const errors: string[] = [];

    // Process in batches to avoid memory issues
    for (let i = 0; i < cacheKeys.length; i += BATCH_SIZE) {
      const batchKeys = cacheKeys.slice(i, i + BATCH_SIZE);

      try {
        const pipeline = redis.multi();
        batchKeys.forEach((key) => pipeline.get(key));
        const cachedValues =
          (await pipeline.execAsPipeline()) as unknown as string[];

        const updates: Array<{ id: string; likes: number }> = [];

        batchKeys.forEach((key, index) => {
          const blogId = key.replace("blog:", "").replace(":likes:count", "");
          const cachedLikes = cachedValues?.[index];

          if (cachedLikes !== null && cachedLikes !== undefined) {
            const likesCount = parseInt(cachedLikes, 10);

            if (!isNaN(likesCount) && likesCount >= 0) {
              updates.push({ id: blogId, likes: likesCount });
            } else {
              console.warn(
                `[CRON] Invalid likes count for ${blogId}: ${cachedLikes}`
              );
            }
          }
        });

        if (updates.length === 0) {
          continue;
        }

        await db.transaction(async (tx) => {
          for (const update of updates) {
            await tx
              .update(blogs)
              .set({
                likes: update.likes,
                updatedAt: sql`CURRENT_TIMESTAMP`,
              })
              .where(eq(blogs.id, update.id));
          }
        });

        totalSynced += updates.length;
        console.log(
          `[CRON] Batch synced ${updates.length} blogs (${i + 1}-${Math.min(
            i + BATCH_SIZE,
            cacheKeys.length
          )} of ${cacheKeys.length})`
        );
      } catch (error) {
        const errorMsg = `Batch ${i / BATCH_SIZE + 1} failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        console.error(`[CRON] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(
      `[CRON] Completed likes sync. Synced: ${totalSynced}, Errors: ${errors.length}`
    );

    return NextResponse.json({
      success: true,
      synced: totalSynced,
      total: cacheKeys.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Fatal error during likes sync:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
