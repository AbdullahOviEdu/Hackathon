const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  slides: {
    type: [{
      image: {
        type: String,
        required: [true, 'Please add an image URL for the slide']
      },
      description: {
        type: String,
        required: [true, 'Please add a description for the slide'],
        minlength: [300, 'Description must be at least 300 words'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
      }
    }],
    validate: {
      validator: function(v) {
        return v.length === 3;
      },
      message: 'Course must have exactly 3 slides'
    },
    required: [true, 'Please add three slides']
  },
  thumbnail: {
    type: String,
    required: [true, 'Please add a thumbnail URL']
  },
  grade: {
    type: String,
    required: [true, 'Please add a grade level'],
    enum: ['Elementary', 'Middle School', 'High School', 'College']
  },
  duration: {
    type: String,
    required: [true, 'Please add course duration']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  meetingLink: {
    type: String
  },
  time: {
    type: String
  },
  day: {
    type: String
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for number of students
CourseSchema.virtual('students').get(function() {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Set virtuals to true when converting to JSON
CourseSchema.set('toJSON', { virtuals: true });
CourseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', CourseSchema); 