"""
NeuroLearn ML API Service
Flask API bridge for serving machine learning recommendations and predictions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import pickle
import numpy as np
from datetime import datetime

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

try:
    from src.preprocessor import FeatureExtractor
    from src.recommender import ContentRecommender
    from src.predictor import PerformancePredictor, SkillMasteryTracker
except ImportError:
    print("Warning: Could not import custom modules. Using fallback mode.")
    FeatureExtractor = None
    ContentRecommender = None
    PerformancePredictor = None
    SkillMasteryTracker = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize AI modules
predictor = PerformancePredictor() if PerformancePredictor else None
skill_tracker = SkillMasteryTracker() if SkillMasteryTracker else None

# Load models (if they exist)
models_dir = os.path.join(os.path.dirname(__file__), 'models')
neurodiversity_model = None
performance_model = None

try:
    if os.path.exists(os.path.join(models_dir, 'neurodiversity_classifier.pkl')):
        with open(os.path.join(models_dir, 'neurodiversity_classifier.pkl'), 'rb') as f:
            neurodiversity_model = pickle.load(f)
        print("✓ Loaded neurodiversity classifier")
    
    if os.path.exists(os.path.join(models_dir, 'performance_predictor.pkl')):
        with open(os.path.join(models_dir, 'performance_predictor.pkl'), 'rb') as f:
            performance_model = pickle.load(f)
        print("✓ Loaded performance predictor")
except Exception as e:
    print(f"Warning: Could not load models: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'NeuroLearn ML API',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': {
            'neurodiversity_classifier': neurodiversity_model is not None,
            'performance_predictor': performance_model is not None
        }
    })

@app.route('/api/ml/recommend', methods=['POST'])
def get_recommendations():
    """
    Get personalized content recommendations based on user data
    
    Expected payload:
    {
        "userId": "string",
        "interactions": [...],
        "userProfile": {...}
    }
    """
    try:
        data = request.get_json()
        user_id = data.get('userId')
        interactions = data.get('interactions', [])
        user_profile = data.get('userProfile', {})
        
        # Extract features from interactions
        features = extract_features_from_interactions(interactions, user_profile)
        
        # Generate recommendations
        recommendations = generate_recommendations(features, user_profile)
        
        return jsonify({
            'success': True,
            'userId': user_id,
            'recommendations': recommendations,
            'features': features,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/adaptive-difficulty', methods=['POST'])
def adaptive_difficulty():
    """
    Determine optimal difficulty level based on performance
    
    Expected payload:
    {
        "userId": "string",
        "recentPerformance": [...],
        "currentLevel": "beginner|intermediate|advanced"
    }
    """
    try:
        data = request.get_json()
        recent_performance = data.get('recentPerformance', [])
        current_level = data.get('currentLevel', 'beginner')
        
        # Calculate average performance
        if recent_performance:
            avg_score = sum(p.get('score', 0) for p in recent_performance) / len(recent_performance)
            completion_rate = sum(1 for p in recent_performance if p.get('completed', False)) / len(recent_performance)
        else:
            avg_score = 50
            completion_rate = 0.5
        
        # Determine next difficulty
        if avg_score >= 85 and completion_rate >= 0.8:
            next_difficulty = 'advanced'
            confidence = 0.9
        elif avg_score >= 70 and completion_rate >= 0.6:
            next_difficulty = 'intermediate'
            confidence = 0.8
        else:
            next_difficulty = 'beginner'
            confidence = 0.7
        
        # Adjust based on current level
        if current_level == 'advanced' and next_difficulty == 'beginner':
            next_difficulty = 'intermediate'  # Don't drop too far
        
        return jsonify({
            'success': True,
            'currentLevel': current_level,
            'recommendedLevel': next_difficulty,
            'confidence': confidence,
            'metrics': {
                'averageScore': round(avg_score, 2),
                'completionRate': round(completion_rate * 100, 2)
            },
            'reasoning': generate_reasoning(avg_score, completion_rate, next_difficulty)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/predict-engagement', methods=['POST'])
def predict_engagement():
    """
    Predict user engagement likelihood for content
    
    Expected payload:
    {
        "userId": "string",
        "contentId": "string",
        "userFeatures": {...},
        "contentFeatures": {...}
    }
    """
    try:
        data = request.get_json()
        user_features = data.get('userFeatures', {})
        content_features = data.get('contentFeatures', {})
        
        # Simple engagement prediction based on matching
        learning_style = user_features.get('learningStyle', 'mixed')
        content_format = content_features.get('format', 'text')
        difficulty = content_features.get('difficulty', 'beginner')
        user_level = user_features.get('currentLevel', 1)
        
        # Calculate engagement score
        engagement_score = 0.5  # Base score
        
        # Format matching
        format_match = {
            'visual': ['video', 'interactive'],
            'auditory': ['audio', 'video'],
            'kinesthetic': ['interactive', 'exercise'],
            'reading': ['text', 'article']
        }
        
        if content_format in format_match.get(learning_style, []):
            engagement_score += 0.2
        
        # Difficulty matching
        difficulty_levels = {'beginner': 1, 'intermediate': 2, 'advanced': 3}
        level_diff = abs(difficulty_levels.get(difficulty, 1) - user_level)
        if level_diff == 0:
            engagement_score += 0.2
        elif level_diff == 1:
            engagement_score += 0.1
        
        # Add some randomness for realism
        engagement_score += np.random.uniform(-0.1, 0.1)
        engagement_score = max(0, min(1, engagement_score))  # Clamp to [0, 1]
        
        return jsonify({
            'success': True,
            'engagementScore': round(engagement_score, 3),
            'recommendation': 'high' if engagement_score > 0.7 else 'medium' if engagement_score > 0.4 else 'low',
            'factors': {
                'formatMatch': content_format in format_match.get(learning_style, []),
                'difficultyMatch': level_diff <= 1,
                'learningStyle': learning_style,
                'contentFormat': content_format
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/learning-insights', methods=['POST'])
def learning_insights():
    """
    Generate AI-powered learning insights from user data
    
    Expected payload:
    {
        "userId": "string",
        "interactions": [...],
        "completedLessons": [...]
    }
    """
    try:
        data = request.get_json()
        interactions = data.get('interactions', [])
        completed_lessons = data.get('completedLessons', [])
        
        # Analyze patterns
        insights = []
        
        # Study time analysis
        if len(interactions) >= 5:
            avg_session_duration = sum(i.get('sessionDuration', 0) for i in interactions) / len(interactions)
            if avg_session_duration > 45:
                insights.append({
                    'type': 'strength',
                    'title': 'Excellent Focus',
                    'description': f'Your average study session lasts {avg_session_duration:.0f} minutes, showing great concentration!',
                    'icon': '🎯'
                })
            elif avg_session_duration < 15:
                insights.append({
                    'type': 'suggestion',
                    'title': 'Short Sessions',
                    'description': 'Try extending your study sessions to 20-25 minutes for better retention.',
                    'icon': '💡'
                })
        
        # Completion rate
        if len(completed_lessons) > 10:
            insights.append({
                'type': 'achievement',
                'title': 'Consistent Learner',
                'description': f'You\'ve completed {len(completed_lessons)} lessons! Keep up the excellent work.',
                'icon': '🏆'
            })
        
        # Learning pace
        if len(interactions) >= 10:
            recent_interactions = interactions[-10:]
            time_span = len(set(i.get('date', '')[:10] for i in recent_interactions if i.get('date')))
            if time_span <= 7:
                insights.append({
                    'type': 'strength',
                    'title': 'Rapid Progress',
                    'description': 'You\'ve been very active this week! Consistency is key to mastery.',
                    'icon': '🚀'
                })
        
        # Default insight if none generated
        if not insights:
            insights.append({
                'type': 'info',
                'title': 'Getting Started',
                'description': 'Complete more lessons to unlock personalized insights!',
                'icon': '🌱'
            })
        
        return jsonify({
            'success': True,
            'insights': insights,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/predict-performance', methods=['POST'])
def predict_performance():
    """
    Predict future performance based on interaction history (Feature #6)
    
    Expected payload:
    {
        "userId": "string",
        "interactionHistory": [...]
    }
    """
    try:
        data = request.get_json()
        interaction_history = data.get('interactionHistory', [])
        
        if predictor:
            result = predictor.predict_performance(interaction_history)
        else:
            # Fallback prediction
            if interaction_history:
                scores = [i.get('performance', {}).get('score', 0) for i in interaction_history]
                avg_score = sum(scores) / len(scores) if scores else 70
                result = {
                    'predictedScore': avg_score,
                    'confidence': 0.5,
                    'trend': 'stable',
                    'recommendations': ['Continue practicing regularly']
                }
            else:
                result = {
                    'predictedScore': 70,
                    'confidence': 0.3,
                    'trend': 'stable',
                    'recommendations': ['Complete more lessons for better predictions']
                }
        
        return jsonify({
            'success': True,
            **result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/detect-struggle', methods=['POST'])
def detect_struggle():
    """
    Detect if student is struggling in real-time (Feature #2)
    
    Expected payload:
    {
        "currentSession": {...},
        "interactionHistory": [...]
    }
    """
    try:
        data = request.get_json()
        current_session = data.get('currentSession', {})
        interaction_history = data.get('interactionHistory', [])
        
        if predictor:
            result = predictor.detect_struggle(current_session, interaction_history)
        else:
            # Simple fallback
            pause_freq = current_session.get('behaviorMetrics', {}).get('pauseFrequency', 0)
            result = {
                'isStruggling': pause_freq > 5,
                'struggleLevel': 'moderate' if pause_freq > 5 else 'low',
                'suggestedInterventions': ['Take a short break'] if pause_freq > 5 else []
            }
        
        return jsonify({
            'success': True,
            **result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/optimal-break', methods=['POST'])
def optimal_break_time():
    """
    Calculate optimal break time based on fatigue (Feature #5)
    
    Expected payload:
    {
        "sessionData": {...},
        "userRhythm": {...}
    }
    """
    try:
        data = request.get_json()
        session_data = data.get('sessionData', {})
        user_rhythm = data.get('userRhythm', {})
        
        if predictor:
            result = predictor.calculate_optimal_break_time(session_data, user_rhythm)
        else:
            # Simple fallback
            duration = session_data.get('duration', 0) / 60
            needs_break = duration > 25
            result = {
                'needsBreak': needs_break,
                'message': 'Take a 5-minute break' if needs_break else 'Keep going!',
                'suggestedDuration': 5
            }
        
        return jsonify({
            'success': True,
            **result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/detect-neurodiversity', methods=['POST'])
def detect_neurodiversity_patterns():
    """
    Detect neurodiversity patterns from behavior (Feature #7)
    
    Expected payload:
    {
        "interactionHistory": [...]
    }
    """
    try:
        data = request.get_json()
        interaction_history = data.get('interactionHistory', [])
        
        if predictor:
            result = predictor.detect_neurodiversity_patterns(interaction_history)
        else:
            result = {
                'detectedPatterns': [],
                'confidence': 0.0,
                'needsMoreData': True,
                'adaptiveRecommendations': []
            }
        
        return jsonify({
            'success': True,
            **result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/update-skill-mastery', methods=['POST'])
def update_skill_mastery():
    """
    Update skill mastery levels (Feature #11)
    
    Expected payload:
    {
        "currentMastery": {...},
        "interaction": {...}
    }
    """
    try:
        data = request.get_json()
        current_mastery = data.get('currentMastery', {})
        interaction = data.get('interaction', {})
        
        if skill_tracker:
            updated_mastery = skill_tracker.update_skill_mastery(current_mastery, interaction)
            recommendations = skill_tracker.get_skill_recommendations(updated_mastery)
        else:
            updated_mastery = current_mastery
            recommendations = []
        
        return jsonify({
            'success': True,
            'updatedMastery': updated_mastery,
            'recommendations': recommendations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/adaptive-ui-settings', methods=['POST'])
def adaptive_ui_settings():
    """
    Get adaptive UI settings based on user behavior (Feature #5)
    
    Expected payload:
    {
        "behaviorPatterns": {...},
        "currentSettings": {...}
    }
    """
    try:
        data = request.get_json()
        behavior = data.get('behaviorPatterns', {})
        current_settings = data.get('currentSettings', {})
        
        suggestions = {}
        
        # Auto-adjust font size if user zooms frequently
        if behavior.get('zoomFrequency', 0) > 3:
            suggestions['fontSize'] = 'large'
        
        # Switch to dark mode for long sessions
        session_duration = behavior.get('averageSessionDuration', 0)
        if session_duration > 30 and current_settings.get('colorScheme') == 'light':
            suggestions['colorScheme'] = 'dark'
            suggestions['reason'] = 'Reduce eye strain during long sessions'
        
        # Enable text-to-speech if reading speed is low
        if behavior.get('averageReadingSpeed', 200) < 150:
            suggestions['textToSpeech'] = True
            suggestions['reason'] = 'Assist with content consumption'
        
        # Reduce animations for ADHD patterns
        if behavior.get('tabSwitchFrequency', 0) > 5:
            suggestions['reducedAnimations'] = True
            suggestions['focusMode'] = True
            suggestions['reason'] = 'Minimize distractions'
        
        return jsonify({
            'success': True,
            'suggestions': suggestions,
            'autoApply': False  # Let user decide
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/gamification-preferences', methods=['POST'])
def analyze_gamification_preferences():
    """
    Analyze gamification preferences (Feature #12)
    
    Expected payload:
    {
        "interactionHistory": [...]
    }
    """
    try:
        data = request.get_json()
        interactions = data.get('interactionHistory', [])
        
        # Analyze which gamification elements user interacts with
        badge_clicks = sum(1 for i in interactions if 'badge' in str(i.get('action', '')))
        points_views = sum(1 for i in interactions if 'points' in str(i.get('action', '')))
        leaderboard_views = sum(1 for i in interactions if 'leaderboard' in str(i.get('action', '')))
        
        total_gamification = badge_clicks + points_views + leaderboard_views
        
        preferences = {
            'respondsToAchievements': badge_clicks > 2,
            'respondsToPoints': points_views > 2,
            'respondsToLeaderboards': leaderboard_views > 1,
            'engagementScore': min(1.0, total_gamification / 10),
            'preferredRewardType': 'badges' if badge_clicks > max(points_views, leaderboard_views) else 'points'
        }
        
        # Recommendations
        recommendations = []
        if preferences['engagementScore'] < 0.3:
            recommendations.append('User shows low engagement with gamification - consider hiding some elements')
        if preferences['respondsToLeaderboards']:
            recommendations.append('Show competitive challenges')
        if preferences['respondsToAchievements']:
            recommendations.append('Highlight achievement progress prominently')
        
        return jsonify({
            'success': True,
            'preferences': preferences,
            'recommendations': recommendations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Helper functions

def extract_features_from_interactions(interactions, user_profile):
    """Extract ML features from user interactions"""
    if not interactions:
        return {
            'avg_session_duration': 0,
            'completion_rate': 0,
            'avg_score': 0,
            'interaction_count': 0,
            'focus_level': 0.5
        }
    
    return {
        'avg_session_duration': sum(i.get('sessionDuration', 0) for i in interactions) / len(interactions),
        'completion_rate': sum(1 for i in interactions if i.get('completed', False)) / len(interactions),
        'avg_score': sum(i.get('performance', {}).get('score', 0) for i in interactions) / len(interactions),
        'interaction_count': len(interactions),
        'focus_level': sum(i.get('focusLevel', 5) for i in interactions) / len(interactions) / 10
    }

def generate_recommendations(features, user_profile):
    """Generate content recommendations based on features"""
    recommendations = []
    
    # Difficulty recommendation
    avg_score = features.get('avg_score', 50)
    if avg_score >= 80:
        difficulty = 'advanced'
    elif avg_score >= 60:
        difficulty = 'intermediate'
    else:
        difficulty = 'beginner'
    
    recommendations.append({
        'type': 'difficulty',
        'value': difficulty,
        'confidence': 0.8
    })
    
    # Format recommendation based on learning style
    learning_style = user_profile.get('learningStyle', 'mixed')
    format_map = {
        'visual': 'video',
        'auditory': 'audio',
        'kinesthetic': 'interactive',
        'reading': 'text',
        'mixed': 'mixed'
    }
    
    recommendations.append({
        'type': 'format',
        'value': format_map.get(learning_style, 'mixed'),
        'confidence': 0.7
    })
    
    # Break frequency recommendation
    avg_duration = features.get('avg_session_duration', 30)
    if avg_duration > 45:
        break_recommendation = 'Consider taking a 5-minute break every 45 minutes'
    elif avg_duration < 20:
        break_recommendation = 'Try extending sessions to 20-25 minutes for better retention'
    else:
        break_recommendation = 'Your session length is optimal!'
    
    recommendations.append({
        'type': 'study_habit',
        'value': break_recommendation,
        'confidence': 0.75
    })
    
    return recommendations

def generate_reasoning(avg_score, completion_rate, recommended_level):
    """Generate human-readable reasoning for difficulty recommendation"""
    reasons = []
    
    if avg_score >= 85:
        reasons.append(f"Your average score of {avg_score:.0f}% shows strong mastery")
    elif avg_score >= 70:
        reasons.append(f"Your score of {avg_score:.0f}% indicates good understanding")
    else:
        reasons.append(f"Your score of {avg_score:.0f}% suggests more practice needed")
    
    if completion_rate >= 0.8:
        reasons.append(f"You complete {completion_rate*100:.0f}% of lessons")
    elif completion_rate >= 0.6:
        reasons.append(f"Completion rate of {completion_rate*100:.0f}% shows commitment")
    else:
        reasons.append(f"Try to improve your {completion_rate*100:.0f}% completion rate")
    
    return ' | '.join(reasons)

if __name__ == '__main__':
    print("=" * 60)
    print("🧠 NeuroLearn ML API Service Starting...")
    print("=" * 60)
    print(f"Models Directory: {models_dir}")
    print(f"Neurodiversity Model: {'✓ Loaded' if neurodiversity_model else '✗ Not found'}")
    print(f"Performance Model: {'✓ Loaded' if performance_model else '✗ Not found'}")
    print("=" * 60)
    print("Starting Flask server on http://localhost:5001")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5001, debug=True)
