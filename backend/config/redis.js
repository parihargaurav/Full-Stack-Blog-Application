import { createClient } from "redis";

const noopRedis = {
  isOpen: false,
  get: async () => null,
  setEx: async () => {},
  del: async () => {},
};

let client = noopRedis;

if (process.env.REDIS_URL) {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => console.error("Redis error:", err));

  try {
    await redisClient.connect();
    client = redisClient;
    console.log("Redis connected");
  } catch (err) {
    console.warn(
      "Redis connection failed — API will run without cache:",
      err.message,
    );
  }
} else {
  console.warn("REDIS_URL not set — running without cache");
}

export default client;
