const express = require('express');
const { createAllocation, listOfIposOfUser } = require('../controllers/allocation');
const { randomAllocation } = require('../allocate');
const router = express.Router();

router.post('/',createAllocation)
router.get('/listOfIposOfUser',listOfIposOfUser)
router.get('/',randomAllocation)

module.exports = router;