import { createClient, SetOptions } from "redis";
import config from "../config";
import { errorLogger, infoLogger } from "./logger";

const redisClient = createClient({
  url: config.redis.url,
});
const redisPubClient = createClient({
  url: config.redis.url,
});
const redisSubClient = createClient({
  url: config.redis.url,
});

redisClient.on("error", err =>
  errorLogger.error("Failed to connect to redis", err),
);
redisClient.on("connect", () =>
  infoLogger.info("Successfully connect with redis"),
);

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const set = async (
  key: string,
  value: string,
  options?: SetOptions,
): Promise<void> => {
  await redisClient.set(key, value, options);
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};
const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `accessToken:${userId}`;
  const expiresTime = Number(config.redis.access_token_expires_in) || 10000;
  await redisClient.set(key, token, { EX: expiresTime });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `accessToken:${userId}`;
  return await redisClient.get(key);
};

const deleteAccessToken = async (userId: string): Promise<void> => {
  const key = `accessToken:${userId}`;
  await redisClient.del(key);
};

const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

export const RedisClient = {
  connect,
  set,
  get,
  del,
  getAccessToken,
  deleteAccessToken,
  disconnect,
  setAccessToken,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
