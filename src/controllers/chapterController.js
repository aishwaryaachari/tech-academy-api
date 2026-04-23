const { Chapter, ChapterCompletion, Enrollment, Course } = require('../models');

// GET /api/chapters/:courseId — get all chapters for a course with user's completion status
const getCourseChapters = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    const chapters = await Chapter.find({ courseId }).sort({ order: 1 });

    // If authenticated, fetch completions
    let completedIds = new Set();
    if (userId) {
      const completions = await ChapterCompletion.find({ userId, courseId });
      completedIds = new Set(completions.map(c => c.chapterId.toString()));
    }

    const result = chapters.map(ch => ({
      ...ch.toJSON(),
      completed: completedIds.has(ch.id.toString()),
    }));

    return res.status(200).json({ chapters: result });
  } catch (error) {
    console.error('Get chapters error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/chapters/:chapterId/complete — mark a chapter complete/incomplete
const toggleChapterComplete = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.id;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found.' });

    const courseId = chapter.courseId;

    // Check enrolled
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.status(403).json({ message: 'You are not enrolled in this course.' });

    const existing = await ChapterCompletion.findOne({ userId, chapterId });

    if (existing) {
      // Toggle off
      await existing.deleteOne();
    } else {
      // Toggle on
      await ChapterCompletion.create({ userId, courseId, chapterId });
    }

    // Recalculate progress
    const totalChapters = await Chapter.countDocuments({ courseId });
    const completedChapters = await ChapterCompletion.countDocuments({ userId, courseId });

    const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    // Update enrollment progress
    enrollment.progress = progress;
    if (progress === 100) enrollment.completedAt = new Date();
    else enrollment.completedAt = null;
    await enrollment.save();

    return res.status(200).json({
      completed: !existing,
      progress,
      completedChapters,
      totalChapters,
    });
  } catch (error) {
    console.error('Toggle chapter error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getCourseChapters, toggleChapterComplete };
