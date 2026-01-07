# Machine Learning Module for NeuroLearn

## Overview
This module contains the machine learning components for adaptive learning and personalization.

## Components
1. **Data Preprocessing** - Feature extraction and data cleaning
2. **User Profiling** - Learning pattern analysis
3. **Content Recommendation** - Personalized content suggestions
4. **Adaptive Learning** - Difficulty adjustment algorithms

## Setup
```bash
pip install -r requirements.txt
```

## Usage
```python
from src.preprocessor import DataPreprocessor
from src.recommender import ContentRecommender

# Initialize
preprocessor = DataPreprocessor()
recommender = ContentRecommender()

# Preprocess user data
features = preprocessor.extract_features(user_interactions)

# Get recommendations
recommendations = recommender.predict(user_id, features)
```

## Features Implemented (Week 1-4)
✅ Dataset structure finalized  
✅ Feature extraction logic  
✅ Data preprocessing pipeline  
✅ Basic recommendation framework  

## Next Steps
- Train ML models on user interaction data
- Implement real-time prediction API
- Add emotion detection from interaction patterns
- Enhance adaptive difficulty algorithm
