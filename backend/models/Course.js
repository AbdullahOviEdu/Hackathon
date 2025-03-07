const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
    trim: true
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail URL'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Please provide a grade level'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Please provide course duration'],
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema); 