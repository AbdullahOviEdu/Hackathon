const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserCoins, addCoins, deductCoins } = require('../controllers/coinController');

router.get('/', protect, getUserCoins);
router.post('/add', protect, addCoins);
router.post('/deduct', protect, deductCoins);

module.exports = router; 