import "server-only";
import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  client: ReturnType<typeof createClient> | undefined;
};

const client =
  globalForRedis.client ??
  createClient({
    url: process.env.REDIS_URL,
  });

if (!globalForRedis.client) {
  globalForRedis.client = client;
  client.connect().catch(console.error);
}

export const redis = client;
