const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: String, // e.g. "12 min"
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// For backward compatibility with the existing API which expects 'id'
chapterSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

chapterSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Chapter', chapterSchema);
