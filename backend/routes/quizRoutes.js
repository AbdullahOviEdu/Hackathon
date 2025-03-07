const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { saveQuizResult, getQuizHistory } = require('../controllers/quizController');

// Save quiz result
router.post('/results', protect, saveQuizResult);

// Get quiz history
router.get('/history', protect, getQuizHistory);

module.exports = router; 