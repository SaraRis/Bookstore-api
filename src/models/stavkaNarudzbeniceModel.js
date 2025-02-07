const pool = require('../config/database');


const addStavkaNarudzbenice = async (client, { narudzbenicaid, rednibroj, kolicina, knjigaid }) => {
    const query = `
        INSERT INTO stavkanarudzbenice (narudzbenicaid, rednibroj, kolicina, knjigaid)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
    const values = [narudzbenicaid, rednibroj, kolicina, knjigaid];
    const result = await client.query(query, values);
    return result.rows[0];
};

module.exports = { addStavkaNarudzbenice };
