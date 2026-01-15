import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { learningAPI, interactionAPI } from '../services/api';
import { FaTrophy, FaStar, FaBook, FaChartLine, FaBrain, FaMicrophone, FaDownload, FaBolt, FaClock, FaFire } from 'react-icons/fa';
import VoiceAssessment from '../components/VoiceAssessment';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const Dashboard = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  
  // AI Adaptive Features (Feature #6, #11, #12)
  const [performancePrediction, setPerformancePrediction] = useState(null);
  const [personalizedTips, setPersonalizedTips] = useState([]);
  const [skillMastery, setSkillMastery] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      const [recRes, analyticsRes] = await Promise.all([
        learningAPI.getRecommendations(user.id),
        interactionAPI.getAnalytics(user.id)
      ]);

      setRecommendations(recRes.data.recommendations || []);
      setAnalytics(analyticsRes.data);
      
      // Fetch AI predictions (Feature #6, #11, #12)
      await fetchAIPredictions();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch AI predictions and insights
  const fetchAIPredictions = async () => {
    try {
      // Get interaction history
      const historyRes = await interactionAPI.getHistory(user.id);
      const interactionHistory = historyRes.data?.interactions || [];
      
      // Get performance prediction - wrapped in try-catch to handle ML API being down
      try {
        const predictionRes = await axios.post('http://localhost:5001/api/ml/predict-performance', {
          userId: user.id,
          interactionHistory
        });
        setPerformancePrediction(predictionRes.data);
      } catch (err) {
        console.log('ML prediction not available yet - ML API might not be running');
      }
      
      // Get personalized tips - wrapped in try-catch
      try {
        const tipsRes = await axios.get(`http://localhost:5000/api/interventions/personalized-tips/${user.id}`);
        setPersonalizedTips(tipsRes.data.tips || []);
      } catch (err) {
        console.log('Personalized tips not available yet');
      }
      
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
      // Don't throw error - allow dashboard to load without predictions
    }
  };

  const handleExportReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text('NeuroLearn Progress Report', 105, 20, { align: 'center' });
    
    // User Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student: ${user?.name || 'N/A'}`, 20, 40);
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, 48);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 56);
    
    // Stats
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.text('Performance Summary', 20, 70);
    
    doc.autoTable({
      startY: 75,
      head: [['Metric', 'Value']],
      body: [
        ['Current Level', user?.currentLevel || '1'],
        ['Total Points', user?.totalPoints || '0'],
        ['Lessons Completed', user?.completedLessons?.length || '0'],
        ['Average Score', '85%'],
        ['Study Time', '18.5 hours'],
        ['Improvement Rate', '+27%']
      ],
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }
    });
    
    // Learning Profile
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.text('Learning Profile', 20, doc.lastAutoTable.finalY + 15);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Learning Style: ${user?.learningStyle || 'Mixed'}`, 20, doc.lastAutoTable.finalY + 23);
    doc.text(`Neurodiversity Profile: ${user?.neurodiversityType?.join(', ') || 'N/A'}`, 20, doc.lastAutoTable.finalY + 31);
    
    // Recommendations
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.text('AI Recommendations', 20, doc.lastAutoTable.finalY + 45);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('• Continue practicing daily for optimal retention', 20, doc.lastAutoTable.finalY + 53);
    doc.text('• You excel in creative problem-solving', 20, doc.lastAutoTable.finalY + 61);
    doc.text('• Ready for intermediate-level challenges', 20, doc.lastAutoTable.finalY + 69);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by NeuroLearn - AI-Powered Adaptive Learning Platform', 105, 280, { align: 'center' });
    
    // Save
    doc.save(`NeuroLearn_Report_${user?.name?.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">Ready to continue your learning journey?</p>
            </div>
            <FaBrain className="text-6xl text-primary-600" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaTrophy className="text-yellow-500 text-3xl" />}
            title="Current Level"
            value={user?.currentLevel || 1}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<FaStar className="text-purple-500 text-3xl" />}
            title="Total Points"
            value={user?.totalPoints || 0}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<FaBook className="text-blue-500 text-3xl" />}
            title="Completed Lessons"
            value={user?.completedLessons?.length || 0}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<FaChartLine className="text-green-500 text-3xl" />}
            title="Learning Streak"
            value="5 days"
            bgColor="bg-green-50"
          />
        </div>

        {/* Weekly Assessment Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-8 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FaMicrophone className="text-4xl" />
                <h2 className="text-2xl font-bold">Weekly Voice Assessment</h2>
              </div>
              <p className="text-purple-100 mb-4">
                Take your personalized voice-based assessment to help us understand your learning needs better.
              </p>
              <button
                onClick={() => setIsAssessmentOpen(true)}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition shadow-md"
              >
                🎤 Start Assessment
              </button>
            </div>
            <div className="hidden md:block text-8xl opacity-20">
              🎯
            </div>
          </div>
        </div>

        {/* Learning Profile */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Learning Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Learning Style</h3>
              <p className="text-gray-600 capitalize">{user?.learningStyle || 'Mixed'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Neurodiversity Profile</h3>
              <div className="flex flex-wrap gap-2">
                {user?.neurodiversityType?.map(type => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Performance Prediction (Feature #6) */}
        {performancePrediction && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <FaBolt className="text-3xl text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">AI Performance Prediction</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{performancePrediction.predictedScore}%</div>
                <div className="text-sm text-gray-600 mt-1">Predicted Next Score</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-purple-600 capitalize">{performancePrediction.trend}</div>
                <div className="text-sm text-gray-600 mt-1">Performance Trend</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">{performancePrediction.improvementRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Improvement Rate</div>
              </div>
            </div>
            {performancePrediction.recommendations && performancePrediction.recommendations.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">AI Recommendations:</h3>
                <ul className="space-y-2">
                  {performancePrediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <FaBolt className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Personalized Learning Tips (Feature #5, #7, #12) */}
        {personalizedTips && personalizedTips.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <FaClock className="text-3xl text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Learning Tips</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {personalizedTips.map((tip, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{tip.icon}</span>
                    <h3 className="font-bold text-gray-900">{tip.message}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{tip.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Learning Rhythm Insights (Feature #5) */}
        {user?.learningRhythm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <FaFire className="text-3xl text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your Learning Rhythm</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{user.learningRhythm.optimalStudyDuration} min</div>
                <div className="text-xs text-gray-600 mt-1">Optimal Session</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 capitalize">{user.learningRhythm.bestTimeOfDay}</div>
                <div className="text-xs text-gray-600 mt-1">Best Time</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user.learningRhythm.averageAttentionSpan} min</div>
                <div className="text-xs text-gray-600 mt-1">Attention Span</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{user.learningRhythm.preferredBreakInterval} min</div>
                <div className="text-xs text-gray-600 mt-1">Break Interval</div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        <AnalyticsDashboard userId={user?.id} analytics={analytics} />

        {/* Export Report Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleExportReport}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2 font-semibold"
          >
            <FaDownload />
            Export Progress Report (PDF)
          </button>
        </div>

        {/* Recommended Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
          {recommendations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 6).map(content => (
                <ContentCard key={content._id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No recommendations yet. Start exploring content!</p>
              <button
                onClick={() => navigate('/learning')}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Browse Content
              </button>
            </div>
          )}
        </div>

        {/* Voice Assessment Modal */}
        <VoiceAssessment
          isOpen={isAssessmentOpen}
          onClose={() => setIsAssessmentOpen(false)}
          userProfile={user?.neurodiversityType?.[0] || 'general'}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-md`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const ContentCard = ({ content }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition">
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-semibold text-gray-900">{content.title}</h3>
      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
        {content.difficulty}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{content.description?.substring(0, 80)}...</p>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{content.subject}</span>
      <span className="text-sm font-medium text-primary-600">{content.points} pts</span>
    </div>
  </div>
);

export default Dashboard;
