const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/teachers/students
// @access  Private (Teacher only)
exports.getAllStudents = async (req, res) => {
  try {
    // Get all students from the database
    const students = await Student.find().select('-password');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get teacher profile
// @route   GET /api/teachers/me
// @access  Private (Teacher only)
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update teacher profile
// @route   PUT /api/teachers/me
// @access  Private (Teacher only)
exports.updateTeacherProfile = async (req, res) => {
  try {
    const { fullName, institution, subject } = req.body;

    // Build update object
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (institution) updateFields.institution = institution;
    if (subject) updateFields.subject = subject;

    const teacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 