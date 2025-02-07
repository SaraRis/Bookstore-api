const pool = require('../config/database');
const Knjiga = require('../models/knjigaModel');

const getAllBooks = async (req, res) => {
    try {
        const knjige = await Knjiga.getAllBooks(pool);
        res.status(200).json(knjige);
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom čitanja svih knjiga.' });
    }
};

const getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const knjiga = await Knjiga.getBookById(pool, id);
        if (!knjiga) {
            return res.status(404).json({ error: 'Knjiga nije pronađena.' });
        }
        res.status(200).json(knjiga);
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom čitanja knjige.' });
    }
};

const addBook = async (req, res) => {
    const { autor, naslov, isbn, cena, kolicina, opis, status, slika } = req.body;

    if (!naslov || !autor || !isbn || !cena || !kolicina || !opis || !status || !slika) {
        return res.status(400).json({ error: 'Sva polja moraju biti popunjena.' });
    }

    try {
        const newKnjiga = await Knjiga.addBook(pool, { autor, naslov, isbn, cena, kolicina, opis, status, slika  });
        res.status(201).json({ message: 'Knjiga uspešno dodata!', knjiga: newKnjiga });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom dodavanja knjige.' });
    }
};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const { autor, naslov, isbn, cena, kolicina, opis, status, slika  } = req.body;

    try {
        const updatedKnjiga = await Knjiga.updateBook(pool, id, { autor, naslov, isbn, cena, kolicina, opis, status, slika  });
        if (!updatedKnjiga) {
            return res.status(404).json({ error: 'Knjiga nije pronađena.' });
        }
        res.status(200).json({ message: 'Knjiga uspešno ažurirana!', knjiga: updatedKnjiga });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom ažuriranja knjige.' });
    }
};

const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedKnjiga = await Knjiga.deleteBook(pool, id);
        if (!deletedKnjiga) {
            return res.status(404).json({ error: 'Knjiga nije pronađena.' });
        }
        res.status(200).json({ message: 'Knjiga uspešno obrisana!' });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom brisanja knjige.' });
    }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };
