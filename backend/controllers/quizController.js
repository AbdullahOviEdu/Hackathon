const QuizResult = require('../models/QuizResult');
const UserCoins = require('../models/UserCoins');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Save quiz result
const saveQuizResult = async (req, res) => {
  try {
    const { difficulty, score, totalQuestions, date } = req.body;
    const userId = req.user._id;
    const userModel = req.user.role === 'teacher' ? 'Teacher' : 'Student';

    // Save quiz result
    const quizResult = await QuizResult.create({
      userId,
      difficulty,
      score,
      totalQuestions,
      coinsEarned: score, // Each correct answer earns 1 coin
      date: date || new Date()
    });

    // Update user's coins
    let userCoins = await UserCoins.findOne({ userId });
    if (!userCoins) {
      userCoins = await UserCoins.create({ 
        userId, 
        userModel,
        coins: score 
      });
    } else {
      userCoins.coins += score;
      userCoins.lastUpdated = new Date();
      await userCoins.save();
    }

    res.status(201).json({
      success: true,
      data: quizResult,
      coins: userCoins.coins
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get quiz history for a user
const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const quizResults = await QuizResult.find({ userId }).sort({ date: -1 });

    res.json({
      success: true,
      data: quizResults
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  saveQuizResult,
  getQuizHistory
}; 