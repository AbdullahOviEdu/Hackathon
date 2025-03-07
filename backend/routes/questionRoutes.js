const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  voteQuestion,
  voteAnswer
} = require('../controllers/questionController');

// Public routes
router.get('/', getQuestions);
router.get('/:id', getQuestion);

// Protected routes
router.use(protect);

router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

// Answer routes
router.post('/:id/answers', addAnswer);
router.put('/:id/answers/:answerId', updateAnswer);
router.delete('/:id/answers/:answerId', deleteAnswer);

// Voting routes
router.post('/:id/vote', voteQuestion);
router.post('/:id/answers/:answerId/vote', voteAnswer);

module.exports = router; 