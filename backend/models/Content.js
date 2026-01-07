const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['math', 'science', 'english', 'history', 'geography', 'programming', 'art', 'music', 'other']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  contentType: {
    type: String,
    enum: ['lesson', 'quiz', 'video', 'interactive', 'reading', 'practice'],
    required: true
  },
  format: {
    type: [String],
    enum: ['text', 'video', 'audio', 'interactive', 'visual', 'game'],
    default: ['text']
  },
  // Adaptive content variations
  variations: [{
    learningStyle: String,
    content: String,
    mediaUrl: String
  }],
  // Accessibility metadata
  accessibility: {
    hasTranscript: { type: Boolean, default: false },
    hasSubtitles: { type: Boolean, default: false },
    hasAudioDescription: { type: Boolean, default: false },
    wcagCompliant: { type: Boolean, default: true }
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  points: {
    type: Number,
    default: 10
  },
  tags: [String],
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

contentSchema.index({ subject: 1, difficulty: 1 });
contentSchema.index({ tags: 1 });

module.exports = mongoose.model('Content', contentSchema);
