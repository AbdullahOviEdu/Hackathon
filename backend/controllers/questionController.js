const Question = require('../models/Question');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find()
    .populate('user', 'fullName')
    .populate('answers.user', 'fullName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions
  });
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id)
    .populate('user', 'fullName')
    .populate('answers.user', 'fullName');

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const question = await Question.create(req.body);

  res.status(201).json({
    success: true,
    data: question
  });
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  let question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is question owner
  if (question.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this question`, 401));
  }

  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is question owner
  if (question.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this question`, 401));
  }

  await question.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add answer to question
// @route   POST /api/questions/:id/answers
// @access  Private
exports.addAnswer = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  const answer = {
    content: req.body.content,
    user: req.user.id
  };

  question.answers.push(answer);
  await question.save();

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Update answer
// @route   PUT /api/questions/:id/answers/:answerId
// @access  Private
exports.updateAnswer = asyncHandler(async (req, res, next) => {
  let question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  const answer = question.answers.id(req.params.answerId);

  if (!answer) {
    return next(new ErrorResponse(`Answer not found with id of ${req.params.answerId}`, 404));
  }

  // Make sure user is answer owner
  if (answer.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this answer`, 401));
  }

  answer.content = req.body.content;
  await question.save();

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Delete answer
// @route   DELETE /api/questions/:id/answers/:answerId
// @access  Private
exports.deleteAnswer = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  const answer = question.answers.id(req.params.answerId);

  if (!answer) {
    return next(new ErrorResponse(`Answer not found with id of ${req.params.answerId}`, 404));
  }

  // Make sure user is answer owner
  if (answer.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this answer`, 401));
  }

  answer.remove();
  await question.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Vote on question
// @route   POST /api/questions/:id/vote
// @access  Private
exports.voteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  const vote = req.body.vote; // 1 for upvote, -1 for downvote
  const userId = req.user.id;

  // Check if user has already voted
  const existingVote = question.votes.find(v => v.user.toString() === userId);

  if (existingVote) {
    if (existingVote.value === vote) {
      // Remove vote if clicking same button
      question.votes = question.votes.filter(v => v.user.toString() !== userId);
    } else {
      // Change vote if clicking different button
      existingVote.value = vote;
    }
  } else {
    // Add new vote
    question.votes.push({ user: userId, value: vote });
  }

  await question.save();

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Vote on answer
// @route   POST /api/questions/:id/answers/:answerId/vote
// @access  Private
exports.voteAnswer = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
  }

  const answer = question.answers.id(req.params.answerId);

  if (!answer) {
    return next(new ErrorResponse(`Answer not found with id of ${req.params.answerId}`, 404));
  }

  const vote = req.body.vote; // 1 for upvote, -1 for downvote
  const userId = req.user.id;

  // Check if user has already voted
  const existingVote = answer.votes.find(v => v.user.toString() === userId);

  if (existingVote) {
    if (existingVote.value === vote) {
      // Remove vote if clicking same button
      answer.votes = answer.votes.filter(v => v.user.toString() !== userId);
    } else {
      // Change vote if clicking different button
      existingVote.value = vote;
    }
  } else {
    // Add new vote
    answer.votes.push({ user: userId, value: vote });
  }

  await question.save();

  res.status(200).json({
    success: true,
    data: question
  });
}); 