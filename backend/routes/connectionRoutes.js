const express = require('express');
const {
  getAllTeachers,
  connectWithTeacher,
  getConnectedTeachers,
  getPendingRequests,
  handleConnectionRequest
} = require('../controllers/connectionController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all teachers
router.get('/teachers', getAllTeachers);

// Student routes
router.post('/connect/:teacherId', authorize('student'), connectWithTeacher);
router.get('/connected', authorize('student'), getConnectedTeachers);

// Teacher routes
router.get('/requests', authorize('teacher'), getPendingRequests);
router.put('/requests/:connectionId', authorize('teacher'), handleConnectionRequest);

module.exports = router; 