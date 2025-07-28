"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRedisClient } from "@/lib/redis";

export const updateUserCache = async (): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { username } = session.user;

  const redis = await getRedisClient();
  await redis.del(`user:${username}`);
  await redis.del(`blog:${username}:*`);
};
