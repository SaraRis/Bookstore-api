const pool = require('../config/database');

const getKomentareByKnjigaId = async (pool, id) => {
    const query = 'SELECT * FROM komentar WHERE knjigaid = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows;
};

const addKomentar = async (pool, { knjigaid, korisnikid, komentar }) => {
    const query = `
        INSERT INTO komentar (knjigaid, korisnikid, komentar)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const values = [knjigaid, korisnikid, komentar];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteKomentar = async (pool, { knjigaid, korisnikid }) => {
    const query = 'DELETE FROM komentar WHERE knjigaid = $1 AND korisnikid = $2 RETURNING *';
    const result = await pool.query(query, [knjigaid, korisnikid]);
    return result.rows[0];
};

module.exports = { getKomentareByKnjigaId, addKomentar, deleteKomentar };
