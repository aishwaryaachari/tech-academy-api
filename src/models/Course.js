const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  instructor: {
    type: String,
    required: [true, 'Instructor is required'],
  },
  duration: {
    type: String, // e.g. "12 hours", "6 weeks"
    required: [true, 'Duration is required'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  price: {
    type: Number,
    default: 0.00,
  },
  thumbnail: {
    type: String, // URL to thumbnail image
  },
  totalLessons: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// For backward compatibility with the existing API which expects 'id'
courseSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

courseSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Course', courseSchema);
