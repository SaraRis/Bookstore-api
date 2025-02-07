const express = require('express');
const { register, login, logout, refresh } = require('../controllers/authController');
const router = express.Router();
const rateLimit = require('express-rate-limit');

let limiter = rateLimit({
    max: 3,
    windowMs: 15 * 60 *1000,
    message: 'Prekoračili ste dozvoljen broj pokušaja prijave. Pokušate ponovo za 15 minuta.',
    keyGenerator: (req) => req.body.email || req.ip
});

router.post('/register', register);
router.post('/login', limiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;