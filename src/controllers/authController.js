const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const redisClient = require('../config/redis');

const register = async (req, res) => {
    const { email, password, displayName } = req.body;

    const errorMessage = validacija(email, password, displayName);
    if (errorMessage) {
        return res.status(400).json({ error: errorMessage });
    }

    try {
        const existingUser = await pool.query('SELECT * FROM korisnik WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'E-mail je već registrovan!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO korisnik (email, k_password, displayname) VALUES ($1, $2, $3) RETURNING *',
            [email, hashedPassword, displayName]
        );
        res.status(201).json({ message: 'Korisnik se uspešno registrovao!', user: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Morate uneti email i password!' });
    }

    try {
        const result = await pool.query('SELECT * FROM korisnik WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.k_password))) {
            return res.status(401).json({ error: 'Neispravni kredencijali!' });
        }

        const accessToken = jwt.sign({ id: user.korisnikid }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.korisnikid }, process.env.JWT_SECRET, { expiresIn: '7d' });

        await redisClient.set(refreshToken, user.korisnikid.toString(), 'EX', 30 * 24 * 60 * 60);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    const { accessToken, refreshToken  } = req.body;

    if (!accessToken || !refreshToken) {
        return res.status(400).json({ error: 'Morate uneti oba tokena!' });
    }

    try {
        await redisClient.set(accessToken, 'revoked', 'EX', 15 * 60);
        await redisClient.set(refreshToken, 'revoked', 'EX', 7 * 24 * 60 * 60);

        res.json({ message: 'Uspešno ste se izlogovali!' });
    } catch (error) {
        console.error('Greška prilikom logout-a:', error)
        res.status(500).json({ error: error.message });
    }
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Morate uneti token!' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const storedValue = await redisClient.get(refreshToken);

        if (!storedValue || storedValue === 'revoked') {
            return res.status(401).json({ error: 'Nevažeći ili povučen token' });
        }

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ error: 'Nevažeći token' });
    }
};

const validacija = (email, password, displayName) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return 'Unesite validan email!';
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return 'Password mora imati najmanje 8 karaktera, uključujući slova i brojeve!';
    }

    if (!displayName || displayName.length < 3) {
        return 'Display name mora imati najmanje 3 karaktera!';
    }

    return null;
};

module.exports = { register, login, logout, refresh };