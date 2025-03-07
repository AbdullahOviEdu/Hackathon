const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    refPath: 'userModel',
    required: true
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher']
  },
  tags: [{
    type: String,
    trim: true
  }],
  answers: [{
    content: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      refPath: 'answers.userModel',
      required: true
    },
    userModel: {
      type: String,
      required: true,
      enum: ['Student', 'Teacher']
    },
    votes: [{
      user: {
        type: mongoose.Schema.ObjectId,
        refPath: 'answers.votes.userModel'
      },
      userModel: {
        type: String,
        required: true,
        enum: ['Student', 'Teacher']
      },
      value: {
        type: Number,
        enum: [-1, 1]
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  votes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      refPath: 'votes.userModel'
    },
    userModel: {
      type: String,
      required: true,
      enum: ['Student', 'Teacher']
    },
    value: {
      type: Number,
      enum: [-1, 1]
    }
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better search performance
QuestionSchema.index({ title: 'text', content: 'text' });

// Virtual for vote count
QuestionSchema.virtual('voteCount').get(function() {
  return this.votes.reduce((total, vote) => total + vote.value, 0);
});

module.exports = mongoose.model('Question', QuestionSchema); 