require('dotenv').config();
const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Neuspešno povezivanje sa Redis-om:', err);
    }
})();

redisClient.on('connect', () => {
    console.log('Povezano na Redis server');
});

redisClient.on('error', (err) => console.error('Redis error:', err));

module.exports = redisClient;