import dotenv from "dotenv";
dotenv.config();
import { Redis } from "@upstash/redis";

const noopRedis = {
  get: async () => null,
  set: async () => {},
  setEx: async () => {},
  del: async () => {},
};

let client = noopRedis;

if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
  const redisClient = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });

  try {
    await redisClient.ping();

    client = {
      isOpen: true,
      get: async (key) => redisClient.get(key),
      set: async (
        key,
        value,
        opts, // ✅ add this
      ) =>
        redisClient.set(
          key,
          typeof value === "string" ? value : JSON.stringify(value),
          opts,
        ),
      setEx: async (key, ttl, value) =>
        redisClient.set(
          key,
          typeof value === "string" ? value : JSON.stringify(value),
          { ex: ttl },
        ),
      del: async (key) => redisClient.del(key),
    };

    console.log("Upstash Redis connected");
  } catch (err) {
    console.warn(
      "Upstash Redis connection failed — API will run without cache:",
      err.message,
    );
  }
} else {
  if (!process.env.REDIS_URL) {
    console.warn("REDIS_URL not set — running without cache");
  }
  if (!process.env.REDIS_TOKEN) {
    console.warn("REDIS_TOKEN not set — running without cache");
  }
}

export default client;
