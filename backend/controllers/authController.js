const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a teacher
// @route   POST /api/auth/teacher/register
// @access  Public
exports.registerTeacher = async (req, res) => {
  try {
    const { fullName, email, password, institution, subject } = req.body;

    // Check if teacher already exists
    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      fullName,
      email,
      password,
      institution,
      subject
    });

    // Generate token
    const token = generateToken(teacher._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        id: teacher._id,
        fullName: teacher.fullName,
        email: teacher.email,
        institution: teacher.institution,
        subject: teacher.subject
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Login teacher
// @route   POST /api/auth/teacher/login
// @access  Public
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email }).select('+password');

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await teacher.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(teacher._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: teacher._id,
        fullName: teacher.fullName,
        email: teacher.email,
        institution: teacher.institution,
        subject: teacher.subject
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 