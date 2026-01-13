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
except ImportError:
    print("Warning: Could not import custom modules. Using fallback mode.")
    FeatureExtractor = None
    ContentRecommender = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
