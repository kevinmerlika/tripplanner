import { createClient } from 'redis';
//Creating redis client
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);
export default redisClient;