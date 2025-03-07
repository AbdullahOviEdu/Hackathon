const express = require('express');
const {
  getStudentProfile,
  updateStudentProfile,
  enrollCourse,
  unenrollCourse,
  getEnrolledCourses
} = require('../controllers/studentController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected and require student role
router.use(protect);
router.use(authorize('student'));

// Student profile routes
router.get('/me', getStudentProfile);
router.put('/me', updateStudentProfile);

// Course enrollment routes
router.get('/courses', getEnrolledCourses);
router.post('/courses/:courseId/enroll', enrollCourse);
router.delete('/courses/:courseId/enroll', unenrollCourse);

module.exports = router; 