const express = require('express');
const {
  getAllStudents,
  getTeacherProfile,
  updateTeacherProfile
} = require('../controllers/teacherController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected and require teacher role
router.use(protect);
router.use(authorize('teacher'));

// Teacher profile routes
router.get('/me', getTeacherProfile);
router.put('/me', updateTeacherProfile);

// Student management routes
router.get('/students', getAllStudents);

module.exports = router; 