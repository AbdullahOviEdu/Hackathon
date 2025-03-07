const express = require('express');
const {
  getAllStudents,
  getTeacherProfile,
  updateTeacherProfile
} = require('../controllers/teacherController');

const {
  getTeacherNotifications,
  markNotificationAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected and require teacher role
router.use(protect);
router.use(authorize('teacher'));

// Teacher profile routes
router.get('/profile', getTeacherProfile);
router.put('/profile', updateTeacherProfile);

// Student management routes
router.get('/students', getAllStudents);

// Notification routes
router.get('/notifications', getTeacherNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.delete('/notifications/:id', deleteNotification);

module.exports = router; 