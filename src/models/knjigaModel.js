
const getAllBooks = async (pool) => {
    const query = 'SELECT * FROM knjiga';
    const result = await pool.query(query);
    return result.rows;
};

const getBookById = async (pool, id) => {
    const query = 'SELECT * FROM knjiga WHERE knjigaid = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const addBook = async (pool, { autor, naslov, isbn, cena, kolicina, opis, status, slika }) => {
    const query = `
        INSERT INTO knjiga (autor, naslov, isbn, cena, kolicina, opis, status, slika)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;
    const values = [autor, naslov, isbn, cena, kolicina, opis, status, slika];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateBook = async (pool, id, { autor, naslov, isbn, cena, kolicina, opis, status, slika }) => {
    const query = `
        UPDATE knjiga
        SET autor = $1, naslov = $2, isbn = $3, cena = $4, kolicina = $5, opis = $6, status = $7, slika = $8
        WHERE knjigaid = $9
        RETURNING *`;
    const values = [autor, naslov, isbn, cena, kolicina, opis, status, slika, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteBook = async (pool, id) => {
    const query = 'DELETE FROM knjiga WHERE knjigaid = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };
