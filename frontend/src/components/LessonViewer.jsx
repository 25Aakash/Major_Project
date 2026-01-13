import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaBookOpen, FaLightbulb, FaArrowRight, FaVolumeUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LessonViewer = ({ isOpen, onClose, content, onComplete, userId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulate lesson content with steps
  const lessonSteps = [
    {
      type: 'introduction',
      title: content?.title || 'Lesson Introduction',
      content: content?.description || 'Welcome to this lesson! Let\'s begin learning.',
      icon: <FaBookOpen />
    },
    {
      type: 'content',
      title: 'Key Concepts',
      content: generateLessonContent(content?.subject, content?.difficulty),
      icon: <FaLightbulb />
    },
    {
      type: 'quiz',
      title: 'Quick Assessment',
      questions: generateQuiz(content?.subject, content?.difficulty)
    },
    {
      type: 'summary',
      title: 'Great Job!',
      content: 'You\'ve completed this lesson. Review your performance below.'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setProgress(0);
      setAnswers({});
      setScore(0);
      setIsCompleted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setProgress((currentStep / (lessonSteps.length - 1)) * 100);
  }, [currentStep]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleNext = () => {
    const step = lessonSteps[currentStep];
    
    if (step.type === 'quiz') {
      // Calculate quiz score
      const totalQuestions = step.questions.length;
      const correctAnswers = step.questions.filter((q, idx) => 
        answers[idx] === q.correctAnswer
      ).length;
      const calculatedScore = (correctAnswers / totalQuestions) * 100;
      setScore(calculatedScore);
    }

    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      stopSpeaking();
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      stopSpeaking();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(score);
    toast.success(`Lesson completed! Score: ${score.toFixed(0)}%`, {
      position: 'top-center',
      autoClose: 3000
    });
    setTimeout(() => onClose(), 2000);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  if (!isOpen) return null;

  const currentStepData = lessonSteps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{currentStepData.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                  <p className="text-sm opacity-90">Step {currentStep + 1} of {lessonSteps.length}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  onClose();
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-white h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.type === 'content' || currentStepData.type === 'introduction' ? (
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <div className="flex items-start gap-4 mb-4">
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {currentStepData.content}
                        </p>
                        <button
                          onClick={() => isSpeaking ? stopSpeaking() : speakText(currentStepData.content)}
                          className="flex-shrink-0 p-3 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition"
                          title={isSpeaking ? "Stop reading" : "Read aloud"}
                        >
                          {isSpeaking ? <FaVolumeUp size={20} /> : <FaVolume size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    {currentStepData.type === 'introduction' && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-blue-800">
                          <strong>💡 Tip:</strong> Take your time and click the speaker icon to hear the content read aloud!
                        </p>
                      </div>
                    )}
                  </div>
                ) : currentStepData.type === 'quiz' ? (
                  <div className="space-y-6">
                    <p className="text-gray-600 mb-6">Answer the following questions to test your understanding:</p>
                    {currentStepData.questions.map((question, qIdx) => (
                      <div key={qIdx} className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-lg mb-4 text-gray-800">
                          {qIdx + 1}. {question.question}
                        </h4>
                        <div className="space-y-3">
                          {question.options.map((option, oIdx) => (
                            <label
                              key={oIdx}
                              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                                answers[qIdx] === oIdx
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-primary-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${qIdx}`}
                                checked={answers[qIdx] === oIdx}
                                onChange={() => handleAnswerSelect(qIdx, oIdx)}
                                className="mr-3 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="inline-block p-6 bg-green-100 rounded-full">
                      <FaCheckCircle className="text-green-600 text-6xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Congratulations! 🎉</h3>
                    <p className="text-gray-600 text-lg">{currentStepData.content}</p>
                    
                    <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Your Score</p>
                          <p className="text-3xl font-bold text-primary-600">{score.toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Points Earned</p>
                          <p className="text-3xl font-bold text-purple-600">+{content?.points || 10}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
                      <p className="text-yellow-800">
                        <strong>💪 Keep it up!</strong> Consistent learning leads to mastery.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {lessonSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition ${
                    idx === currentStep
                      ? 'bg-primary-600 scale-125'
                      : idx < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={
                currentStepData.type === 'quiz' &&
                Object.keys(answers).length < currentStepData.questions.length
              }
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                currentStepData.type === 'quiz' &&
                Object.keys(answers).length < currentStepData.questions.length
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {currentStep === lessonSteps.length - 1 ? 'Finish' : 'Next'}
              <FaArrowRight />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Helper function to generate lesson content
function generateLessonContent(subject, difficulty) {
  const contents = {
    math: {
      beginner: "Let's learn about basic mathematics! Numbers are all around us. We use them every day to count, measure, and solve problems. In this lesson, we'll explore addition and subtraction. Remember: Addition means putting things together, while subtraction means taking things away. Practice makes perfect!",
      intermediate: "In this lesson, we'll explore algebraic expressions and equations. Algebra uses letters (variables) to represent numbers. For example, in the equation 2x + 5 = 15, we need to find what x equals. This is like solving a puzzle! We'll learn step-by-step methods to solve these equations.",
      advanced: "Welcome to advanced calculus! We'll study derivatives and their applications. A derivative represents the rate of change of a function. It's fundamental in physics, economics, and engineering. We'll explore differentiation rules, the chain rule, and how to apply derivatives to real-world optimization problems."
    },
    science: {
      beginner: "Science helps us understand the world around us! Everything is made of tiny particles called atoms. In this lesson, we'll learn about matter - anything that has mass and takes up space. We'll explore the three states of matter: solids, liquids, and gases. Each state has unique properties!",
      intermediate: "Let's dive into chemistry! Chemical reactions happen all around us - when we cook, when plants grow, when we breathe. We'll learn about reactants (starting materials) and products (what's formed). Understanding chemical equations helps us predict what happens when substances interact.",
      advanced: "Quantum mechanics revolutionized our understanding of atomic and subatomic behavior. In this lesson, we'll explore wave-particle duality, the Heisenberg uncertainty principle, and quantum superposition. These concepts challenge our classical intuition but are essential for modern physics and technology."
    },
    english: {
      beginner: "Reading and writing are powerful skills! In this lesson, we'll practice sentence structure. Every sentence has a subject (who or what) and a predicate (what they do). For example: 'The cat (subject) runs quickly (predicate).' We'll build strong foundation for clear communication.",
      intermediate: "Literary analysis deepens our appreciation of stories. We'll examine themes, symbolism, and character development. When reading, ask: What's the author's message? How do characters change? What symbols represent deeper meanings? Critical thinking enhances comprehension and enjoyment.",
      advanced: "Rhetoric and argumentation are essential for persuasive communication. We'll study ethos (credibility), pathos (emotional appeal), and logos (logical reasoning). Understanding these techniques helps you both construct compelling arguments and critically evaluate others' claims. These skills are invaluable in academic and professional settings."
    },
    programming: {
      beginner: "Programming is like giving instructions to a computer! We'll start with basic concepts: variables (containers for data), loops (repeating actions), and conditions (making decisions). Think of it as writing a recipe - each step must be clear and in the right order. Let's code!",
      intermediate: "Object-oriented programming organizes code into reusable 'objects'. Each object has properties (data) and methods (actions). For example, a 'Car' object might have properties like 'color' and 'speed', and methods like 'accelerate()' and 'brake()'. This makes code more organized and maintainable.",
      advanced: "Algorithm optimization and data structures are crucial for efficient programming. We'll explore Big O notation, hash tables, binary trees, and graph algorithms. Understanding time and space complexity helps you write code that scales. These concepts are fundamental for technical interviews and real-world applications."
    }
  };

  return contents[subject]?.[difficulty] || "Welcome to this exciting lesson! We'll explore fascinating concepts that will expand your knowledge and skills. Pay attention to key points and don't hesitate to review sections that need more practice.";
}

// Helper function to generate quiz questions
function generateQuiz(subject, difficulty) {
  const quizzes = {
    math: {
      beginner: [
        {
          question: "What is 5 + 3?",
          options: ["6", "7", "8", "9"],
          correctAnswer: 2
        },
        {
          question: "If you have 10 apples and give away 4, how many do you have left?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 2
        },
        {
          question: "Which operation means 'putting together'?",
          options: ["Subtraction", "Addition", "Division", "Multiplication"],
          correctAnswer: 1
        }
      ],
      intermediate: [
        {
          question: "Solve for x: 2x + 5 = 15",
          options: ["x = 3", "x = 4", "x = 5", "x = 10"],
          correctAnswer: 2
        },
        {
          question: "What is the value of 3² + 4²?",
          options: ["25", "49", "12", "7"],
          correctAnswer: 0
        },
        {
          question: "Simplify: 3(x + 2) - x",
          options: ["2x + 2", "2x + 6", "4x + 2", "2x + 3"],
          correctAnswer: 1
        }
      ],
      advanced: [
        {
          question: "What is the derivative of x³?",
          options: ["x²", "2x²", "3x²", "x³"],
          correctAnswer: 2
        },
        {
          question: "∫ 2x dx = ?",
          options: ["x²", "x² + C", "2x²", "2x² + C"],
          correctAnswer: 1
        },
        {
          question: "At what point does f(x) = x² - 4x + 3 reach its minimum?",
          options: ["x = 1", "x = 2", "x = 3", "x = 4"],
          correctAnswer: 1
        }
      ]
    },
    science: {
      beginner: [
        {
          question: "What are the three states of matter?",
          options: ["Solid, Liquid, Gas", "Hot, Cold, Warm", "Big, Small, Medium", "Fast, Slow, Still"],
          correctAnswer: 0
        },
        {
          question: "What do plants need to make food?",
          options: ["Soil only", "Water only", "Sunlight, water, and air", "Fertilizer only"],
          correctAnswer: 2
        },
        {
          question: "What is the smallest unit of matter?",
          options: ["Molecule", "Cell", "Atom", "Particle"],
          correctAnswer: 2
        }
      ],
      intermediate: [
        {
          question: "What is the chemical formula for water?",
          options: ["H2O", "CO2", "O2", "H2O2"],
          correctAnswer: 0
        },
        {
          question: "In a chemical reaction, substances that start are called:",
          options: ["Products", "Reactants", "Catalysts", "Elements"],
          correctAnswer: 1
        },
        {
          question: "What type of bond shares electrons?",
          options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
          correctAnswer: 1
        }
      ],
      advanced: [
        {
          question: "According to Heisenberg, what cannot be precisely measured simultaneously?",
          options: ["Mass and velocity", "Position and momentum", "Energy and time", "All of the above"],
          correctAnswer: 3
        },
        {
          question: "Schrödinger's wave function describes:",
          options: ["Particle location", "Probability amplitude", "Energy levels", "Spin states"],
          correctAnswer: 1
        },
        {
          question: "Quantum superposition means a particle can be in:",
          options: ["One state only", "Two states simultaneously", "Multiple states simultaneously", "No state"],
          correctAnswer: 2
        }
      ]
    },
    programming: {
      beginner: [
        {
          question: "What stores data in programming?",
          options: ["Function", "Variable", "Loop", "Comment"],
          correctAnswer: 1
        },
        {
          question: "Which keyword repeats code multiple times?",
          options: ["if", "for", "print", "import"],
          correctAnswer: 1
        },
        {
          question: "What checks if something is true or false?",
          options: ["Variable", "Loop", "Condition", "String"],
          correctAnswer: 2
        }
      ],
      intermediate: [
        {
          question: "In OOP, what is a blueprint for creating objects?",
          options: ["Function", "Class", "Module", "Package"],
          correctAnswer: 1
        },
        {
          question: "What principle hides internal implementation details?",
          options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"],
          correctAnswer: 2
        },
        {
          question: "What allows a subclass to inherit from a parent class?",
          options: ["Composition", "Aggregation", "Inheritance", "Association"],
          correctAnswer: 2
        }
      ],
      advanced: [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correctAnswer: 1
        },
        {
          question: "Which data structure uses LIFO (Last In, First Out)?",
          options: ["Queue", "Stack", "Tree", "Graph"],
          correctAnswer: 1
        },
        {
          question: "What algorithm technique divides problems into smaller subproblems?",
          options: ["Greedy", "Dynamic Programming", "Brute Force", "Backtracking"],
          correctAnswer: 1
        }
      ]
    }
  };

  // Default quiz if subject/difficulty not found
  const defaultQuiz = [
    {
      question: "Did you understand the main concepts presented?",
      options: ["Yes, completely", "Mostly, but some parts were unclear", "Somewhat", "Need to review"],
      correctAnswer: 0
    },
    {
      question: "Which learning method helped you most?",
      options: ["Reading the text", "Visual aids", "Practice examples", "All of the above"],
      correctAnswer: 3
    },
    {
      question: "How confident do you feel about this topic now?",
      options: ["Very confident", "Confident", "Somewhat confident", "Need more practice"],
      correctAnswer: 0
    }
  ];

  return quizzes[subject]?.[difficulty] || defaultQuiz;
}

export default LessonViewer;
