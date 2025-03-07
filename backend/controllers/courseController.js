const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher only)
exports.createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, thumbnail, grade, duration } = req.body;
  
  // Get teacher ID from authenticated user
  const teacherId = req.user.id;
  
  // Create course
  const course = await Course.create({
    title,
    description,
    thumbnail,
    grade,
    duration,
    teacher: teacherId
  });

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find().populate('teacher', 'fullName institution subject');
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get courses by teacher
// @route   GET /api/courses/teacher
// @access  Private (Teacher only)
exports.getTeacherCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ teacher: req.user.id });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('teacher', 'fullName institution subject');

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher only)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is the course owner
    if (course.teacher.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is the course owner
    if (course.teacher.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
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
// @route   POST /api/courses/enroll
// @access  Private (Student only)
exports.enrollCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;
  const studentId = req.user.id;

  const course = await Course.findById(courseId).populate('teacher', 'fullName');
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${courseId}`, 404));
  }

  // Check if student is already enrolled
  if (course.enrolledStudents.includes(studentId)) {
    return next(new ErrorResponse('Already enrolled in this course', 400));
  }

  // Add student to course
  course.enrolledStudents.push(studentId);
  await course.save();

  // Get student details
  const student = await Student.findById(studentId).select('fullName');

  // Create notification for teacher
  await Notification.create({
    teacher: course.teacher._id,
    type: 'enrollment',
    title: 'New Course Enrollment',
    message: `${student.fullName} has enrolled in your course: ${course.title}`,
    courseId: course._id,
    studentId: studentId
  });

  res.status(200).json({
    success: true,
    message: 'Successfully enrolled in course'
  });
});

// @desc    Check enrollment status
// @route   GET /api/courses/enrollment/:courseId
// @access  Private (Student only)
exports.checkEnrollment = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  const studentId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${courseId}`, 404));
  }

  const isEnrolled = course.enrolledStudents.includes(studentId);

  res.status(200).json({
    success: true,
    isEnrolled
  });
});

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private (Student only)
exports.getEnrolledCourses = asyncHandler(async (req, res, next) => {
  console.log('getEnrolledCourses called');
  console.log('User:', req.user);
  console.log('User role:', req.user.role);

  const courses = await Course.find({
    enrolledStudents: req.user.id
  }).populate({
    path: 'teacher',
    select: 'fullName institution subject'
  });

  console.log('Fetching enrolled courses for student:', req.user.id);
  console.log('Found courses:', courses);

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
}); 