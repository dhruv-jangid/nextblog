import "server-only";
import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  client: ReturnType<typeof createClient> | undefined;
};

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL environment variable is not defined");
}

if (!globalForRedis.client) {
  globalForRedis.client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 10000,
      reconnectStrategy: (retries) => {
        if (retries > 10) return new Error("Max retries reached");
        return Math.min(retries * 50, 3000);
      },
    },
  });

  globalForRedis.client.on("error", (err) => {
    console.error("Redis Error:", err);
  });

  globalForRedis.client.connect().catch(console.error);
}

export const redis = globalForRedis.client;
