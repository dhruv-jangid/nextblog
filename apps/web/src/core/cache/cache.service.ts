import "server-only";
import { redis } from "@/lib/redis";

export class CacheService {
  static pipeline = () => redis.multi();

  static eval = () => redis.eval.bind(redis);

  // Upstash doesn't support bloom filters yet so i shifted to sets for username checks
  static bfReserve = async (
    key: string,
    errorRate: number,
    capacity: number
  ) => {
    await redis.bf.reserve(key, errorRate, capacity);
  };

  static bfAdd = async (key: string, item: string) => {
    await redis.bf.add(key, item);
  };

  static bfExists = async (key: string, item: string) => {
    return await redis.bf.exists(key, item);
  };

  static flushAll = async () => await redis.flushAll();

  static get = async (key: string) => {
    return await redis.get(key);
  };

  static mGet = async <T>(keys: string[]): Promise<(T | null)[]> => {
    const results = await redis.mGet(keys);
    return results.map((r) => (r ? JSON.parse(r) : null));
  };

  static set = async (key: string, value: string, ttlSeconds?: number) => {
    await redis.set(
      key,
      value,
      ttlSeconds
        ? {
            expiration: { type: "EX", value: ttlSeconds },
          }
        : undefined
    );
  };

  static del = async (key: string) => {
    await redis.del(key);
  };

  static getCounter = async (key: string) => {
    const value = await redis.get(key);
    return value ? Number(value) : 0;
  };

  static setCounter = async (key: string, value: number) => {
    await redis.set(key, value);
  };

  static incr = async (key: string, amount = 1) => {
    await redis.incrby(key, amount);
  };

  static decr = async (key: string, amount = 1) => {
    await redis.decrby(key, amount);
  };

  static sCard = async (key: string) => {
    return await redis.sCard(key);
  };

  static sIsMember = async (key: string, member: string) => {
    const result = await redis.sIsMember(key, member);
    return result === 1;
  };

  static sRandMembers = async (key: string, count: number) => {
    return await redis.sRandMemberCount(key, count);
  };

  static sAdd = async (key: string, member: string) => {
    await redis.sAdd(key, member);
  };

  static sRem = async (key: string, member: string) => {
    await redis.sRem(key, member);
  };

  static zRange = async (
    key: string,
    min: number | string,
    max: number | string,
    opts: { reverse?: boolean; offset?: number; count?: number }
  ) => {
    return await redis.zRange(key, min, max, {
      REV: opts.reverse ?? false,
      BY: "SCORE",
      LIMIT: { offset: opts.offset ?? 0, count: opts.count ?? 10 },
    });
  };

  static zAdd = async (
    key: string,
    members: { score: number; value: string }[]
  ) => {
    await redis.zAdd(key, members);
  };

  static zRem = async (key: string, member: string) => {
    await redis.zRem(key, member);
  };

  static hGetAll = async <T>(key: string) => {
    return (await redis.hGetAll(key)) as T;
  };

  static hSet = async (key: string, data: string[]) => {
    await redis.hSet(key, data);
  };

  static lRange = async <T>(
    key: string,
    start: number,
    end: number
  ): Promise<T[]> => {
    const result = await redis.lRange(key, start, end);
    return result.map((i) => JSON.parse(i));
  };

  static lPush = async <T>(key: string, value: T) => {
    return await redis.lPush(key, JSON.stringify(value));
  };

  static lPushMultiple = async <T>(
    key: string,
    items: T[]
  ): Promise<number> => {
    const serialized = items.map((i) => JSON.stringify(i));
    return await redis.sendCommand(["LPUSH", key, ...serialized]);
  };

  static lRem = async (key: string, count: number, element: string) => {
    await redis.lRem(key, count, element);
  };

  static lTrim = async (key: string, start: number, end: number) => {
    await redis.lTrim(key, start, end);
  };
}
