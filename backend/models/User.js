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
