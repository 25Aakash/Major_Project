# NeuroLearn: AI-Powered Adaptive Learning Platform

## Project Overview
An intelligent learning platform designed specifically for neurodiverse students, using AI/ML to adapt content delivery, pacing, and interface based on individual learning patterns and performance.

## 🚀 Quick Start

### Easy Start (Recommended)
```powershell
.\start-all.ps1
```

Then open: **http://localhost:3000**

Demo Login:
- Email: `demo@neurolearn.com`
- Password: `demo123`

---

## Team Members
- **Aakash Khandelwal** - ML/AI & Dataset Management
- **Naman Singhal** - Backend Development
- **Yash Goyal** - Frontend Development & UI/UX

## Tech Stack
- **Frontend**: React.js 18, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **ML/AI**: Python 3.12, Flask, scikit-learn, NumPy, Pandas
- **Accessibility**: WCAG 2.1 AA compliance
- **Additional**: JWT Auth, bcryptjs, jsPDF, Web Speech API

---

## ✨ Complete Features List

### 🎯 Core Learning Features
✅ **Interactive Lesson Viewer**
   - Multi-step lessons (Introduction → Content → Quiz → Summary)
   - Built-in text-to-speech for all content
   - Real-time progress tracking
   - Subject-specific quizzes (Math, Science, English, Programming)
   - Instant score calculation and feedback

✅ **Adaptive Learning Path**
   - ML-powered difficulty adjustment
   - Performance-based recommendations
   - Personalized content sequencing
   - Real-time adaptation based on scores

✅ **Content Library**
   - 10+ sample lessons across subjects
   - Multiple formats (Text, Video, Audio, Interactive)
   - Difficulty levels (Beginner, Intermediate, Advanced)
   - Points and rewards system

### 📊 Analytics & Insights
✅ **Beautiful Dashboard Charts**
   - Performance trends over time (Line charts)
   - Subject distribution (Pie charts)
   - Weekly activity tracking (Bar charts)
   - Skills assessment radar chart
   - Interactive tooltips and legends

✅ **AI-Powered Insights**
   - Strength identification
   - Growth opportunity detection
   - Personalized recommendations
   - Study habit analysis

✅ **PDF Progress Reports**
   - One-click export functionality
   - Comprehensive performance summary
   - Learning profile details
   - AI recommendations included
   - Professional formatting

### 🤖 Machine Learning Integration
✅ **Flask ML API Service**
   - Runs on port 5001
   - RESTful endpoints for predictions
   - Real-time recommendation engine
   - Adaptive difficulty algorithm
   - Engagement prediction model
   - Learning insights generation

✅ **Backend ML Integration**
   - Automatic ML service connection
   - Fallback mechanisms for reliability
   - Performance-based adaptation
   - Content recommendation system
   - User pattern analysis

### 🎤 Assessment & Profiling
✅ **Voice Assessment System**
   - Speech recognition integration
   - Profile-specific questions (ADHD, Dyslexia, Autism, Dyscalculia)
   - Interactive voice responses
   - Personalized accommodations
   - Text-to-speech guidance

✅ **User Profiling**
   - Neurodiversity type selection
   - Learning style preferences
   - Accessibility settings
   - Performance tracking

### ⚙️ Admin Features
✅ **Content Management Panel**
   - Create/Edit/Delete content
   - Rich form with all fields
   - Active/Inactive status control
   - Filter by subject/difficulty/format
   - Bulk content management

### ♿ Accessibility Features
✅ **WCAG 2.1 AA Compliant**
   - OpenDyslexic font option
   - Adjustable font sizes (14-24px)
   - High contrast modes
   - Text-to-speech throughout
   - Keyboard navigation support
   - Screen reader compatible

✅ **Neurodiversity-Specific**
   - ADHD: Short sessions, break reminders, gamification
   - Dyslexia: Special fonts, audio narration, visual aids
   - Autism: Clear structure, reduced animations, solo mode
   - Dyscalculia: Visual math tools, step-by-step breakdown

### 🎨 User Experience
✅ **Modern UI/UX**
   - Smooth animations with Framer Motion
   - Responsive design (mobile/tablet/desktop)
   - Toast notifications for feedback
   - Loading states throughout
   - Error handling with user-friendly messages

✅ **Navigation**
   - Home page with feature showcase
   - Dashboard with comprehensive overview
   - Learning center with lesson browser
   - Settings for personalization
   - Admin panel for content management

---

## 📁 Project Structure
```
major_project/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints (ML integrated)
│   ├── services/     # ML service client
│   └── server.js     # Main server
├── frontend/         # React.js application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── AnalyticsDashboard.jsx  # Charts
│   │   │   ├── LessonViewer.jsx        # Interactive lessons
│   │   │   ├── VoiceAssessment.jsx     # Voice system
│   │   │   └── ...
│   │   ├── pages/       # Route pages
│   │   │   ├── Dashboard.jsx           # Analytics + Export
│   │   │   ├── Learning.jsx            # Lesson browser
│   │   │   ├── AdminPanel.jsx          # Content management
│   │   │   └── ...
│   │   └── services/    # API integration
│   └── ...
├── ml-module/        # Python ML models & API
│   ├── ml_api.py     # Flask API server
│   ├── src/          # ML algorithms
│   ├── datasets/     # Training data
│   └── models/       # Trained models
├── docs/             # Documentation
├── start-all.ps1     # Startup script
└── COMPLETE_DEMO_GUIDE.md  # Demo instructions
```

---

