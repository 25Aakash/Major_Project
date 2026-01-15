"""
NeuroLearn Performance Predictor
AI Adaptive Features Implementation

Handles:
- Performance prediction (Feature #6)
- Struggle detection (Feature #2)
- Optimal break time calculation (Feature #5)
- Neurodiversity pattern detection (Feature #7)
"""

import numpy as np
from typing import List, Dict, Any, Tuple
from datetime import datetime, timedelta
import joblib
import os


class PerformancePredictor:
    """Predicts student performance and detects struggle patterns"""
    
    def __init__(self):
        self.struggle_threshold = 0.6
        self.fatigue_threshold = 0.7
        
    def predict_performance(self, interaction_history: List[Dict]) -> Dict[str, Any]:
        """
        Predict next performance score based on interaction history
        
        Args:
            interaction_history: List of recent interactions with metrics
            
        Returns:
            Dict with predicted score, confidence, and recommendations
        """
        if not interaction_history:
            return {
                'predictedScore': 70,
                'confidence': 0.3,
                'trend': 'stable',
                'recommendations': ['Complete more lessons to improve predictions']
            }
        
        # Extract performance metrics
        scores = [i.get('performance', {}).get('score', 0) for i in interaction_history]
        completion_rates = [i.get('completionRate', 0) for i in interaction_history]
        focus_levels = [i.get('focusLevel', 5) for i in interaction_history]
        
        # Calculate trends
        if len(scores) >= 3:
            recent_avg = np.mean(scores[-3:])
            overall_avg = np.mean(scores)
            trend_direction = 'improving' if recent_avg > overall_avg else 'declining'
            improvement_rate = ((recent_avg - overall_avg) / overall_avg * 100) if overall_avg > 0 else 0
        else:
            recent_avg = np.mean(scores) if scores else 70
            trend_direction = 'stable'
            improvement_rate = 0
        
        # Predict next score using weighted average
        weights = np.exp(np.linspace(-1, 0, len(scores)))  # More weight to recent
        weighted_scores = np.average(scores, weights=weights) if scores else 70
        
        # Adjust based on focus and completion
        avg_focus = np.mean(focus_levels) if focus_levels else 5
        avg_completion = np.mean(completion_rates) if completion_rates else 50
        
        focus_adjustment = (avg_focus - 5) * 2  # -10 to +10
        completion_adjustment = (avg_completion - 50) / 5  # Normalize
        
        predicted_score = min(100, max(0, weighted_scores + focus_adjustment + completion_adjustment))
        
        # Calculate confidence based on data quantity and consistency
        confidence = min(0.95, (len(scores) / 20) * 0.5 + 0.3)  # 0.3 to 0.95
        if len(scores) > 1:
            variance = np.var(scores)
            confidence *= (1 - min(variance / 1000, 0.5))  # Reduce confidence for high variance
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            predicted_score, trend_direction, avg_focus, avg_completion, improvement_rate
        )
        
        return {
            'predictedScore': round(predicted_score, 1),
            'confidence': round(confidence, 2),
            'trend': trend_direction,
            'improvementRate': round(improvement_rate, 1),
            'currentAverage': round(np.mean(scores), 1) if scores else 0,
            'recommendations': recommendations,
            'dataPoints': len(scores)
        }
    
    def detect_struggle(self, current_session: Dict, interaction_history: List[Dict]) -> Dict[str, Any]:
        """
        Detect if student is struggling in real-time
        
        Args:
            current_session: Current interaction metrics
            interaction_history: Past interaction data
            
        Returns:
            Dict with struggle detection and intervention suggestions
        """
        struggle_indicators = []
        struggle_score = 0.0
        
        # Check current session metrics
        pause_frequency = current_session.get('behaviorMetrics', {}).get('pauseFrequency', 0)
        rewind_count = current_session.get('mediaMetrics', {}).get('rewindCount', 0)
        help_requests = current_session.get('sessionMetrics', {}).get('helpRequestCount', 0)
        error_count = current_session.get('sessionMetrics', {}).get('errorCount', 0)
        focus_level = current_session.get('focusLevel', 5)
        
        # Analyze struggle indicators
        if pause_frequency > 5:
            struggle_indicators.append('high_pause_frequency')
            struggle_score += 0.2
            
        if rewind_count > 3:
            struggle_indicators.append('multiple_rewinds')
            struggle_score += 0.2
            
        if help_requests > 2:
            struggle_indicators.append('frequent_help_requests')
            struggle_score += 0.25
            
        if error_count > 3:
            struggle_indicators.append('high_error_rate')
            struggle_score += 0.25
            
        if focus_level < 4:
            struggle_indicators.append('low_focus')
            struggle_score += 0.15
        
        # Check time spent vs expected
        time_spent = current_session.get('duration', 0)
        expected_time = current_session.get('expectedDuration', 600)  # Default 10 min
        if time_spent > expected_time * 1.5:
            struggle_indicators.append('excessive_time')
            struggle_score += 0.15
        
        # Compare with historical performance
        if interaction_history:
            avg_past_score = np.mean([i.get('performance', {}).get('score', 0) for i in interaction_history])
            current_score = current_session.get('performance', {}).get('score', 0)
            if current_score < avg_past_score * 0.7:
                struggle_indicators.append('below_average_performance')
                struggle_score += 0.2
        
        # Determine struggle level
        struggle_score = min(1.0, struggle_score)
        
        if struggle_score >= 0.7:
            level = 'high'
            interventions = [
                'Suggest switching to easier content',
                'Recommend taking a break',
                'Offer video tutorial instead of text',
                'Provide step-by-step guide'
            ]
        elif struggle_score >= 0.4:
            level = 'moderate'
            interventions = [
                'Suggest viewing additional examples',
                'Recommend reviewing prerequisites',
                'Offer hints for current challenge'
            ]
        else:
            level = 'low'
            interventions = []
        
        return {
            'isStruggling': struggle_score >= self.struggle_threshold,
            'struggleLevel': level,
            'struggleScore': round(struggle_score, 2),
            'indicators': struggle_indicators,
            'suggestedInterventions': interventions,
            'confidence': 0.8 if len(struggle_indicators) > 2 else 0.5
        }
    
    def calculate_optimal_break_time(self, session_data: Dict, user_rhythm: Dict) -> Dict[str, Any]:
        """
        Calculate when user should take a break based on fatigue patterns
        
        Args:
            session_data: Current session metrics
            user_rhythm: User's learning rhythm data
            
        Returns:
            Dict with break recommendations
        """
        session_duration = session_data.get('duration', 0) / 60  # Convert to minutes
        avg_attention_span = user_rhythm.get('averageAttentionSpan', 20)
        preferred_break_interval = user_rhythm.get('preferredBreakInterval', 25)
        
        # Get focus level timeline
        focus_timeline = session_data.get('attentionMetrics', {}).get('focusLevelTimeline', [])
        
        # Calculate fatigue score
        fatigue_score = 0.0
        
        # Factor 1: Session duration vs attention span
        if session_duration > avg_attention_span:
            fatigue_score += min(0.4, (session_duration - avg_attention_span) / avg_attention_span)
        
        # Factor 2: Focus level decline
        if len(focus_timeline) >= 2:
            recent_focus = np.mean([f['level'] for f in focus_timeline[-3:]])
            initial_focus = np.mean([f['level'] for f in focus_timeline[:3]])
            focus_decline = (initial_focus - recent_focus) / 10
            fatigue_score += max(0, focus_decline * 0.3)
        
        # Factor 3: Idle time
        idle_time = session_data.get('behaviorMetrics', {}).get('idleTime', 0)
        if idle_time > 60:  # More than 1 min idle
            fatigue_score += 0.2
        
        # Factor 4: Error rate increase
        error_count = session_data.get('sessionMetrics', {}).get('errorCount', 0)
        if error_count > 2:
            fatigue_score += 0.15
        
        fatigue_score = min(1.0, fatigue_score)
        
        # Determine break recommendation
        needs_break = fatigue_score >= self.fatigue_threshold
        
        if needs_break:
            urgency = 'high' if fatigue_score >= 0.85 else 'medium'
            suggested_duration = 10 if fatigue_score >= 0.85 else 5  # minutes
            message = f"You've been studying for {int(session_duration)} minutes. Take a {suggested_duration}-min break!"
        else:
            urgency = 'low'
            time_until_break = max(1, int(preferred_break_interval - session_duration))
            suggested_duration = 5
            message = f"Keep going! Break recommended in ~{time_until_break} minutes"
        
        return {
            'needsBreak': needs_break,
            'fatigueScore': round(fatigue_score, 2),
            'urgency': urgency,
            'suggestedDuration': suggested_duration,  # minutes
            'message': message,
            'timeUntilNextBreak': max(0, int(preferred_break_interval - session_duration)),
            'currentSessionDuration': int(session_duration)
        }
    
    def detect_neurodiversity_patterns(self, interaction_history: List[Dict]) -> Dict[str, Any]:
        """
        Detect neurodiversity patterns from behavior (Feature #7)
        
        Args:
            interaction_history: User's interaction history
            
        Returns:
            Dict with detected patterns and confidence scores
        """
        if len(interaction_history) < 5:
            return {
                'detectedPatterns': [],
                'confidence': 0.0,
                'needsMoreData': True
            }
        
        patterns = {}
        
        # ADHD Pattern Detection
        avg_tab_switches = np.mean([i.get('behaviorMetrics', {}).get('tabSwitches', 0) for i in interaction_history])
        avg_focus = np.mean([i.get('focusLevel', 5) for i in interaction_history])
        avg_completion = np.mean([i.get('completionRate', 0) for i in interaction_history])
        
        adhd_score = 0.0
        if avg_tab_switches > 3:
            adhd_score += 0.3
        if avg_focus < 5:
            adhd_score += 0.3
        if avg_completion < 60:
            adhd_score += 0.2
        
        short_attention_sessions = sum(1 for i in interaction_history 
                                      if i.get('attentionMetrics', {}).get('attentionSpan', 20) < 15)
        if short_attention_sessions / len(interaction_history) > 0.6:
            adhd_score += 0.2
        
        patterns['adhd'] = min(1.0, adhd_score)
        
        # Dyslexia Pattern Detection
        avg_rewinds = np.mean([i.get('mediaMetrics', {}).get('rewindCount', 0) for i in interaction_history])
        avg_playback_speed = np.mean([i.get('mediaMetrics', {}).get('averagePlaybackSpeed', 1.0) 
                                     for i in interaction_history])
        
        dyslexia_score = 0.0
        if avg_rewinds > 4:
            dyslexia_score += 0.3
        if avg_playback_speed < 0.9:
            dyslexia_score += 0.3
        
        # Check for text content struggle
        text_struggles = sum(1 for i in interaction_history 
                           if 'text' in str(i.get('contentType', '')) 
                           and i.get('completionRate', 0) < 50)
        if len(interaction_history) > 0 and text_struggles / len(interaction_history) > 0.5:
            dyslexia_score += 0.4
        
        patterns['dyslexia'] = min(1.0, dyslexia_score)
        
        # Autism Pattern Detection
        avg_routine_adherence = np.std([i.get('timestamp', datetime.now()).hour for i in interaction_history])
        repetition_count = sum(1 for i in interaction_history if i.get('features', {}).get('revisitCount', 0) > 2)
        
        autism_score = 0.0
        if avg_routine_adherence < 2:  # Very consistent timing
            autism_score += 0.3
        if repetition_count / len(interaction_history) > 0.4:
            autism_score += 0.3
        
        patterns['autism'] = min(1.0, autism_score)
        
        # Determine detected patterns (threshold 0.5)
        detected = [pattern for pattern, score in patterns.items() if score >= 0.5]
        overall_confidence = np.mean([score for score in patterns.values()]) if patterns else 0.0
        
        # Generate adaptive recommendations
        recommendations = self._generate_neurodiversity_adaptations(patterns)
        
        return {
            'detectedPatterns': detected,
            'patternScores': {k: round(v, 2) for k, v in patterns.items()},
            'confidence': round(overall_confidence, 2),
            'needsMoreData': len(interaction_history) < 10,
            'adaptiveRecommendations': recommendations
        }
    
    def _generate_recommendations(self, predicted_score: float, trend: str, 
                                 focus: float, completion: float, improvement: float) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        if predicted_score < 60:
            recommendations.append('Review fundamental concepts before moving forward')
            recommendations.append('Consider switching to easier difficulty level')
        elif predicted_score > 85:
            recommendations.append('Ready for advanced challenges')
            recommendations.append('Consider mentoring peers to reinforce learning')
        
        if trend == 'declining':
            recommendations.append('Take a break to avoid burnout')
            recommendations.append('Review recent topics that may need reinforcement')
        elif trend == 'improving':
            recommendations.append(f'Great progress! You\'ve improved by {abs(improvement):.1f}%')
        
        if focus < 5:
            recommendations.append('Try shorter study sessions to improve focus')
            recommendations.append('Minimize distractions in your study environment')
        
        if completion < 50:
            recommendations.append('Start with shorter lessons to build momentum')
        
        return recommendations[:4]  # Limit to 4 recommendations
    
    def _generate_neurodiversity_adaptations(self, patterns: Dict[str, float]) -> List[Dict[str, str]]:
        """Generate adaptive recommendations based on detected patterns"""
        adaptations = []
        
        if patterns.get('adhd', 0) >= 0.5:
            adaptations.append({
                'type': 'content_format',
                'recommendation': 'Switch to shorter, interactive content chunks',
                'reason': 'ADHD pattern detected - benefits from frequent engagement'
            })
            adaptations.append({
                'type': 'ui_adjustment',
                'recommendation': 'Enable focus mode and reduce animations',
                'reason': 'Minimize distractions'
            })
        
        if patterns.get('dyslexia', 0) >= 0.5:
            adaptations.append({
                'type': 'content_format',
                'recommendation': 'Prefer audio and video over text content',
                'reason': 'Dyslexia pattern detected'
            })
            adaptations.append({
                'type': 'ui_adjustment',
                'recommendation': 'Use OpenDyslexic font and increase line spacing',
                'reason': 'Improve text readability'
            })
        
        if patterns.get('autism', 0) >= 0.5:
            adaptations.append({
                'type': 'content_structure',
                'recommendation': 'Maintain consistent daily learning schedule',
                'reason': 'Autism pattern detected - benefits from routine'
            })
            adaptations.append({
                'type': 'ui_adjustment',
                'recommendation': 'Use structured, predictable navigation',
                'reason': 'Reduce cognitive load from interface changes'
            })
        
        return adaptations


