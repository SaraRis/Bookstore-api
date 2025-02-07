const express = require('express');
const router = express.Router();
const { getAllNarudzbenice, addNarudzbenica, updateNarudzbenica } = require('../controllers/narudzbenicaController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllNarudzbenice);
router.post('/', verifyToken, addNarudzbenica);
router.put('/:id', verifyToken, updateNarudzbenica);

module.exports = router;
