const mongoose = require('mongoose');

const chapterCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate completions
chapterCompletionSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

// For backward compatibility with the existing API which expects 'id'
chapterCompletionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

chapterCompletionSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('ChapterCompletion', chapterCompletionSchema);
