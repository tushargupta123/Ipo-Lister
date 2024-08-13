const express = require('express');
const router = express.Router();
const { createIpo, updateIpo, deleteIpo, getAllIpo, getIpo } = require('../controllers/ipo');
const isAdmin = require('../middlewares/admin');

router.post('/',isAdmin,createIpo)
router.patch('/',isAdmin,updateIpo)
router.get('/',getAllIpo)
router.get('/:id',getIpo)
router.delete('/',isAdmin,deleteIpo)

module.exports = router;