const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');

// @route   POST /api/interactions/log
// @desc    Log user interaction (Week 4 feature)
// @access  Public
router.post('/log', async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();

    res.status(201).json({
      success: true,
      message: 'Interaction logged successfully',
      interaction
    });
  } catch (error) {
    console.error('Interaction logging error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/interactions/user/:userId
// @desc    Get user interactions for ML analysis
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { limit = 50, type } = req.query;
    
    const query = { userId: req.params.userId };
    if (type) query.interactionType = type;

    const interactions = await Interaction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('contentId', 'title subject difficulty');

    res.json({
      success: true,
      count: interactions.length,
      interactions
    });
  } catch (error) {
    console.error('Fetch interactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/interactions/analytics/:userId
// @desc    Get interaction analytics for ML
// @access  Public
router.get('/analytics/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Aggregate interaction data
    const analytics = await Interaction.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$interactionType',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          avgCompletionRate: { $avg: '$completionRate' },
          avgFocusLevel: { $avg: '$focusLevel' }
        }
      }
    ]);

    // Get recent emotional states
    const emotionalTrends = await Interaction.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $sort: { timestamp: -1 } },
      { $limit: 20 },
      {
        $group: {
          _id: '$emotionalState',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics,
      emotionalTrends
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
