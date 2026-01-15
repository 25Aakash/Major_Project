const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Interaction = require('../models/Interaction');
const MLService = require('../services/mlService');

// @route   POST /api/interventions/check
// @desc    Check if intervention is needed based on current session
// @access  Public
router.post('/check', async (req, res) => {
  try {
    const { userId, currentSession } = req.body;

    // Get recent interaction history
    const interactionHistory = await Interaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    // Check for struggle
    const struggleData = await MLService.detectStruggle(currentSession, interactionHistory);

    // Check for break needed
    const user = await User.findById(userId);
    const breakData = await MLService.getOptimalBreakTime(
      currentSession,
      user?.learningRhythm || {}
    );

    // Determine intervention priority
    let intervention = null;
    
    if (breakData.needsBreak && breakData.urgency === 'high') {
      intervention = {
        type: 'break',
        priority: 'high',
        message: breakData.message,
        action: 'take_break',
        data: breakData
      };
    } else if (struggleData.isStruggling && struggleData.struggleLevel === 'high') {
      intervention = {
        type: 'struggle',
        priority: 'high',
        message: 'Having trouble? Let\'s try a different approach',
        action: 'offer_help',
        suggestions: struggleData.suggestedInterventions,
        data: struggleData
      };
    } else if (struggleData.isStruggling && struggleData.struggleLevel === 'moderate') {
      intervention = {
        type: 'struggle',
        priority: 'medium',
        message: 'Need some hints?',
        action: 'offer_hints',
        suggestions: struggleData.suggestedInterventions,
        data: struggleData
      };
    } else if (breakData.needsBreak && breakData.urgency === 'medium') {
      intervention = {
        type: 'break',
        priority: 'medium',
        message: breakData.message,
        action: 'suggest_break',
        data: breakData
      };
    }

    res.json({
      success: true,
      needsIntervention: intervention !== null,
      intervention,
      struggleData,
      breakData
    });

  } catch (error) {
    console.error('Intervention check error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/interventions/respond
// @desc    Log user response to intervention
// @access  Public
router.post('/respond', async (req, res) => {
  try {
    const { userId, sessionId, interventionType, accepted, impact } = req.body;

    // Update the interaction with intervention response
    await Interaction.findOneAndUpdate(
      { userId, sessionId },
      {
        $push: {
          interventions: {
            type: interventionType,
            timestamp: new Date(),
            accepted,
            impact: impact || 'neutral'
          }
        }
      }
    );

    // Update user's behavioral patterns based on response
    if (interventionType === 'break' && accepted) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'behaviorPatterns.averageSessionDuration': -5 } // Adjust preferences
      });
    }

    res.json({
      success: true,
      message: 'Intervention response recorded'
    });

  } catch (error) {
    console.error('Intervention response error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/interventions/adaptive-content
// @desc    Get adaptive content suggestions based on struggle
// @access  Public
router.post('/adaptive-content', async (req, res) => {
  try {
    const { userId, currentContentId, struggleIndicators } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const suggestions = [];

    // If struggling with current difficulty
    if (struggleIndicators.includes('high_error_rate') || 
        struggleIndicators.includes('below_average_performance')) {
      suggestions.push({
        type: 'difficulty_adjustment',
        action: 'switch_to_easier',
        message: 'Try an easier version of this lesson',
        contentDifficulty: 'beginner'
      });
    }

    // If high pause frequency - might prefer different format
    if (struggleIndicators.includes('high_pause_frequency') || 
        struggleIndicators.includes('multiple_rewinds')) {
      const alternativeFormat = user.learningStyle === 'visual' ? 'video' : 
                               user.learningStyle === 'auditory' ? 'audio' :
                               'interactive';
      
      suggestions.push({
        type: 'format_change',
        action: 'switch_format',
        message: `This might work better as a ${alternativeFormat}`,
        suggestedFormat: alternativeFormat
      });
    }

    // If excessive time spent
    if (struggleIndicators.includes('excessive_time')) {
      suggestions.push({
        type: 'prerequisite_review',
        action: 'review_basics',
        message: 'Review the basics first',
        suggestedAction: 'show_prerequisites'
      });
    }

    res.json({
      success: true,
      suggestions,
      currentDifficulty: 'intermediate', // Get from content
      userPreferences: {
        learningStyle: user.learningStyle,
        preferredFormat: user.preferredContentFormat
      }
    });

  } catch (error) {
    console.error('Adaptive content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/interventions/personalized-tips/:userId
// @desc    Get personalized learning tips based on patterns
// @access  Public
router.get('/personalized-tips/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tips = [];

    // Based on learning rhythm
    if (user.learningRhythm?.bestTimeOfDay) {
      tips.push({
        type: 'rhythm',
        icon: '⏰',
        message: `You learn best in the ${user.learningRhythm.bestTimeOfDay}`,
        action: 'Schedule your toughest lessons then'
      });
    }

    // Based on attention span
    if (user.learningRhythm?.averageAttentionSpan < 20) {
      tips.push({
        type: 'pacing',
        icon: '🎯',
        message: 'Your focus peaks around 15 minutes',
        action: 'Try micro-learning sessions'
      });
    }

    // Based on detected patterns
    if (user.detectedPatterns?.showsAdhdPatterns) {
      tips.push({
        type: 'neurodiversity',
        icon: '✨',
        message: 'Interactive content works best for you',
        action: 'Choose hands-on activities'
      });
    }

    // Based on performance metrics
    if (user.performanceMetrics?.strengths?.length > 0) {
      tips.push({
        type: 'strength',
        icon: '💪',
        message: `You excel at: ${user.performanceMetrics.strengths.slice(0, 2).join(', ')}`,
        action: 'Build on these strengths'
      });
    }

    // Based on gamification preferences
    if (user.gamificationPreferences?.respondsToStreaks) {
      tips.push({
        type: 'motivation',
        icon: '🔥',
        message: 'Keep your learning streak alive!',
        action: 'Study for just 10 minutes today'
      });
    }

    res.json({
      success: true,
      tips: tips.slice(0, 5), // Return top 5 tips
      personalizedFor: user.name
    });

  } catch (error) {
    console.error('Personalized tips error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
