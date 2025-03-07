const express = require('express');
const { registerTeacher, loginTeacher } = require('../controllers/authController');

const router = express.Router();

// Teacher routes
router.post('/teacher/register', registerTeacher);
router.post('/teacher/login', loginTeacher);

module.exports = router; 