const pool = require('../config/database');
const Komentar = require('../models/komentarModel');

const getKomentareByKnjigaId = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const komentari = await Komentar.getKomentareByKnjigaId(pool, id);
        if (!komentari) {
            return res.status(404).json({ error: 'Komentari nisu pronađeni.' });
        }
        res.status(200).json(komentari);
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom čitanja komentara.' });
    }
};

const addKomentar = async (req, res) => {
    const {id: knjigaid} = req.params;
    const { komentar } = req.body;

    if (!komentar) {
        return res.status(400).json({ error: 'Morate uneti tekst komentara.' });
    }

    try {
        const korisnikid = req.user.id;
        const newKomentar = await Komentar.addKomentar(pool, { knjigaid, korisnikid, komentar });
        res.status(201).json({ message: 'Komentar je uspešno dodat!', komentar: newKomentar });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                error: 'Već ste uneli komentar za ovu knjigu! Možete prvo obrisati stari pa uneti novi.',
            });
        }
        res.status(500).json({ error: 'Greška prilikom dodavanja komentara.' });
    }
};

const deleteKomentar = async (req, res) => {
    const {id: knjigaid} = req.params;

    try {
        const korisnikid = req.user.id;
        const deletedBook = await Komentar.deleteKomentar(pool, { knjigaid, korisnikid });
        if (!deletedBook) {
            return res.status(404).json({ error: 'Komentar nije pronađen.' });
        }
        res.status(200).json({ message: 'Komentar je uspešno obrisan!' });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom brisanja komentara.' });
    }
};

module.exports = { getKomentareByKnjigaId, addKomentar, deleteKomentar };
