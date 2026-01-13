import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartLine, FaBrain, FaClock, FaTrophy } from 'react-icons/fa';

const AnalyticsDashboard = ({ userId, analytics }) => {
  const [chartData, setChartData] = useState({
    performanceOverTime: [],
    subjectDistribution: [],
    weeklyActivity: [],
    skillsRadar: []
  });

  useEffect(() => {
    if (analytics) {
      prepareChartData(analytics);
    } else {
      // Generate sample data for demo
      generateSampleData();
    }
  }, [analytics]);

  const generateSampleData = () => {
    // Performance over time
    const performanceData = [
      { date: 'Week 1', score: 65, completion: 50 },
      { date: 'Week 2', score: 72, completion: 60 },
      { date: 'Week 3', score: 78, completion: 75 },
      { date: 'Week 4', score: 85, completion: 80 },
      { date: 'Week 5', score: 88, completion: 90 },
      { date: 'Week 6', score: 92, completion: 95 }
    ];

    // Subject distribution
    const subjectData = [
      { name: 'Math', value: 30, color: '#8B5CF6' },
      { name: 'Science', value: 25, color: '#3B82F6' },
      { name: 'English', value: 20, color: '#10B981' },
      { name: 'Programming', value: 25, color: '#F59E0B' }
    ];

    // Weekly activity
    const activityData = [
      { day: 'Mon', hours: 2.5, lessons: 3 },
      { day: 'Tue', hours: 3, lessons: 4 },
      { day: 'Wed', hours: 2, lessons: 2 },
      { day: 'Thu', hours: 3.5, lessons: 5 },
      { day: 'Fri', hours: 2.5, lessons: 3 },
      { day: 'Sat', hours: 4, lessons: 6 },
      { day: 'Sun', hours: 1.5, lessons: 2 }
    ];

    // Skills radar
    const skillsData = [
      { skill: 'Problem Solving', value: 85, fullMark: 100 },
      { skill: 'Critical Thinking', value: 78, fullMark: 100 },
      { skill: 'Creativity', value: 92, fullMark: 100 },
      { skill: 'Focus', value: 75, fullMark: 100 },
      { skill: 'Comprehension', value: 88, fullMark: 100 },
      { skill: 'Application', value: 82, fullMark: 100 }
    ];

    setChartData({
      performanceOverTime: performanceData,
      subjectDistribution: subjectData,
      weeklyActivity: activityData,
      skillsRadar: skillsData
    });
  };

  const prepareChartData = (data) => {
    // Transform real analytics data into chart format
    // This will be populated with actual backend data
    generateSampleData(); // For now, use sample data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-3xl" />
          <h2 className="text-2xl font-bold">Your Learning Analytics</h2>
        </div>
        <p className="text-white text-opacity-90">
          Track your progress, identify strengths, and discover areas for improvement
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FaTrophy className="text-yellow-500" />}
          title="Total Score"
          value="85%"
          trend="+5%"
          trendUp={true}
          color="yellow"
        />
        <StatCard
          icon={<FaBrain className="text-purple-500" />}
          title="Lessons Completed"
          value="24"
          trend="+8"
          trendUp={true}
          color="purple"
        />
        <StatCard
          icon={<FaClock className="text-blue-500" />}
          title="Study Time"
          value="18.5h"
          trend="+2.5h"
          trendUp={true}
          color="blue"
        />
        <StatCard
          icon={<FaChartLine className="text-green-500" />}
          title="Improvement"
          value="+27%"
          trend="This month"
          trendUp={true}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.performanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Score %"
              />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                name="Completion %"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.subjectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.subjectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.subjectDistribution.map((subject, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-sm text-gray-600">{subject.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="hours" fill="#3B82F6" name="Study Hours" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lessons" fill="#10B981" name="Lessons" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills Assessment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.skillsRadar}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
              <Radar
                name="Your Skills"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaBrain className="text-purple-600" />
          AI-Powered Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <InsightCard
            emoji="🚀"
            title="Strongest Area"
            description="You excel in creative problem-solving! Keep up the great work."
            color="green"
          />
          <InsightCard
            emoji="💡"
            title="Growth Opportunity"
            description="Focus practice can boost your performance by 15%. Try the focus mode feature!"
            color="yellow"
          />
          <InsightCard
            emoji="🎯"
            title="Recommendation"
            description="Based on your progress, you're ready for intermediate-level math challenges."
            color="blue"
          />
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, trendUp, color }) => {
  const colorClasses = {
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
};

const InsightCard = ({ emoji, title, description, color }) => {
  const colorClasses = {
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    blue: 'border-l-blue-500'
  };

  return (
    <div className={`bg-white rounded-lg p-4 border-l-4 ${colorClasses[color]} shadow-sm`}>
      <div className="text-2xl mb-2">{emoji}</div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default AnalyticsDashboard;
