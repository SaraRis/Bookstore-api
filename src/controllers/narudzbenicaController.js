const pool = require('../config/database');
const Narudzbenica = require('../models/narudzbenicaModel');
const StavkaNarudzbenice = require('../models/stavkaNarudzbeniceModel');

const getAllNarudzbenice = async (req, res) => {
    try {
        const narudzbenice = await Narudzbenica.getAllNarudzbenice(pool);
        res.json({ narudzbenice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNarudzbenica = async (req, res) => {
    const { stavke } = req.body;

    if (!stavke) {
        return res.status(400).json({ error: 'Morate uneti stavke!' });
    }

    const datum = new Date();
    const status = 'Neobradjena';
    const korisnikid = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const narudzbenica = await Narudzbenica.addNarudzbenica(client, {datum, status, korisnikid});

        if (stavke && stavke.length > 0) {
            for (let i = 0; i < stavke.length; i++) {
                const { kolicina, knjigaid } = stavke[i];
                await StavkaNarudzbenice.addStavkaNarudzbenice(client,
                {
                    narudzbenicaid: narudzbenica.narudzbenicaid,
                    rednibroj: i + 1,
                    kolicina,
                    knjigaid
                });
            }
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Narudzbenica je uspešno kreirana!', narudzbenica });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Greška prilikom kreiranja narudžbenice:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release(); 
    }
};

const updateNarudzbenica = async (req, res) => {
    const { id } = req.params;
    const { status, ukupnacena, ukupnakolicina} = req.body;

    try {
        const updatedNarudzbenica = await Narudzbenica.updateNarudzbenica(pool, id, { status, ukupnacena, ukupnakolicina });
        if (!updatedNarudzbenica) {
            return res.status(404).json({ error: 'Narudžbenica nije pronađena.' });
        }

        res.json({ message: 'Narudžbenica je uspešno ažurirana!', updatedNarudzbenica });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom ažuriranja narudžbenice.' });
    }
};

module.exports = { getAllNarudzbenice, addNarudzbenica, updateNarudzbenica };
