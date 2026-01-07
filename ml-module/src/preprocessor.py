"""
NeuroLearn Data Preprocessor
Author: Aakash Khandelwal
Week 3-4 Implementation

Handles preprocessing of user interaction data for ML models.
Extracts features for adaptive learning algorithms.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any
import json


class DataPreprocessor:
    """Preprocesses user interaction data for machine learning"""
    
    def __init__(self):
        self.feature_names = [
            'avg_duration', 'avg_completion_rate', 'avg_focus_level',
            'session_frequency', 'content_variety', 'performance_score',
            'emotional_stability', 'learning_pace', 'interaction_count',
            'pause_frequency', 'revisit_rate', 'hint_usage'
        ]
    
    def extract_features(self, interactions: List[Dict]) -> Dict[str, float]:
        """
        Extract features from user interactions
        
        Args:
            interactions: List of interaction dictionaries
            
        Returns:
            Dictionary of extracted features
        """
        if not interactions:
            return self._get_default_features()
        
        features = {}
        
        # Time-based features
        features['avg_duration'] = np.mean([i.get('duration', 0) for i in interactions])
        features['session_frequency'] = self._calculate_session_frequency(interactions)
        
        # Performance features
        features['avg_completion_rate'] = np.mean([i.get('completionRate', 0) for i in interactions])
        features['avg_focus_level'] = np.mean([i.get('focusLevel', 5) for i in interactions])
        
        performance_scores = [i.get('performance', {}).get('score', 0) for i in interactions]
        features['performance_score'] = np.mean(performance_scores)
        
        # Behavioral features
        features['pause_frequency'] = np.mean([i.get('features', {}).get('pauseFrequency', 0) for i in interactions])
        features['revisit_rate'] = np.mean([i.get('features', {}).get('revisitCount', 0) for i in interactions])
        features['hint_usage'] = np.mean([i.get('performance', {}).get('hints', 0) for i in interactions])
        
        # Engagement features
        features['interaction_count'] = len(interactions)
        features['content_variety'] = len(set([i.get('contentId') for i in interactions]))
        features['emotional_stability'] = self._calculate_emotional_stability(interactions)
        features['learning_pace'] = self._calculate_learning_pace(interactions)
        
        return features
    
    def normalize_features(self, features: Dict[str, float]) -> np.ndarray:
        """Normalize features to 0-1 range"""
        feature_ranges = {
            'avg_duration': 3600,  # max 1 hour
            'avg_completion_rate': 100,
            'avg_focus_level': 10,
            'session_frequency': 10,
            'content_variety': 50,
            'performance_score': 100,
            'emotional_stability': 1,
            'learning_pace': 1,
            'interaction_count': 1000,
            'pause_frequency': 20,
            'revisit_rate': 10,
            'hint_usage': 20
        }
        
        normalized = []
        for fname in self.feature_names:
            value = features.get(fname, 0)
            max_val = feature_ranges.get(fname, 1)
            normalized.append(min(value / max_val, 1.0))
        
        return np.array(normalized)
    
    def _calculate_session_frequency(self, interactions: List[Dict]) -> float:
        """Calculate sessions per week"""
        if len(interactions) < 2:
            return 1.0
        
        timestamps = [i.get('timestamp') for i in interactions if i.get('timestamp')]
        if not timestamps:
            return 1.0
        
        # Convert to datetime if strings
        dates = []
        for ts in timestamps:
            if isinstance(ts, str):
                try:
                    dates.append(datetime.fromisoformat(ts.replace('Z', '+00:00')))
                except:
                    continue
            else:
                dates.append(ts)
        
        if len(dates) < 2:
            return 1.0
        
        date_range = (max(dates) - min(dates)).days or 1
        sessions_per_week = (len(set([d.date() for d in dates])) / date_range) * 7
        return min(sessions_per_week, 10)
    
    def _calculate_emotional_stability(self, interactions: List[Dict]) -> float:
        """Calculate emotional state consistency (0-1)"""
        emotions = [i.get('emotionalState', 'neutral') for i in interactions]
        if not emotions:
            return 0.5
        
        # Map emotions to scores
        emotion_scores = {
            'confident': 1.0,
            'engaged': 0.8,
            'neutral': 0.5,
            'confused': 0.3,
            'frustrated': 0.1
        }
        
        scores = [emotion_scores.get(e, 0.5) for e in emotions]
        return 1.0 - np.std(scores)  # Lower variance = more stable
    
    def _calculate_learning_pace(self, interactions: List[Dict]) -> float:
        """Calculate learning pace (completions per hour)"""
        completed = [i for i in interactions if i.get('interactionType') == 'complete']
        if not completed:
            return 0.0
        
        total_time = sum([i.get('duration', 0) for i in interactions]) / 3600  # hours
        if total_time == 0:
            return 0.0
        
        return len(completed) / total_time
    
    def _get_default_features(self) -> Dict[str, float]:
        """Return default features for new users"""
        return {fname: 0.0 for fname in self.feature_names}
    
    def prepare_training_data(self, user_interactions: Dict[str, List[Dict]]) -> tuple:
        """
        Prepare training data for ML models
        
        Args:
            user_interactions: Dictionary mapping user_id to interactions list
            
        Returns:
            Tuple of (X_features, y_labels, user_ids)
        """
        X = []
        y = []
        user_ids = []
        
        for user_id, interactions in user_interactions.items():
            features = self.extract_features(interactions)
            normalized = self.normalize_features(features)
            
            # Label: High performer (1) or needs support (0)
            label = 1 if features['performance_score'] > 70 else 0
            
            X.append(normalized)
            y.append(label)
            user_ids.append(user_id)
        
        return np.array(X), np.array(y), user_ids


if __name__ == "__main__":
    # Test the preprocessor
    print("NeuroLearn Data Preprocessor - Test Run")
    print("=" * 50)
    
    # Sample interaction data
    sample_interactions = [
        {
            'userId': 'user1',
            'contentId': 'content1',
            'interactionType': 'complete',
            'duration': 600,
            'completionRate': 95,
            'focusLevel': 8,
            'performance': {'score': 85, 'hints': 2},
            'emotionalState': 'engaged',
            'timestamp': datetime.now().isoformat()
        },
        {
            'userId': 'user1',
            'contentId': 'content2',
            'interactionType': 'view',
            'duration': 450,
            'completionRate': 60,
            'focusLevel': 6,
            'performance': {'score': 70, 'hints': 4},
            'emotionalState': 'neutral',
            'timestamp': datetime.now().isoformat()
        }
    ]
    
    preprocessor = DataPreprocessor()
    features = preprocessor.extract_features(sample_interactions)
    
    print("\nExtracted Features:")
    for key, value in features.items():
        print(f"  {key}: {value:.2f}")
    
    normalized = preprocessor.normalize_features(features)
    print(f"\nNormalized Feature Vector: {normalized}")
    print(f"Vector Shape: {normalized.shape}")
    
    print("\n✅ Preprocessor test completed successfully!")
