const express = require('express');
const {
  createCourse,
  getCourses,
  getTeacherCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes (teacher only)
router.post('/', protect, authorize('teacher'), createCourse);
router.get('/teacher/courses', protect, authorize('teacher'), getTeacherCourses);
router.put('/:id', protect, authorize('teacher'), updateCourse);
router.delete('/:id', protect, authorize('teacher'), deleteCourse);

module.exports = router; 