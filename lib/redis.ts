import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
let connected = false;

export const getRedisClient = async () => {
  if (!connected) {
    await client.connect();
    connected = true;
  }
  return client;
};
