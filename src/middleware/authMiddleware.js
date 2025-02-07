const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Pristup zabranjen. Nema tokena. Morate se ulogovati!' });
    }

    try {
        const isRevoked = await redisClient.get(token);
        if (isRevoked === 'revoked') {
            return res.status(401).json({ error: 'Nevažeći token!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Nevažeći ili istekao token.' });
    }
};

module.exports = { verifyToken };