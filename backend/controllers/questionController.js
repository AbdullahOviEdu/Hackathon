const Question = require('../models/Question');

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'fullName')
      .populate('answers.author', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions'
    });
  }
};

// Get single question
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'fullName')
      .populate('answers.author', 'fullName');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question'
    });
  }
};

// Create question
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      category,
      tags,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating question'
    });
  }
};

// Add answer to question
exports.addAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = {
      content: req.body.content,
      author: req.user._id
    };

    question.answers.push(answer);
    await question.save();

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding answer'
    });
  }
};

// Vote question
exports.voteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const { voteType } = req.body; // 'up' or 'down'
    question.votes += voteType === 'up' ? 1 : -1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error voting question'
    });
  }
}; 