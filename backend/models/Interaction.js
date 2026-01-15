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
  // Real-time Behavioral Tracking (Feature #1)
  behaviorMetrics: {
    mouseMovements: { type: Number, default: 0 }, // Total mouse movement distance
    heatmapData: [{ x: Number, y: Number, intensity: Number }], // Click heatmap
    scrollVelocity: { type: Number, default: 0 }, // Pixels per second
    idleTime: { type: Number, default: 0 }, // Seconds of inactivity
    activeEngagementTime: { type: Number, default: 0 }, // Actual active time
    tabSwitches: { type: Number, default: 0 },
    windowBlurs: { type: Number, default: 0 }, // Times window lost focus
    copyPasteCount: { type: Number, default: 0 }
  },
  // Video/Audio Specific Tracking (Feature #1)
  mediaMetrics: {
    pausePoints: [{ timestamp: Number, duration: Number }], // When and how long paused
    rewindCount: { type: Number, default: 0 },
    fastForwardCount: { type: Number, default: 0 },
    playbackSpeedChanges: [{ speed: Number, timestamp: Number }],
    volumeChanges: { type: Number, default: 0 },
    seekCount: { type: Number, default: 0 }, // Manual timeline seeking
    averagePlaybackSpeed: { type: Number, default: 1.0 },
    completionPoints: [{ type: Number }] // Percentages where user stopped
  },
  // Session Metrics (Feature #1)
  sessionMetrics: {
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    totalIdleTime: { type: Number, default: 0 },
    peakFocusTime: { type: Date },
    lowestFocusTime: { type: Date },
    averageResponseTime: { type: Number, default: 0 }, // For interactive content
    errorCount: { type: Number, default: 0 },
    helpRequestCount: { type: Number, default: 0 }
  },
  // Attention & Comprehension Signals (Feature #1, #7)
  attentionMetrics: {
    attentionSpan: { type: Number, default: 0 }, // Calculated for this session (minutes)
    focusLevelTimeline: [{ timestamp: Date, level: Number }], // Focus over time
    distractionEvents: [{ timestamp: Date, type: String, duration: Number }],
    comprehensionSignals: {
      repeatViews: { type: Number, default: 0 },
      slowReadingIndicators: { type: Number, default: 0 },
      confusionPatterns: { type: Number, default: 0 } // Rapid back/forth, multiple pauses
    }
  },
  // Adaptive Difficulty Tracking (Feature #2)
  adaptiveMetrics: {
    suggestedDifficulty: { type: String, enum: ['easier', 'same', 'harder'], default: 'same' },
    struggleIndicators: { type: Number, default: 0 }, // 0-10 scale
    confidenceLevel: { type: Number, default: 5 }, // 1-10 scale
    wasAdapted: { type: Boolean, default: false },
    adaptationType: { type: String } // 'difficulty', 'format', 'pace'
  },
  // Intervention Tracking
  interventions: [{
    type: { type: String }, // 'break-suggestion', 'difficulty-change', 'format-switch'
    timestamp: { type: Date },
    accepted: { type: Boolean },
    impact: { type: String } // 'positive', 'negative', 'neutral'
  }],
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
