const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const knjigeRoutes = require('./routes/knjigeRoutes');
const narudzbeniceRoutes = require('./routes/narudzbenicaRoutes');
const komentariRoutes = require('./routes/komentariRoutes');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dobrodošli u API knjižare!');
});

// API rute
app.use('/api/auth', authRoutes);
app.use('/api/knjige', knjigeRoutes);
app.use('/api/narudzbenice', narudzbeniceRoutes);
app.use('/api/komentari', komentariRoutes);

module.exports = app;
