import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { learningAPI, interactionAPI } from '../services/api';
import { FaTrophy, FaStar, FaBook, FaChartLine, FaBrain } from 'react-icons/fa';

const Dashboard = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
