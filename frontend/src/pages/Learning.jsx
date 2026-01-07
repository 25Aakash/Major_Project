import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { contentAPI, learningAPI, interactionAPI } from '../services/api';
import { FaBook, FaFilter, FaPlay, FaVideo } from 'react-icons/fa';
import VideoPlayer from '../components/VideoPlayer';

const Learning = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [adaptivePath, setAdaptivePath] = useState(null);
  const [filters, setFilters] = useState({ subject: '', difficulty: '' });
  const [loading, setLoading] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchLearningData();
  }, [isAuthenticated, filters]);

  const fetchLearningData = async () => {
    try {
      const [contentRes, pathRes] = await Promise.all([
        contentAPI.getAll(filters),
        learningAPI.getAdaptivePath(user.id)
      ]);

      setContent(contentRes.data.content || []);
      setAdaptivePath(pathRes.data);
    } catch (error) {
      console.error('Error fetching learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = async (contentId) => {
    try {
      // Log interaction
      await interactionAPI.log({
        userId: user.id,
        sessionId: Date.now().toString(),
        contentId,
        interactionType: 'view',
        timestamp: new Date()
      });

      // Navigate to lesson (you can create a detailed lesson page)
      alert('Lesson started! (Detailed lesson view coming soon)');
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const handleComplete = async (contentId) => {
    try {
      await learningAPI.markComplete(user.id, contentId);
      
      // Log completion
      await interactionAPI.log({
        userId: user.id,
        sessionId: Date.now().toString(),
        contentId,
        interactionType: 'complete',
        completionRate: 100,
        performance: { score: 100, attempts: 1, hints: 0, timeSpent: 0 },
        timestamp: new Date()
      });

      alert('Lesson completed! Points added to your account.');
      fetchLearningData(); // Refresh data
    } catch (error) {
      console.error('Error marking complete:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Center</h1>

        {/* Adaptive Learning Path */}
        {adaptivePath && (
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Adaptive Learning Path</h2>
            <p className="mb-4">
              Based on your performance, we recommend {adaptivePath.recommendedDifficulty} level content.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold">Current Level</p>
                <p className="text-2xl">{adaptivePath.userLevel}</p>
              </div>
              <div>
                <p className="font-semibold">Avg Performance</p>
                <p className="text-2xl">{adaptivePath.avgPerformance}%</p>
              </div>
              <div>
                <p className="font-semibold">Next Steps</p>
                <p className="text-2xl">{adaptivePath.learningPath?.length || 0} lessons</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Filter Content</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Subjects</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="programming">Programming</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <button
              onClick={() => setFilters({ subject: '', difficulty: '' })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Available Content</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Video Card */}
            <VideoCard onClick={() => setIsVideoOpen(true)} />
            
            {/* Learning Content Cards */}
            {content.map(item => (
              <LearningCard
                key={item._id}
                content={item}
                onStart={() => handleStartLesson(item._id)}
                onComplete={() => handleComplete(item._id)}
                isCompleted={user?.completedLessons?.includes(item._id)}
              />
            ))}
          </div>
          
          {content.length === 0 && (
            <div className="text-center py-8">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600">No content found. Try adjusting your filters.</p>
            </div>
          )}
        </div>

        {/* Video Player Modal */}
        <VideoPlayer
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoSrc="/demo-video.mp4"
          title="Learning Content Demo Video"
        />
      </div>
    </div>
  );
};

const VideoCard = ({ onClick }) => (
  <div 
    className="border-2 border-red-500 rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer group"
    onClick={onClick}
  >
    {/* Video Thumbnail */}
    <div className="relative bg-black aspect-video">
      <video 
        src="/demo-video.mp4"
        className="w-full h-full object-cover"
        muted
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition">
        <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition">
          <FaPlay className="text-white text-2xl ml-1" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs">
        5:30
      </div>
    </div>
    
    {/* Video Info */}
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
        Learning Content Demo Video
      </h3>
      <div className="flex items-center text-gray-600 text-sm">
        <FaVideo className="mr-2" />
        <span>Demo Content</span>
      </div>
    </div>
  </div>
);

const LearningCard = ({ content, onStart, onComplete, isCompleted }) => (
  <div className="border rounded-lg p-6 hover:shadow-lg transition">
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-bold text-lg text-gray-900">{content.title}</h3>
      {isCompleted && (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          ✓ Completed
        </span>
      )}
    </div>
    
    <p className="text-gray-600 text-sm mb-4">{content.description}</p>
    
    <div className="flex items-center justify-between mb-4">
      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
        {content.difficulty}
      </span>
      <span className="text-sm text-gray-500">{content.duration || 10} min</span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-primary-600">{content.points} points</span>
      {!isCompleted ? (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
        >
          <FaPlay className="mr-2" />
          Start
        </button>
      ) : (
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Review
        </button>
      )}
    </div>
  </div>
);

export default Learning;
