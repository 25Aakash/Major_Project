const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Content = require('../models/Content');
const Interaction = require('../models/Interaction');
const MLService = require('../services/mlService');

// @route   GET /api/learning/recommendations/:userId
// @desc    Get personalized content recommendations with ML
// @access  Public
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent interactions for ML
    const interactions = await Interaction.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    // Get ML recommendations
    const mlRecommendations = await MLService.getRecommendations(
      user._id.toString(),
      interactions,
      {
        learningStyle: user.learningStyle,
        currentLevel: user.currentLevel,
        neurodiversityType: user.neurodiversityType,
        preferredContentFormat: user.preferredContentFormat
      }
    );

    // Get content based on ML recommendations
    const difficultyRec = mlRecommendations.recommendations?.find(r => r.type === 'difficulty');
    const formatRec = mlRecommendations.recommendations?.find(r => r.type === 'format');

    const query = {
      isActive: true,
      _id: { $nin: user.completedLessons }
    };

    if (difficultyRec) {
      query.difficulty = difficultyRec.value;
    }

    if (formatRec && formatRec.value !== 'mixed') {
      query.format = formatRec.value;
    }

    const recommendations = await Content.find(query)
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
      mlInsights: mlRecommendations.recommendations,
      mlSource: mlRecommendations.source || 'ml-api'
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/learning/adaptive-path/:userId
// @desc    Generate adaptive learning path with ML
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
      .populate('contentId')
      .lean();

    // Calculate average performance
    const avgPerformance = recentInteractions.reduce((sum, int) => 
      sum + (int.performance?.score || 0), 0) / recentInteractions.length || 0;

    // Get ML-powered adaptive difficulty
    const mlDifficulty = await MLService.getAdaptiveDifficulty(
      user._id.toString(),
      recentInteractions.map(i => ({
        score: i.performance?.score || 0,
        completed: i.completionRate >= 100,
        date: i.timestamp
      })),
      getDifficultyForLevel(user.currentLevel)
    );

    const nextDifficulty = mlDifficulty.recommendedLevel || 'beginner';

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
      learningPath,
      mlMetrics: mlDifficulty.metrics,
      mlReasoning: mlDifficulty.reasoning,
      mlConfidence: mlDifficulty.confidence
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

// @route   GET /api/learning/ml-insights/:userId
// @desc    Get AI-powered learning insights
// @access  Public
router.get('/ml-insights/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const interactions = await Interaction.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    const insights = await MLService.getLearningInsights(
      user._id.toString(),
      interactions,
      user.completedLessons
    );

    res.json(insights);
  } catch (error) {
    console.error('ML Insights error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/learning/ml-health
// @desc    Check ML service health
// @access  Public
router.get('/ml-health', async (req, res) => {
  try {
    const health = await MLService.checkHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Helper function
function getDifficultyForLevel(level) {
  if (level <= 2) return 'beginner';
  if (level <= 5) return 'intermediate';
  return 'advanced';
}

module.exports = router;
