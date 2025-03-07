const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is a teacher
    let user = await Teacher.findById(decoded.id);
    let role = 'teacher';

    // If not a teacher, check if user is a student
    if (!user) {
      user = await Student.findById(decoded.id);
      role = 'student';
    }

    // If user not found in either collection
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user and role to request
    req.user = user;
    req.userRole = role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.userRole)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Role ${req.userRole} is not authorized to access this route`
      });
    }
  };
}; 