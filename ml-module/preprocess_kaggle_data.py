"""
Preprocess Kaggle Datasets for NeuroLearn
Maps external datasets to our 12-feature schema
Author: Aakash Khandelwal
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta

def preprocess_autism_dataset():
    """Process Kaggle Autism Screening dataset"""
    print("\n" + "="*70)
    print("  Processing Autism Screening Dataset")
    print("="*70)
    
    # Load ARFF file (convert to CSV format)
    df = pd.read_csv('datasets/autism/Autism_Data.arff', 
                     skiprows=28, 
                     names=['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
                            'age', 'gender', 'ethnicity', 'jaundice', 'austim', 
                            'contry_of_res', 'used_app_before', 'result', 'age_desc', 
                            'relation', 'Class/ASD'])
    
    print(f"✓ Loaded {len(df)} samples")
    
    # Map to NeuroLearn interaction format
    interactions = []
    for idx, row in df.iterrows():
        # Calculate behavioral scores
        aq10_score = sum([int(row[f'A{i}']) for i in range(1, 11)])
        
        interaction = {
            'userId': f'autism_user_{idx}',
            'neurodiversityType': ['autism'] if row['Class/ASD'] == 'YES' else [],
            'contentId': 'autism_screening_assessment',
            'interactionType': 'complete',
            'timestamp': (datetime.now() - timedelta(days=np.random.randint(1, 90))).isoformat(),
            'duration': 900 + np.random.randint(-300, 300),  # ~15 min assessment
            'completionRate': 100,
            'focusLevel': 10 - (aq10_score // 2),  # Lower score = better focus
            'emotionalState': 'neutral',
            'performance': {
                'score': (10 - aq10_score) * 10,  # Inverse scoring
                'attempts': 1,
                'hints': aq10_score // 3,
                'timeSpent': 900
            },
            'features': {
                'pauseFrequency': aq10_score // 5,
                'revisitCount': aq10_score // 4
            }
        }
        interactions.append(interaction)
    
    return interactions

def preprocess_xapi_dataset():
    """Process xAPI Educational Data Mining dataset"""
    print("\n" + "="*70)
    print("  Processing xAPI Educational Dataset")
    print("="*70)
    
    df = pd.read_csv('datasets/educational/xAPI-Edu-Data.csv')
    print(f"✓ Loaded {len(df)} students")
    
    interactions = []
    for idx, row in df.iterrows():
        # Map engagement metrics to our features
        engagement_score = (row['raisedhands'] + row['Discussion']) / 2
        
        interaction = {
            'userId': f'xapi_student_{idx}',
            'neurodiversityType': [],  # Infer from patterns
            'contentId': f"lesson_{row['Topic'].lower()}",
            'interactionType': 'complete',
            'timestamp': (datetime.now() - timedelta(days=np.random.randint(1, 90))).isoformat(),
            'duration': row['VisITedResources'] * 60,  # ~1 min per resource
            'completionRate': min(row['VisITedResources'] * 2, 100),
            'focusLevel': min(int(engagement_score / 10) + 1, 10),
            'emotionalState': 'engaged' if engagement_score > 70 else 'neutral',
            'performance': {
                'score': {'H': 85, 'M': 70, 'L': 55}[row['Class']],
                'attempts': 1,
                'hints': max(0, row['AnnouncementsView'] - 20) // 5,
                'timeSpent': row['VisITedResources'] * 60
            },
            'features': {
                'pauseFrequency': row['VisITedResources'] // 10,
                'revisitCount': max(0, row['VisITedResources'] - 50) // 10
            }
        }
        
        # Infer ADHD indicators
        if row['raisedhands'] < 30 and row['VisITedResources'] < 40:
            interaction['neurodiversityType'] = ['adhd']
        
        interactions.append(interaction)
    
    return interactions

def preprocess_performance_dataset():
    """Process Student Performance dataset"""
    print("\n" + "="*70)
    print("  Processing Student Performance Dataset")
    print("="*70)
    
    df = pd.read_csv('datasets/performance/StudentsPerformance.csv')
    print(f"✓ Loaded {len(df)} students")
    
    interactions = []
    for idx, row in df.iterrows():
        math_score = row['math score']
        reading_score = row['reading score']
        writing_score = row['writing score']
        verbal_avg = (reading_score + writing_score) / 2
        
        interaction = {
            'userId': f'performance_student_{idx}',
            'neurodiversityType': [],
            'contentId': 'comprehensive_assessment',
            'interactionType': 'complete',
            'timestamp': (datetime.now() - timedelta(days=np.random.randint(1, 90))).isoformat(),
            'duration': 3600 + np.random.randint(-600, 600),  # ~1 hour exam
            'completionRate': 100,
            'focusLevel': min(int(math_score / 10), 10),
            'emotionalState': 'confident' if math_score > 75 else 'neutral',
            'performance': {
                'score': (math_score + reading_score + writing_score) / 3,
                'attempts': 1,
                'hints': max(0, int((100 - math_score) / 10)),
                'timeSpent': 3600
            },
            'features': {
                'pauseFrequency': max(0, int((100 - math_score) / 15)),
                'revisitCount': max(0, int((100 - reading_score) / 20))
            }
        }
        
        # Infer dyscalculia
        if verbal_avg - math_score > 15:
            interaction['neurodiversityType'] = ['dyscalculia']
        
        # Infer dyslexia
        if reading_score < 60 and math_score > 70:
            interaction['neurodiversityType'] = ['dyslexia']
        
        interactions.append(interaction)
    
    return interactions

def preprocess_adaptivity_dataset():
    """Process Student Adaptivity dataset"""
    print("\n" + "="*70)
    print("  Processing Student Adaptivity Dataset")
    print("="*70)
    
    df = pd.read_csv('datasets/adaptivity/students_adaptability_level_online_education.csv')
    print(f"✓ Loaded {len(df)} students")
    
    interactions = []
    for idx, row in df.iterrows():
        # Map adaptivity level to performance score
        adaptivity_map = {'High': 85, 'Moderate': 70, 'Low': 55}
        score = adaptivity_map.get(row['Adaptivity Level'], 70)
        
        interaction = {
            'userId': f'adaptivity_student_{idx}',
            'neurodiversityType': [],
            'contentId': 'online_learning_session',
            'interactionType': 'complete',
            'timestamp': (datetime.now() - timedelta(days=np.random.randint(1, 90))).isoformat(),
            'duration': 1800 + np.random.randint(-600, 600),  # ~30 min
            'completionRate': score + np.random.randint(-10, 10),
            'focusLevel': min(int(score / 10), 10),
            'emotionalState': 'engaged' if score > 75 else 'neutral',
            'performance': {
                'score': score,
                'attempts': 1,
                'hints': max(0, int((100 - score) / 15)),
                'timeSpent': 1800
            },
            'features': {
                'pauseFrequency': 10 - int(score / 10),
                'revisitCount': max(0, int((100 - score) / 20))
            }
        }
        
        # Infer ADHD from low adaptivity
        if row['Adaptivity Level'] == 'Low':
            interaction['neurodiversityType'] = ['adhd']
        
        interactions.append(interaction)
    
    return interactions

def main():
    print("\n" + "*"*70)
    print("  KAGGLE DATASET PREPROCESSING")
    print("  Mapping to NeuroLearn 12-Feature Schema")
    print("*"*70)
    
    # Process all datasets
    all_interactions = []
    
    try:
        autism_data = preprocess_autism_dataset()
        all_interactions.extend(autism_data)
        print(f"✓ Processed {len(autism_data)} autism samples")
    except Exception as e:
        print(f"✗ Error processing autism data: {e}")
    
    try:
        xapi_data = preprocess_xapi_dataset()
        all_interactions.extend(xapi_data)
        print(f"✓ Processed {len(xapi_data)} xAPI samples")
    except Exception as e:
        print(f"✗ Error processing xAPI data: {e}")
    
    try:
        performance_data = preprocess_performance_dataset()
        all_interactions.extend(performance_data)
        print(f"✓ Processed {len(performance_data)} performance samples")
    except Exception as e:
        print(f"✗ Error processing performance data: {e}")
    
    try:
        adaptivity_data = preprocess_adaptivity_dataset()
        all_interactions.extend(adaptivity_data)
        print(f"✓ Processed {len(adaptivity_data)} adaptivity samples")
    except Exception as e:
        print(f"✗ Error processing adaptivity data: {e}")
    
    # Save processed data
    print("\n" + "="*70)
    print("  Saving Processed Data")
    print("="*70)
    
    os.makedirs('datasets/processed', exist_ok=True)
    
    output_file = 'datasets/processed/all_interactions.json'
    with open(output_file, 'w') as f:
        json.dump(all_interactions, f, indent=2)
    
    print(f"\n✓ Saved {len(all_interactions)} interactions to: {output_file}")
    
    # Statistics
    print("\n" + "="*70)
    print("  Dataset Statistics")
    print("="*70)
    
    neurodiversity_counts = {}
    for interaction in all_interactions:
        for nd_type in interaction['neurodiversityType']:
            neurodiversity_counts[nd_type] = neurodiversity_counts.get(nd_type, 0) + 1
    
    print("\nNeurodiversity Distribution:")
    for nd_type, count in sorted(neurodiversity_counts.items()):
        print(f"  {nd_type.upper():15s}: {count:4d} samples")
    
    print(f"\nNeurotypical: {len([i for i in all_interactions if not i['neurodiversityType']]):4d} samples")
    print(f"\nTotal Samples: {len(all_interactions)}")
    
    print("\n✓ Preprocessing Complete!")
    print("\nNext step: python train_with_kaggle.py")

if __name__ == "__main__":
    main()
