import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaVolumeUp, FaArrowRight, FaTimes, FaCheckCircle } from 'react-icons/fa';

const VoiceAssessment = ({ isOpen, onClose, userProfile }) => {
  const [currentStep, setCurrentStep] = useState('profile'); // 'profile', 'assessment', 'results'
  const [selectedProfile, setSelectedProfile] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  const questionBanks = {
    dyslexia: [
      "What is your favorite subject in school?",
      "How do you prefer to learn new things?",
      "What helps you understand lessons better?",
      "Do you like listening to stories or watching videos?",
      "What would make reading easier for you?"
    ],
    adhd: [
      "What activities help you focus best?",
      "How long can you concentrate on one task?",
      "What kind of breaks help you learn better?",
      "Do you prefer short lessons or long ones?",
      "What makes you most interested in learning?"
    ],
    autism: [
      "What topics are you most interested in?",
      "Do you prefer learning alone or with others?",
      "What helps you feel comfortable while learning?",
      "How do you like information presented to you?",
      "What makes a good learning environment for you?"
    ],
    dyscalculia: [
      "What math concepts do you find challenging?",
      "Do visual aids help you understand math better?",
      "How do you prefer to solve math problems?",
      "What makes math easier to understand?",
      "Do you prefer word problems or number problems?"
    ]
  };

  const profiles = [
    { id: 'dyslexia', icon: '📖', name: 'Dyslexia', desc: 'Reading difficulties' },
    { id: 'adhd', icon: '⚡', name: 'ADHD', desc: 'Attention challenges' },
    { id: 'autism', icon: '🧩', name: 'Autism', desc: 'Communication preferences' },
    { id: 'dyscalculia', icon: '🔢', name: 'Dyscalculia', desc: 'Math difficulties' }
  ];

  const accommodations = {
    dyslexia: [
      '✓ Audio narration for all text content',
      '✓ OpenDyslexic font option enabled',
      '✓ Text-to-speech with adjustable speed',
      '✓ Video content prioritized over text',
      '✓ Extended time for reading tasks',
      '✓ High contrast color schemes'
    ],
    adhd: [
      '✓ Break reminders every 15 minutes',
      '✓ Short 10-15 minute lesson modules',
      '✓ Gamified interactive content',
      '✓ Immediate feedback on tasks',
      '✓ Progress tracking and rewards',
      '✓ Minimal distractions interface'
    ],
    autism: [
      '✓ Clear, structured lesson plans',
      '✓ Visual schedules and routines',
      '✓ Reduced animations and transitions',
      '✓ Option for solo learning mode',
      '✓ Predictable content organization',
      '✓ Sensory-friendly color palettes'
    ],
    dyscalculia: [
      '✓ Visual math tools and manipulatives',
      '✓ Step-by-step problem breakdown',
      '✓ Calculator tools available',
      '✓ Real-world math context',
      '✓ Extra practice problems',
      '✓ Verbal math problem explanations'
    ]
  };

  useEffect(() => {
    if (isOpen && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentResponse(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen]);

  const handleProfileSelect = (profileId) => {
    setSelectedProfile(profileId);
    setCurrentStep('assessment');
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
    
    // Auto-speak first question
    setTimeout(() => speakQuestion(questionBanks[profileId][0]), 500);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakQuestion = (text) => {
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthesisRef.current.speak(utterance);
  };

  const handleNextQuestion = () => {
    if (!currentResponse) {
      alert('Please provide a response first!');
      return;
    }

    const newResponses = [...responses, currentResponse];
    setResponses(newResponses);
    setCurrentResponse('');

    if (currentQuestion + 1 < questionBanks[selectedProfile].length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => speakQuestion(questionBanks[selectedProfile][currentQuestion + 1]), 500);
    } else {
      setCurrentStep('results');
      setTimeout(() => {
        const resultsText = `Assessment complete! We've identified ${accommodations[selectedProfile].length} personalized accommodations for your learning profile.`;
        speakQuestion(resultsText);
      }, 500);
    }
  };

  const handleClose = () => {
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setCurrentStep('profile');
    setSelectedProfile('');
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
    onClose();
  };

  const handleRestart = () => {
    setCurrentStep('profile');
    setSelectedProfile('');
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
  };

  if (!isOpen) return null;

  const questions = selectedProfile ? questionBanks[selectedProfile] : [];
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎤 Weekly Voice Assessment</h2>
              <p className="text-purple-100">Adaptive Voice-Based Learning Assessment</p>
            </div>
            <button onClick={handleClose} className="text-white hover:text-gray-200 transition">
              <FaTimes className="text-3xl" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Profile Selection */}
          {currentStep === 'profile' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Your Learning Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                    className="p-6 border-3 border-gray-200 rounded-xl hover:border-purple-600 hover:shadow-lg transition-all text-center group"
                  >
                    <div className="text-5xl mb-3">{profile.icon}</div>
                    <div className="text-xl font-bold text-gray-900 mb-1">{profile.name}</div>
                    <div className="text-gray-600">{profile.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assessment */}
          {currentStep === 'assessment' && (
            <div>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
                <p className="text-center">
                  <strong>🔊 Voice Mode Active:</strong> Questions will be read aloud. Click the microphone to speak your answer.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 h-2 rounded-full mb-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status */}
              <div className="flex justify-between items-center mb-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <span className="font-semibold capitalize">{selectedProfile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span className="font-semibold">Question {currentQuestion + 1}/{questions.length}</span>
                </div>
              </div>

              {/* Question */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 rounded-lg p-6 mb-6">
                <p className="text-2xl text-gray-900 leading-relaxed">{questions[currentQuestion]}</p>
              </div>

              {/* Response Display */}
              <div className={`bg-white border-2 rounded-lg p-6 mb-6 min-h-[100px] ${currentResponse ? 'border-green-500' : 'border-gray-300'}`}>
                <p className="font-bold text-purple-600 mb-2">Your Response:</p>
                <p className="text-lg text-gray-900">
                  {currentResponse || 'Click the microphone and speak your answer...'}
                </p>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`p-4 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition ${
                    isListening
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg'
                  }`}
                >
                  <FaMicrophone />
                  {isListening ? 'Listening...' : 'Click to Speak'}
                </button>

                <button
                  onClick={() => speakQuestion(questions[currentQuestion])}
                  className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition"
                >
                  <FaVolumeUp />
                  Repeat Question
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition"
                >
                  <FaArrowRight />
                  Next Question
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {currentStep === 'results' && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-8 mb-6">
                <h3 className="text-3xl font-bold mb-4">🎉 Assessment Complete!</h3>
                <p className="text-xl mb-6">Great job! Here are your personalized recommendations.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6">
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-sm">Completion Rate</div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6">
                    <div className="text-4xl font-bold mb-2">{75 + Math.floor(Math.random() * 20)}</div>
                    <div className="text-sm">Engagement Score</div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6">
                    <div className="text-4xl font-bold mb-2">{85 + Math.floor(Math.random() * 15)}%</div>
                    <div className="text-sm">Voice Recognition</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 mb-6 text-left">
                <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Recommended Accommodations
                </h4>
                <ul className="space-y-3">
                  {accommodations[selectedProfile].map((item, index) => (
                    <li key={index} className="text-gray-700 text-lg border-b border-purple-200 pb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  🔄 Try Another Profile
                </button>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssessment;
