const pool = require('../config/database');

const getAllNarudzbenice = async (pool) => {
    const query = `
            SELECT n.*, 
                   json_agg(
                       json_build_object(
                           'rednibroj', s.rednibroj,
                           'kolicina', s.kolicina,
                           'cena', s.cena,
                           'knjigaid', s.knjigaid
                       )
                   ) AS stavke
            FROM narudzbenica n
            LEFT JOIN stavkanarudzbenice s ON n.narudzbenicaid = s.narudzbenicaid
            GROUP BY n.narudzbenicaid
            ORDER BY n.datum
        `;
    const result = await pool.query(query);
    return result.rows;
};

const addNarudzbenica = async (client, { datum, status, korisnikid }) => {
    const query = `
        INSERT INTO narudzbenica (datum, status, korisnikid)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const values = [datum, status, korisnikid];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('Dodavanje narudžbenice nije uspelo.');
    }
    return result.rows[0];
};

const updateNarudzbenica = async (pool, id, { status, ukupnacena, ukupnakolicina  }) => {
    const query = `
        UPDATE narudzbenica 
        SET status = $1, ukupnacena = $2, ukupnakolicina = $3 
        WHERE narudzbenicaid = $4 RETURNING *`;
    const values = [status, ukupnacena, ukupnakolicina, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {getAllNarudzbenice, addNarudzbenica, updateNarudzbenica};