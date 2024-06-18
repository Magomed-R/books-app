import { createClient } from 'redis';

const RedisClient = createClient();

RedisClient.on('error', error => console.log('Redis Client Error', error));

RedisClient.connect();

export default RedisClient