import { createClient } from "redis";

const { REDIS_URL } = process.env;

const RedisClient = createClient({
    url: REDIS_URL,
});

RedisClient.on("error", (error) => console.log("Redis Client Error", error));

RedisClient.connect();

export default RedisClient;
