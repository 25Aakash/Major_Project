const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Content = require('../models/Content');
const Interaction = require('../models/Interaction');

// @route   GET /api/learning/recommendations/:userId
// @desc    Get personalized content recommendations
// @access  Public
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Basic recommendation logic (will be enhanced with ML)
    const recommendations = await Content.find({
      isActive: true,
      difficulty: getDifficultyForLevel(user.currentLevel),
      format: { $in: user.preferredContentFormat }
    })
    .limit(10)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/learning/adaptive-path/:userId
// @desc    Generate adaptive learning path
// @access  Public
router.get('/adaptive-path/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent interactions for pattern analysis
    const recentInteractions = await Interaction.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('contentId');

    // Calculate average performance
    const avgPerformance = recentInteractions.reduce((sum, int) => 
      sum + (int.performance?.score || 0), 0) / recentInteractions.length || 0;

    // Determine next difficulty level
    let nextDifficulty = 'beginner';
    if (avgPerformance > 80) nextDifficulty = 'advanced';
    else if (avgPerformance > 60) nextDifficulty = 'intermediate';

    // Generate learning path
    const learningPath = await Content.find({
      isActive: true,
      difficulty: nextDifficulty,
      _id: { $nin: user.completedLessons }
    })
    .limit(5)
    .sort({ difficulty: 1 });

    res.json({
      success: true,
      userLevel: user.currentLevel,
      avgPerformance: avgPerformance.toFixed(2),
      recommendedDifficulty: nextDifficulty,
      learningPath
    });
  } catch (error) {
    console.error('Adaptive path error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/learning/complete/:userId/:contentId
// @desc    Mark content as completed
// @access  Public
router.post('/complete/:userId/:contentId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const content = await Content.findById(req.params.contentId);

    if (!user || !content) {
      return res.status(404).json({ message: 'User or content not found' });
    }

    // Add to completed lessons
    if (!user.completedLessons.includes(content._id)) {
      user.completedLessons.push(content._id);
      user.totalPoints += content.points;
      
      // Level up logic
      if (user.totalPoints >= user.currentLevel * 100) {
        user.currentLevel += 1;
      }

      await user.save();
    }

    res.json({
      success: true,
      message: 'Content marked as completed',
      user: {
        currentLevel: user.currentLevel,
        totalPoints: user.totalPoints,
        completedLessons: user.completedLessons.length
      }
    });
  } catch (error) {
    console.error('Complete content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function
function getDifficultyForLevel(level) {
  if (level <= 2) return 'beginner';
  if (level <= 5) return 'intermediate';
  return 'advanced';
}

module.exports = router;
