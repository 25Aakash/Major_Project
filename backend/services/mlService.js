// ML Service Integration
const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

class MLService {
  // Get ML-powered recommendations
  static async getRecommendations(userId, interactions, userProfile) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/recommend`, {
        userId,
        interactions,
        userProfile
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Recommendations error:', error.message);
      return this.getFallbackRecommendations(userProfile);
    }
  }

  // Get adaptive difficulty recommendation
  static async getAdaptiveDifficulty(userId, recentPerformance, currentLevel) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/adaptive-difficulty`, {
        userId,
        recentPerformance,
        currentLevel
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Adaptive Difficulty error:', error.message);
      return this.getFallbackDifficulty(recentPerformance, currentLevel);
    }
  }

  // Predict engagement
  static async predictEngagement(userId, contentId, userFeatures, contentFeatures) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/predict-engagement`, {
        userId,
        contentId,
        userFeatures,
        contentFeatures
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Engagement Prediction error:', error.message);
      return { success: false, engagementScore: 0.5 };
    }
  }

  // Get learning insights
  static async getLearningInsights(userId, interactions, completedLessons) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/learning-insights`, {
        userId,
        interactions,
        completedLessons
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Learning Insights error:', error.message);
      return this.getFallbackInsights();
    }
  }

  // Check ML service health
  static async checkHealth() {
    try {
      const response = await axios.get(`${ML_API_URL}/health`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      return { status: 'unavailable', error: error.message };
    }
  }

  // AI Adaptive Features (Feature #6 - Performance Prediction)
  static async predictPerformance(userId, interactionHistory) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/predict-performance`, {
        userId,
        interactionHistory
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Performance Prediction error:', error.message);
      return { 
        success: false, 
        predictedScore: 70, 
        confidence: 0.3,
        recommendations: ['Complete more lessons for accurate predictions']
      };
    }
  }

  // AI Adaptive Features (Feature #2 - Struggle Detection)
  static async detectStruggle(currentSession, interactionHistory) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/detect-struggle`, {
        currentSession,
        interactionHistory
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Struggle Detection error:', error.message);
      return { 
        success: false, 
        isStruggling: false,
        suggestedInterventions: []
      };
    }
  }

  // AI Adaptive Features (Feature #5 - Optimal Break Time)
  static async getOptimalBreakTime(sessionData, userRhythm) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/optimal-break`, {
        sessionData,
        userRhythm
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Optimal Break error:', error.message);
      const duration = sessionData.duration / 60 || 0;
      return { 
        success: false, 
        needsBreak: duration > 25,
        message: duration > 25 ? 'Consider taking a break' : 'Keep going!',
        suggestedDuration: 5
      };
    }
  }

  // AI Adaptive Features (Feature #7 - Neurodiversity Detection)
  static async detectNeurodiversityPatterns(interactionHistory) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/detect-neurodiversity`, {
        interactionHistory
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Neurodiversity Detection error:', error.message);
      return { 
        success: false, 
        detectedPatterns: [],
        confidence: 0.0,
        adaptiveRecommendations: []
      };
    }
  }

  // AI Adaptive Features (Feature #11 - Skill Mastery)
  static async updateSkillMastery(currentMastery, interaction) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/update-skill-mastery`, {
        currentMastery,
        interaction
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Skill Mastery error:', error.message);
      return { 
        success: false, 
        updatedMastery: currentMastery,
        recommendations: []
      };
    }
  }

  // AI Adaptive Features (Feature #5 - Adaptive UI)
  static async getAdaptiveUISettings(behaviorPatterns, currentSettings) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/adaptive-ui-settings`, {
        behaviorPatterns,
        currentSettings
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Adaptive UI error:', error.message);
      return { 
        success: false, 
        suggestions: {},
        autoApply: false
      };
    }
  }

  // AI Adaptive Features (Feature #12 - Gamification Preferences)
  static async analyzeGamificationPreferences(interactionHistory) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/gamification-preferences`, {
        interactionHistory
      }, { timeout: 5000 });
      
      return response.data;
    } catch (error) {
      console.error('ML Gamification Preferences error:', error.message);
      return { 
        success: false, 
        preferences: {
          respondsToAchievements: true,
          respondsToPoints: true,
          respondsToLeaderboards: false
        },
        recommendations: []
      };
    }
  }

  // Fallback methods when ML service is unavailable

  static getFallbackRecommendations(userProfile) {
    const learningStyle = userProfile.learningStyle || 'mixed';
    const currentLevel = userProfile.currentLevel || 1;

    let difficulty = 'beginner';
    if (currentLevel >= 3) difficulty = 'advanced';
    else if (currentLevel >= 2) difficulty = 'intermediate';

    const formatMap = {
      'visual': 'video',
      'auditory': 'audio',
      'kinesthetic': 'interactive',
      'reading': 'text',
      'mixed': 'mixed'
    };

    return {
      success: true,
      recommendations: [
        { type: 'difficulty', value: difficulty, confidence: 0.7 },
        { type: 'format', value: formatMap[learningStyle] || 'mixed', confidence: 0.7 },
        { type: 'study_habit', value: 'Maintain consistent daily practice', confidence: 0.6 }
      ],
      source: 'fallback'
    };
  }

  static getFallbackDifficulty(recentPerformance, currentLevel) {
    let avgScore = 50;
    let completionRate = 0.5;

    if (recentPerformance && recentPerformance.length > 0) {
      avgScore = recentPerformance.reduce((sum, p) => sum + (p.score || 0), 0) / recentPerformance.length;
      completionRate = recentPerformance.filter(p => p.completed).length / recentPerformance.length;
    }

    let nextDifficulty = 'beginner';
    if (avgScore >= 80 && completionRate >= 0.8) {
      nextDifficulty = 'advanced';
    } else if (avgScore >= 65 && completionRate >= 0.6) {
      nextDifficulty = 'intermediate';
    }

    return {
      success: true,
      currentLevel,
      recommendedLevel: nextDifficulty,
      confidence: 0.7,
      metrics: {
        averageScore: avgScore.toFixed(2),
        completionRate: (completionRate * 100).toFixed(2)
      },
      reasoning: `Based on ${avgScore.toFixed(0)}% average score`,
      source: 'fallback'
    };
  }

  static getFallbackInsights() {
    return {
      success: true,
      insights: [
        {
          type: 'info',
          title: 'Keep Learning',
          description: 'Continue completing lessons to unlock AI-powered insights!',
          icon: '📚'
        }
      ],
      source: 'fallback'
    };
  }
}

module.exports = MLService;