class SkillMasteryTracker:
    """Track progressive skill mastery (Feature #11)"""
    
    def __init__(self):
        self.mastery_threshold = 0.75
    
    def update_skill_mastery(self, current_mastery: Dict, interaction: Dict) -> Dict:
        """
        Update skill mastery levels based on new interaction
        
        Args:
            current_mastery: Current skill mastery map
            interaction: New interaction data with skill tags
            
        Returns:
            Updated skill mastery map
        """
        skills = interaction.get('skills', [])
        score = interaction.get('performance', {}).get('score', 0) / 100  # Normalize to 0-1
        
        for skill in skills:
            if skill not in current_mastery:
                current_mastery[skill] = {
                    'masteryLevel': score,
                    'practiceCount': 1,
                    'averageScore': score,
                    'lastPracticed': datetime.now()
                }
            else:
                # Update with exponential moving average
                alpha = 0.3  # Learning rate
                old_mastery = current_mastery[skill]['masteryLevel']
                new_mastery = old_mastery * (1 - alpha) + score * alpha
                
                # Update metrics
                practice_count = current_mastery[skill]['practiceCount'] + 1
                avg_score = ((current_mastery[skill]['averageScore'] * current_mastery[skill]['practiceCount']) + score) / practice_count
                
                current_mastery[skill] = {
                    'masteryLevel': min(1.0, new_mastery),
                    'practiceCount': practice_count,
                    'averageScore': avg_score,
                    'lastPracticed': datetime.now()
                }
        
        return current_mastery
    
    def get_skill_recommendations(self, skill_mastery: Dict) -> List[Dict]:
        """
        Recommend skills to practice based on mastery levels
        
        Returns:
            List of skill recommendations with priorities
        """
        recommendations = []
        
        for skill, data in skill_mastery.items():
            mastery = data['masteryLevel']
            last_practiced = data.get('lastPracticed', datetime.now())
            days_since = (datetime.now() - last_practiced).days if isinstance(last_practiced, datetime) else 0
            
            # Prioritize skills that need improvement
            if mastery < 0.5:
                priority = 'high'
                reason = 'Low mastery - needs focused practice'
            elif mastery < self.mastery_threshold:
                priority = 'medium'
                reason = 'Approaching mastery - keep practicing'
            elif days_since > 7:
                priority = 'medium'
                reason = 'Needs refresher to maintain mastery'
            else:
                priority = 'low'
                reason = 'Well mastered'
            
            recommendations.append({
                'skill': skill,
                'masteryLevel': round(mastery, 2),
                'priority': priority,
                'reason': reason,
                'daysSincePractice': days_since
            })
        
        # Sort by priority and mastery level
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        recommendations.sort(key=lambda x: (priority_order[x['priority']], -x['masteryLevel']), reverse=True)
        
        return recommendations[:10]  # Top 10 recommendations
