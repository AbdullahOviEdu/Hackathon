const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Connection = require('../models/Connection');

// @desc    Get all teachers
// @route   GET /api/connections/teachers
// @access  Private
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');

    // If the request is from a student, get their connection statuses
    if (req.userRole === 'student') {
      const connections = await Connection.find({ student: req.user.id });
      const teachersWithStatus = teachers.map(teacher => {
        const connection = connections.find(c => c.teacher.toString() === teacher._id.toString());
        return {
          ...teacher.toObject(),
          connectionStatus: connection ? connection.status : null
        };
      });
      return res.status(200).json({
        success: true,
        count: teachersWithStatus.length,
        data: teachersWithStatus
      });
    }

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Send connection request to a teacher
// @route   POST /api/connections/connect/:teacherId
// @access  Private (Student only)
exports.connectWithTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const studentId = req.user.id;

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      student: studentId,
      teacher: teacherId
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already exists'
      });
    }

    // Create connection request
    const connection = await Connection.create({
      student: studentId,
      teacher: teacherId,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get connected teachers (accepted connections)
// @route   GET /api/connections/connected
// @access  Private (Student only)
exports.getConnectedTeachers = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Find all accepted connections for the student
    const connections = await Connection.find({ 
      student: studentId,
      status: 'accepted'
    });
    const teacherIds = connections.map(connection => connection.teacher);

    // Get teacher details
    const teachers = await Teacher.find({
      _id: { $in: teacherIds }
    }).select('-password');

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get pending connection requests for a teacher
// @route   GET /api/connections/requests
// @access  Private (Teacher only)
exports.getPendingRequests = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Find all pending connections
    const connections = await Connection.find({ 
      teacher: teacherId,
      status: 'pending'
    }).populate('student', 'fullName email grade school');

    res.status(200).json({
      success: true,
      count: connections.length,
      data: connections
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Accept or reject connection request
// @route   PUT /api/connections/requests/:connectionId
// @access  Private (Teacher only)
exports.handleConnectionRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }

    const connection = await Connection.findById(req.params.connectionId);
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Verify that the teacher is handling their own request
    if (connection.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to handle this request'
      });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({
      success: true,
      message: `Connection request ${status}`,
      data: connection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 