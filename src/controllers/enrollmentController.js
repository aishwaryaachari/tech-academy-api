const { Enrollment, Course } = require('../models');

// POST /api/enrollments  (auth required)
const enroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required.' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(409).json({ message: 'You are already enrolled in this course.' });
    }

    const enrollment = await Enrollment.create({ userId, courseId });

    return res.status(201).json({
      message: `Successfully enrolled in "${course.title}".`,
      enrollment,
    });
  } catch (error) {
    console.error('Enroll error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/enrollments/my  (auth required)
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('courseId')
      .sort({ createdAt: -1 });

    // Map courseId to course for backward compatibility with frontend
    const result = enrollments.map(e => {
      const obj = e.toJSON();
      obj.course = obj.courseId;
      delete obj.courseId;
      return obj;
    });

    return res.status(200).json({ enrollments: result });
  } catch (error) {
    console.error('Get enrollments error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/enrollments/:courseId  (auth required — unenroll)
const unenroll = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    return res.status(200).json({ message: 'Successfully unenrolled from course.' });
  } catch (error) {
    console.error('Unenroll error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/enrollments/all  (admin only)
const getAllEnrollments = async (req, res) => {
  try {
    const { User } = require('../models');
    const enrollments = await Enrollment.find()
      .populate('courseId')
      .populate('userId', 'id name email')
      .sort({ createdAt: -1 });

    // Map for backward compatibility
    const result = enrollments.map(e => {
      const obj = e.toJSON();
      obj.course = obj.courseId;
      obj.user = obj.userId;
      delete obj.courseId;
      delete obj.userId;
      return obj;
    });

    return res.status(200).json({ enrollments: result });
  } catch (error) {
    console.error('Get all enrollments error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// PUT /api/enrollments/:courseId/progress
const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be a number between 0 and 100.' });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    enrollment.progress = progress;
    if (progress === 100) enrollment.completedAt = new Date();
    await enrollment.save();

    return res.status(200).json({ message: 'Progress updated.', enrollment });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { enroll, getMyEnrollments, unenroll, getAllEnrollments, updateProgress };
