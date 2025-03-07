const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  enrollCourse,
  checkEnrollment,
  getEnrolledCourses,
  getTeacherCourses
} = require('../controllers/courseController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCourses);

// Protected routes
router.use(protect);

// Student routes
router.post('/enroll', authorize('student'), enrollCourse);
router.get('/enrolled', authorize('student'), getEnrolledCourses);
router.get('/enrollment/:courseId', authorize('student'), checkEnrollment);

// Teacher routes
router.post('/', authorize('teacher'), createCourse);
router.get('/teacher/courses', authorize('teacher'), getTeacherCourses);

// This generic route should come last
router.get('/:id', getCourse);

module.exports = router; 