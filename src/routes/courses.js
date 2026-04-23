const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', auth, adminOnly, createCourse);
router.put('/:id', auth, adminOnly, updateCourse);
router.delete('/:id', auth, adminOnly, deleteCourse);

module.exports = router;
