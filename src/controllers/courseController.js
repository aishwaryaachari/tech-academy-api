const { Course, Enrollment } = require('../models');

// GET /api/courses
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    const where = { isPublished: true };

    if (category) where.category = category;
    if (level) where.level = level;

    let courses = await Course.find(where).sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Count total enrolled students
    const enrollmentCount = await Enrollment.countDocuments({ courseId: course.id });

    return res.status(200).json({ course, enrollmentCount });
  } catch (error) {
    console.error('Get course by ID error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/courses  (admin only)
const createCourse = async (req, res) => {
  try {
    const { title, description, instructor, duration, level, category, price, thumbnail, totalLessons } = req.body;

    if (!title || !description || !instructor || !duration || !category) {
      return res.status(400).json({ message: 'Title, description, instructor, duration, and category are required.' });
    }

    const course = await Course.create({
      title, description, instructor, duration,
      level: level || 'Beginner',
      category,
      price: price || 0,
      thumbnail,
      totalLessons: totalLessons || 0,
    });

    return res.status(201).json({ message: 'Course created successfully.', course });
  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// PUT /api/courses/:id  (admin only)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    return res.status(200).json({ message: 'Course updated.', course });
  } catch (error) {
    console.error('Update course error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/courses/:id  (admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    return res.status(200).json({ message: 'Course deleted.' });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
