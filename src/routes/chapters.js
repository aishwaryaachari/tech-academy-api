const express = require('express');
const router = express.Router();
const { getCourseChapters, toggleChapterComplete } = require('../controllers/chapterController');
const { auth, optionalAuth } = require('../middleware/auth');

// GET chapters for a course (optional auth to show completion status)
router.get('/:courseId', optionalAuth, getCourseChapters);

// POST mark a chapter complete/incomplete
router.post('/:chapterId/complete', auth, toggleChapterComplete);

module.exports = router;
