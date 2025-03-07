const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get teacher notifications
// @route   GET /api/teachers/notifications
// @access  Private (Teacher only)
exports.getTeacherNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ teacher: req.user.id })
    .sort('-createdAt')
    .populate('studentId', 'fullName email')
    .populate('courseId', 'title');

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/teachers/notifications/:id/read
// @access  Private (Teacher only)
exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure notification belongs to teacher
  if (notification.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this notification', 401));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Delete notification
// @route   DELETE /api/teachers/notifications/:id
// @access  Private (Teacher only)
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure notification belongs to teacher
  if (notification.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this notification', 401));
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 