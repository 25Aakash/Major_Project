const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'complete', 'pause', 'resume', 'skip', 'review', 'bookmark', 'feedback'],
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  completionRate: {
    type: Number, // percentage 0-100
    default: 0
  },
  performance: {
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    hints: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }
  },
  emotionalState: {
    type: String,
    enum: ['engaged', 'frustrated', 'confused', 'confident', 'neutral'],
    default: 'neutral'
  },
  focusLevel: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  // ML Features for analysis
  features: {
    clickPattern: { type: [Number], default: [] },
    scrollPattern: { type: [Number], default: [] },
    pauseFrequency: { type: Number, default: 0 },
    revisitCount: { type: Number, default: 0 }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    type: String,
    default: 'unknown'
  }
});

// Index for efficient querying
interactionSchema.index({ userId: 1, timestamp: -1 });
interactionSchema.index({ sessionId: 1 });
interactionSchema.index({ contentId: 1 });

module.exports = mongoose.model('Interaction', interactionSchema);