## 🔧 Setup Instructions

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **Python 3.11+** - [Download](https://python.org)

### Option 1: Automatic Setup (Recommended)
```powershell
# Run the startup script
.\start-all.ps1
```

### Option 2: Manual Setup

**1. Backend**
```powershell
cd backend
npm install
npm run dev  # Starts on port 5000
```

**2. Frontend**
```powershell
cd frontend
npm install --legacy-peer-deps
npm run dev  # Starts on port 3000
```

**3. ML API**
```powershell
cd ml-module
pip install -r requirements.txt
python ml_api.py  # Starts on port 5001
```

**4. Database**
```powershell
# Start MongoDB
net start MongoDB

# Seed data
cd backend
node seedData.js
```

---

## 🎯 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:5000 | REST API |
| ML API | http://localhost:5001 | Machine learning service |
| ML Health Check | http://localhost:5001/health | ML service status |
| Admin Panel | http://localhost:3000/admin | Content management |

---

## 📸 Key Features Showcase

### 1. Interactive Lessons
- Step-by-step learning with quizzes
- Text-to-speech for every section
- Real-time progress indicators
- Instant feedback and scoring

### 2. Analytics Dashboard
- **Performance Trends**: Track improvement over time
- **Subject Distribution**: Visual breakdown of learning areas
- **Weekly Activity**: Study patterns and engagement
- **Skills Radar**: Comprehensive skill assessment
- **AI Insights**: Personalized recommendations

### 3. ML-Powered Adaptation
- Automatic difficulty adjustment
- Content format recommendations
- Study habit optimization
- Engagement prediction

### 4. Accessibility Excellence
- Multiple font options including OpenDyslexic
- Adjustable text sizes
- High contrast modes
- Complete keyboard navigation
- Text-to-speech throughout

### 5. Admin Capabilities
- Full CRUD operations on content
- Filter and search functionality
- Bulk content management
- Active/inactive status control

---

## 🧠 Machine Learning Features

### Implemented Algorithms
1. **Adaptive Difficulty Engine**
   - Analyzes recent performance (score + completion rate)
   - Recommends optimal difficulty level
   - Confidence scoring for recommendations
   - Prevents sudden difficulty drops

2. **Content Recommender**
   - Matches learning style to content format
   - Considers neurodiversity profile
   - Prioritizes incomplete lessons
   - Engagement-based ranking

3. **Learning Insights Generator**
   - Session duration analysis
   - Completion pattern recognition
   - Focus level tracking
   - Personalized improvement suggestions

4. **Engagement Predictor**
   - Predicts likelihood of content completion
   - Matches user preferences to content features
   - Optimizes content sequencing

### ML API Endpoints
- `POST /api/ml/recommend` - Get personalized recommendations
- `POST /api/ml/adaptive-difficulty` - Get difficulty suggestion
- `POST /api/ml/predict-engagement` - Predict engagement score
- `POST /api/ml/learning-insights` - Generate AI insights
- `GET /health` - Check ML service status

---

## 🎓 Demo Flow (15 minutes)

### Part 1: Introduction (2 min)
- Show landing page
- Explain problem statement
- Highlight key features

### Part 2: User Registration (2 min)
- Create new user
- Select ADHD profile
- Set preferences

### Part 3: Dashboard & Analytics (3 min)
- View performance charts
- Show AI insights
- Export PDF report

### Part 4: Learning Experience (5 min)
- Browse content library
- Start interactive lesson
- Complete quiz
- See adaptive recommendations

### Part 5: Advanced Features (3 min)
- Voice assessment demo
- Admin panel showcase
- ML API health check
- Accessibility features

---

## 🏆 Technical Highlights

### Architecture
- ✅ Microservices with separate ML API
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ MongoDB for data persistence
- ✅ Real-time ML integration

### Code Quality
- ✅ Modular component structure
- ✅ Reusable service layer
- ✅ Error handling throughout
- ✅ Fallback mechanisms
- ✅ Loading states and user feedback

### Performance
- ✅ Efficient React rendering
- ✅ Lazy loading components
- ✅ API response caching
- ✅ Optimized database queries
- ✅ Minimal bundle size

---

## 📊 Current Status

🟢 **Fully Functional** - All major features implemented and tested
🟢 **Demo Ready** - Professional presentation quality
🟢 **Documented** - Comprehensive guides and comments
🟢 **Accessible** - WCAG 2.1 AA compliant
🟢 **ML Integrated** - Real-time adaptive learning

---

## 🎯 Achievements

✅ Interactive lesson system with quizzes
✅ Beautiful analytics with Recharts
✅ PDF export functionality
✅ ML API with Flask
✅ Real-time adaptive difficulty
✅ Voice assessment system
✅ Admin content management
✅ Text-to-speech integration
✅ Comprehensive accessibility
✅ Professional UI/UX with animations

---

## 📚 Documentation

- `COMPLETE_DEMO_GUIDE.md` - Comprehensive demo instructions
- `DEMO_READY.md` - Quick start guide
- `docs/PRESENTATION_NOTES.md` - Faculty presentation notes
- `docs/ML_INTEGRATION_GUIDE.md` - ML technical details
- `docs/PROGRESS.md` - Development timeline

---

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation on all endpoints
- CORS configuration
- Environment variables for secrets

---

## 🚀 Future Enhancements

- Real video content integration
- Mobile app (React Native)
- Peer-to-peer learning
- Teacher dashboard
- Parent monitoring portal
- Advanced ML models (TensorFlow)
- Cloud deployment (AWS/Azure)
- Real-time collaboration
- Blockchain certificates
- VR/AR learning modules

---

## 📞 Support & Contact

For questions or issues:
- Check `COMPLETE_DEMO_GUIDE.md` for troubleshooting
- Review `docs/` folder for technical details
- Test with provided demo credentials

---

## 🎉 Acknowledgments

Built with ❤️ by Team NeuroLearn for making education accessible to all students, regardless of their learning challenges.

**Datasets Used:**
- Kaggle Online Education Adaptivity
- Educational Performance Data
- Autism Screening Data
- Custom interaction logs

**Technologies:**
- React.js, Node.js, MongoDB, Python, Flask
- Recharts, Framer Motion, Tailwind CSS
- scikit-learn, NumPy, Pandas
- Web Speech API, jsPDF

---

## 📄 License

Academic Project - 2026

---

**Ready for Demo!** 🎓✨

See `COMPLETE_DEMO_GUIDE.md` for detailed presentation instructions.
