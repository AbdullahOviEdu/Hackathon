const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Get current student profile
// @route   GET /api/students/me
// @access  Private (Student only)
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('enrolledCourses');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/me
// @access  Private (Student only)
exports.updateStudentProfile = async (req, res) => {
  try {
    const { fullName, grade, school, interests } = req.body;

    // Build update object
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (grade) updateFields.grade = grade;
    if (school) updateFields.school = school;
    if (interests) updateFields.interests = interests;

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Enroll in a course
// @route   POST /api/students/courses/:courseId/enroll
// @access  Private (Student only)
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if student is already enrolled
    const student = await Student.findById(req.user.id);
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add course to student's enrolled courses
    await Student.findByIdAndUpdate(
      req.user.id,
      { $push: { enrolledCourses: courseId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/students/courses/:courseId/enroll
// @access  Private (Student only)
exports.unenrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if student is enrolled
    const student = await Student.findById(req.user.id);
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Remove course from student's enrolled courses
    await Student.findByIdAndUpdate(
      req.user.id,
      { $pull: { enrolledCourses: courseId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get enrolled courses
// @route   GET /api/students/courses
// @access  Private (Student only)
exports.getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('enrolledCourses');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      count: student.enrolledCourses.length,
      data: student.enrolledCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 