const express = require('express');
const { 
  getQuestions,
  getQuestion,
  createQuestion,
  addAnswer,
  voteQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getQuestions);
router.get('/:id', getQuestion);

// Protected routes
router.post('/', protect, createQuestion);
router.post('/:id/answers', protect, addAnswer);
router.post('/:id/vote', protect, voteQuestion);

module.exports = router; 