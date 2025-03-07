const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserCoins, addCoins } = require('../controllers/coinController');

router.get('/', protect, getUserCoins);
router.post('/add', protect, addCoins);

module.exports = router; 