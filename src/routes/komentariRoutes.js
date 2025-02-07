const express = require('express');
const { getKomentareByKnjigaId, addKomentar, deleteKomentar } = require('../controllers/komentarController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:id', verifyToken, getKomentareByKnjigaId);
router.post('/:id', verifyToken, addKomentar);
router.delete('/:id', verifyToken, deleteKomentar);

module.exports = router;