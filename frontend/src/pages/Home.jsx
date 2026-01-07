import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaBrain, FaRocket, FaUsers, FaChartLine, FaAccessibleIcon } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FaBrain className="text-6xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to NeuroLearn
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              An AI-Powered Adaptive Learning Platform Designed for Neurodiverse Students
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto">
              Personalized learning experiences that adapt to your unique learning style, pace, and needs.
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition duration-300"
                >
                  Login
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose NeuroLearn?</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Built specifically for students with ADHD, Autism, Dyslexia, Dyscalculia, and other learning differences
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaRocket className="text-4xl text-primary-600" />}
              title="AI-Powered Adaptation"
              description="Machine learning algorithms adapt content delivery and pacing to your individual learning patterns"
            />
            <FeatureCard
              icon={<FaAccessibleIcon className="text-4xl text-primary-600" />}
              title="Accessibility First"
              description="WCAG 2.1 AA compliant with customizable fonts, colors, text-to-speech, and more"
            />
            <FeatureCard
              icon={<FaChartLine className="text-4xl text-primary-600" />}
              title="Progress Tracking"
              description="Comprehensive analytics showing your learning journey and achievements"
            />
            <FeatureCard
              icon={<FaUsers className="text-4xl text-primary-600" />}
              title="Multi-Format Content"
              description="Visual, auditory, kinesthetic, and interactive learning materials"
            />
          </div>
        </div>
      </section>

      {/* Neurodiversity Support Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Supporting All Learning Styles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <SupportCard
              title="ADHD Support"
              features={[
                'Focus mode with minimal distractions',
                'Break reminders and timers',
                'Gamification for engagement',
                'Short, chunked content'
              ]}
            />
            <SupportCard
              title="Dyslexia Support"
              features={[
                'OpenDyslexic font option',
                'Adjustable text spacing',
                'Text-to-speech functionality',
                'High contrast modes'
              ]}
            />
            <SupportCard
              title="Autism Support"
              features={[
                'Predictable structure',
                'Visual schedules',
                'Sensory-friendly design',
                'Clear instructions'
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl mb-10">
            Join NeuroLearn today and discover a platform that truly understands your needs.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const SupportCard = ({ title, features }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold mb-4 text-primary-600">{title}</h3>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Home;
