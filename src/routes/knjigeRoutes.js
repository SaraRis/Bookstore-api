const express = require('express');
const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/knjigaController');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllBooks);
router.get('/:id', verifyToken, getBookById);
router.post('/', verifyToken, addBook);
router.put('/:id', verifyToken, updateBook);
router.delete('/:id', verifyToken, deleteBook);

module.exports = router;