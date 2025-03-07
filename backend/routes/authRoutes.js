const express = require('express');
const { 
  registerTeacher, 
  loginTeacher,
  registerStudent,
  loginStudent
} = require('../controllers/authController');

const router = express.Router();

// Teacher routes
router.post('/teacher/register', registerTeacher);
router.post('/teacher/login', loginTeacher);

// Student routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

module.exports = router; 