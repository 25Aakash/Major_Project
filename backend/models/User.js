const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent', 'admin'],
    default: 'student'
  },
  // Neurodiversity Profile
  neurodiversityType: {
    type: [String],
    enum: ['adhd', 'autism', 'dyslexia', 'dyscalculia', 'dysgraphia', 'other', 'none'],
    default: ['none']
  },
  // Learning Preferences
  learningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'kinesthetic', 'reading-writing', 'mixed'],
    default: 'mixed'
  },
  preferredContentFormat: {
    type: [String],
    enum: ['text', 'video', 'audio', 'interactive', 'visual'],
    default: ['text']
  },
  // Accessibility Settings
  accessibilitySettings: {
    fontSize: { type: String, default: 'medium' },
    fontFamily: { type: String, default: 'OpenDyslexic' },
    colorScheme: { type: String, default: 'light' },
    textToSpeech: { type: Boolean, default: false },
    reducedAnimations: { type: Boolean, default: false },
    focusMode: { type: Boolean, default: false }
  },
  // Progress Tracking
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  currentLevel: {
    type: Number,
    default: 1
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  // AI Adaptive Features - Learning Rhythm (Feature #5)
  learningRhythm: {
    optimalStudyDuration: { type: Number, default: 30 }, // minutes
    bestTimeOfDay: { type: String, default: 'evening' }, // morning/afternoon/evening/night
    preferredBreakInterval: { type: Number, default: 25 }, // minutes (Pomodoro-style)
    averageAttentionSpan: { type: Number, default: 20 }, // minutes, auto-calculated
    lastCalculated: { type: Date, default: Date.now }
  },
  // Progressive Skill Mapping (Feature #11)
  skillMastery: {
    type: Map,
    of: {
      masteryLevel: { type: Number, default: 0 }, // 0-1 scale
      lastPracticed: { type: Date, default: Date.now },
      practiceCount: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    default: new Map()
  },
  // Gamification Adaptation (Feature #12)
  gamificationPreferences: {
    respondsToAchievements: { type: Boolean, default: true },
    respondsToPoints: { type: Boolean, default: true },
    respondsToLeaderboards: { type: Boolean, default: false },
    respondsToStreaks: { type: Boolean, default: true },
    preferredRewardType: { type: String, enum: ['badges', 'points', 'levels', 'collaborative'], default: 'points' },
    engagementScore: { type: Number, default: 0.5 } // How much they interact with gamification
  },
  // Behavioral Patterns (Feature #1)
  behaviorPatterns: {
    averageSessionDuration: { type: Number, default: 0 }, // minutes
    tabSwitchFrequency: { type: Number, default: 0 }, // per hour
    pauseFrequency: { type: Number, default: 0 }, // per content item
    rewindFrequency: { type: Number, default: 0 },
    averageReadingSpeed: { type: Number, default: 200 }, // words per minute
    averageVideoSpeed: { type: Number, default: 1.0 }, // playback speed
    distractionScore: { type: Number, default: 0 }, // 0-1, higher = more distracted
    lastUpdated: { type: Date, default: Date.now }
  },
  // Neurodiversity Adaptations (Feature #7)
  detectedPatterns: {
    showsAdhdPatterns: { type: Boolean, default: false },
    showsDyslexiaPatterns: { type: Boolean, default: false },
    showsAutismPatterns: { type: Boolean, default: false },
    confidenceScore: { type: Number, default: 0 },
    lastDetected: { type: Date, default: Date.now }
  },
  // Performance Predictions (Feature #6)
  performanceMetrics: {
    predictedNextScore: { type: Number, default: 0 },
    improvementRate: { type: Number, default: 0 }, // percentage
    strugglingAreas: [{ type: String }],
    strengths: [{ type: String }],
    optimalDifficulty: { type: String, default: 'beginner' },
    lastCalculated: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
