const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6380", {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    },
})

//Connection Events 

redis.on("connect", () => {
    console.log("Redis Connected Successfully on Port (6380)")
})
redis.on("error", (err) => {
    console.warn("Redis Error,Mongodb Will Handle Requests", err.message)
})

module.exports = redis;