"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
//Creating redis client
const redisClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);
exports.default = redisClient;
