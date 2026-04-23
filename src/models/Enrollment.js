const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// For backward compatibility with the existing API which expects 'id'
enrollmentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

enrollmentSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
