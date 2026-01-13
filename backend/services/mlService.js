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
