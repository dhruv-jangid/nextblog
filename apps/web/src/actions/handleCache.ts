"use server";

import "server-only";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { headers } from "next/headers";

export const updateUserCache = async (): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { username } = session.user;

  await redis.del(`user:${username}`);
  await redis.del(`blog:${username}:*`);
};
