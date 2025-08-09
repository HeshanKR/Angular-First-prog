//file: express-backend/config/redisClient.js
require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.UPSTASH_REDIS_URL, // Full URL with token from Upstash
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Connected to Upstash Redis!");
  }
}

module.exports = { redisClient, connectRedis };
// require("dotenv").config();
// const { createClient } = require("redis");

// const redisClient = createClient({
//   url: process.env.UPSTASH_REDIS_URL,
//   password: process.env.UPSTASH_REDIS_TOKEN,
// });

// redisClient.on("error", (err) => console.error("Redis Client Error", err));

// async function connectRedis() {
//   if (!redisClient.isOpen) {
//     await redisClient.connect();
//     console.log("Connected to Upstash Redis!");
//   }
// }

// module.exports = { redisClient, connectRedis };
