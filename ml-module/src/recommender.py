"""
NeuroLearn Content Recommender
Author: Aakash Khandelwal
Week 4 Implementation

Provides personalized content recommendations based on user features.
Implements adaptive learning difficulty adjustment.
"""

import numpy as np
from typing import List, Dict, Any
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
import joblib
import os


class ContentRecommender:
    """Adaptive content recommendation system"""
    
    def __init__(self):
        self.model = None
        self.content_embeddings = {}
        self.difficulty_thresholds = {
            'beginner': (0, 50),
            'intermediate': (50, 75),
            'advanced': (75, 100)
        }
    
    def recommend_difficulty(self, performance_score: float, 
                           focus_level: float) -> str:
        """
        Recommend difficulty level based on performance
        
        Args:
            performance_score: User's average performance (0-100)
            focus_level: User's average focus level (1-10)
            
        Returns:
            Recommended difficulty level
        """
        # Adjust score based on focus
        adjusted_score = performance_score * (focus_level / 10)
        
        if adjusted_score >= 75:
            return 'advanced'
        elif adjusted_score >= 50:
            return 'intermediate'
        else:
            return 'beginner'
    
    def recommend_content_format(self, neurodiversity_type: List[str],
                                learning_style: str) -> List[str]:
        """
        Recommend content formats based on neurodiversity and learning style
        
        Args:
            neurodiversity_type: List of neurodiversity types
            learning_style: User's preferred learning style
            
        Returns:
            List of recommended content formats
        """
        formats = []
        
        # Base on learning style
        format_mapping = {
            'visual': ['video', 'visual', 'interactive'],
            'auditory': ['audio', 'video'],
            'kinesthetic': ['interactive', 'game'],
            'reading-writing': ['text'],
            'mixed': ['text', 'video', 'interactive']
        }
        formats.extend(format_mapping.get(learning_style, ['text']))
        
        # Adjust for neurodiversity
        if 'dyslexia' in neurodiversity_type:
            formats = [f for f in formats if f != 'text'] + ['audio', 'video']
        if 'adhd' in neurodiversity_type:
            formats = ['interactive', 'game', 'video'] + formats
        if 'autism' in neurodiversity_type:
            formats = ['visual', 'interactive'] + formats
        
        # Return unique formats
        return list(dict.fromkeys(formats[:3]))
    
    def calculate_engagement_score(self, features: Dict[str, float]) -> float:
        """
        Calculate user engagement score
        
        Args:
            features: User feature dictionary
            
        Returns:
            Engagement score (0-100)
        """
        weights = {
            'avg_completion_rate': 0.3,
            'avg_focus_level': 0.2,
            'session_frequency': 0.2,
            'emotional_stability': 0.15,
            'performance_score': 0.15
        }
        
        score = 0
        for feature, weight in weights.items():
            value = features.get(feature, 0)
            # Normalize to 0-1 if needed
            if feature == 'avg_focus_level':
                value = value / 10
            elif feature == 'session_frequency':
                value = min(value / 7, 1)  # 7 sessions per week = max
            elif feature != 'emotional_stability':
                value = value / 100
            
            score += value * weight * 100
        
        return min(score, 100)
    
    def recommend_break_frequency(self, focus_level: float, 
                                  neurodiversity_type: List[str]) -> int:
        """
        Recommend break frequency in minutes
        
        Args:
            focus_level: Average focus level (1-10)
            neurodiversity_type: List of neurodiversity types
            
        Returns:
            Minutes between breaks
        """
        base_interval = 25  # Pomodoro technique default
        
        # Adjust for focus level
        if focus_level < 5:
            base_interval = 15
        elif focus_level > 7:
            base_interval = 30
        
        # Adjust for ADHD
        if 'adhd' in neurodiversity_type:
            base_interval = min(base_interval, 20)
        
        return base_interval
    
    def adaptive_content_selection(self, user_features: Dict[str, float],
                                   available_content: List[Dict],
                                   limit: int = 5) -> List[Dict]:
        """
        Select content adaptively based on user features
        
        Args:
            user_features: Extracted user features
            available_content: List of available content items
            limit: Number of recommendations to return
            
        Returns:
            List of recommended content items
        """
        if not available_content:
            return []
        
        # Score each content item
        scored_content = []
        recommended_difficulty = self.recommend_difficulty(
            user_features.get('performance_score', 50),
            user_features.get('avg_focus_level', 5)
        )
        
        for content in available_content:
            score = 0
            
            # Match difficulty (+40 points)
            if content.get('difficulty') == recommended_difficulty:
                score += 40
            
            # Completion rate bonus (+30 points)
            completion_rate = user_features.get('avg_completion_rate', 0)
            if completion_rate > 80 and content.get('difficulty') != 'beginner':
                score += 30
            elif completion_rate < 50 and content.get('difficulty') == 'beginner':
                score += 30
            
            # Variety bonus (+20 points)
            if user_features.get('content_variety', 0) < 5:
                score += 20
            
            # Engagement score influence (+10 points)
            engagement = self.calculate_engagement_score(user_features)
            if engagement > 70:
                score += 10
            
            scored_content.append({
                'content': content,
                'score': score
            })
        
        # Sort by score and return top items
        scored_content.sort(key=lambda x: x['score'], reverse=True)
        return [item['content'] for item in scored_content[:limit]]
    
    def generate_learning_path(self, user_features: Dict[str, float],
                              user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized learning path
        
        Args:
            user_features: Extracted user features
            user_profile: User profile information
            
        Returns:
            Learning path recommendations
        """
        difficulty = self.recommend_difficulty(
            user_features.get('performance_score', 50),
            user_features.get('avg_focus_level', 5)
        )
        
        formats = self.recommend_content_format(
            user_profile.get('neurodiversityType', []),
            user_profile.get('learningStyle', 'mixed')
        )
        
        break_frequency = self.recommend_break_frequency(
            user_features.get('avg_focus_level', 5),
            user_profile.get('neurodiversityType', [])
        )
        
        engagement = self.calculate_engagement_score(user_features)
        
        return {
            'recommended_difficulty': difficulty,
            'preferred_formats': formats,
            'break_frequency_minutes': break_frequency,
            'engagement_score': round(engagement, 2),
            'daily_learning_time_minutes': 30 if engagement < 50 else 45,
            'motivational_message': self._get_motivational_message(engagement)
        }
    
    def _get_motivational_message(self, engagement_score: float) -> str:
        """Get motivational message based on engagement"""
        if engagement_score >= 80:
            return "You're doing amazing! Keep up the excellent work! 🌟"
        elif engagement_score >= 60:
            return "Great progress! You're on the right track! 🚀"
        elif engagement_score >= 40:
            return "Good effort! Let's build momentum together! 💪"
        else:
            return "Let's take it one step at a time. You've got this! 🌱"


if __name__ == "__main__":
    # Test the recommender
    print("NeuroLearn Content Recommender - Test Run")
    print("=" * 50)
    
    recommender = ContentRecommender()
    
    # Sample user features
    user_features = {
        'avg_duration': 500,
        'avg_completion_rate': 75,
        'avg_focus_level': 7,
        'session_frequency': 4,
        'content_variety': 3,
        'performance_score': 78,
        'emotional_stability': 0.8,
        'learning_pace': 0.5
    }
    
    user_profile = {
        'neurodiversityType': ['adhd'],
        'learningStyle': 'visual'
    }
    
    # Test recommendations
    print("\n📊 User Features:")
    for key, value in user_features.items():
        print(f"  {key}: {value}")
    
    difficulty = recommender.recommend_difficulty(
        user_features['performance_score'],
        user_features['avg_focus_level']
    )
    print(f"\n🎯 Recommended Difficulty: {difficulty}")
    
    formats = recommender.recommend_content_format(
        user_profile['neurodiversityType'],
        user_profile['learningStyle']
    )
    print(f"📝 Recommended Formats: {formats}")
    
    engagement = recommender.calculate_engagement_score(user_features)
    print(f"💡 Engagement Score: {engagement:.2f}/100")
    
    learning_path = recommender.generate_learning_path(user_features, user_profile)
    print(f"\n🗺️  Learning Path:")
    for key, value in learning_path.items():
        print(f"  {key}: {value}")
    
    print("\n✅ Recommender test completed successfully!")
