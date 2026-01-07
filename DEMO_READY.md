# 🧠 NeuroLearn Setup & Demo Guide

## Quick Start (5 Minutes)

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
- **Python 3.11+** (optional for ML demo)

### Installation

#### Option 1: Automated Setup (Recommended)
```powershell
# Run the setup script
.\setup.ps1
```

#### Option 2: Manual Setup

**1. Install Backend Dependencies**
```powershell
cd backend
npm install
```

**2. Install Frontend Dependencies**
```powershell
cd frontend
npm install
```

**3. Install ML Module (Optional)**
```powershell
cd ml-module
pip install -r requirements.txt
```

### Database Setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `backend/.env` with your connection string

### Environment Configuration

The `.env` file is already created in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neurolearn
JWT_SECRET=neurolearn_jwt_secret_key_change_in_production
NODE_ENV=development
```

**If using MongoDB Atlas**, update `MONGODB_URI` with your connection string.

### Populate Sample Data

```powershell
cd backend
node seedData.js
```

This will add 10 sample lessons to your database.

### Start the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Access the Application

Open your browser and navigate to:
- **Application**: http://localhost:3000
- **API Health Check**: http://localhost:5000/api/health

---

## 🎬 Demo Flow for Faculty

### 1. Landing Page (Homepage)
**URL**: http://localhost:3000

**Show:**
- Professional hero section with project branding
- Key features overview
- Support for different neurodiversity types
- Call-to-action buttons

**Points to mention:**
- Designed with accessibility in mind
- Clear value proposition
- Welcoming and inclusive design

---

### 2. User Registration
**URL**: http://localhost:3000/register

**Demo Steps:**
1. Click "Get Started" or "Register"
2. Fill in details:
   - Name: "Alex Demo"
   - Email: "alex@demo.com"
   - Password: "demo123"
3. Select neurodiversity profile: ADHD, Dyslexia
4. Submit

**Points to mention:**
- Simple registration process
- Captures neurodiversity information for personalization
- Secure password handling (bcrypt hashing)
- Validates email format

---

### 3. Dashboard
**URL**: http://localhost:3000/dashboard

**Show:**
- Personalized welcome message
- Stats cards (level, points, completed lessons, streak)
- Learning profile display
- Recommended content based on profile

**Points to mention:**
- Personalized experience from day one
- Progress tracking visualization
- Gamification elements (points, levels)
- AI-driven recommendations (explain the algorithm)

---

### 4. Learning Center
**URL**: http://localhost:3000/learning

**Demo Steps:**
1. Show adaptive learning path section
2. Filter content by:
   - Subject (Math, Science, English, Programming)
   - Difficulty (Beginner, Intermediate, Advanced)
3. Click "Start" on a lesson
4. Click "Complete" to mark as done

**Show in browser console:**
- Interaction logging happening in background
- API calls to track user behavior

**Points to mention:**
- Content adapts to performance
- Multiple subjects available
- Different difficulty levels
- Real-time interaction logging for ML
- Multiple content formats supported

---

### 5. Accessibility Settings
**URL**: http://localhost:3000/settings

**Demo Steps:**
1. Change font size (Small → Large)
2. Switch font family to OpenDyslexic
3. Toggle color scheme (Light → Dark)
4. Enable Focus Mode
5. Enable Text-to-Speech
6. Change learning style preference
7. Click "Save Settings"

**Points to mention:**
- WCAG 2.1 AA compliant
- OpenDyslexic font for dyslexic users
- Customizable text size for visual needs
- Focus mode removes distractions (ADHD support)
- Multiple learning style options
- Settings persist across sessions

---

### 6. Backend API Demo

**Use Postman or browser to demonstrate:**

**Health Check**
```
GET http://localhost:5000/api/health
```
Response shows server is active

**Get Content**
```
GET http://localhost:5000/api/content
```
Shows all available lessons

**Get Recommendations** (Replace {userId} with actual ID)
```
GET http://localhost:5000/api/learning/recommendations/{userId}
```
Shows personalized content recommendations

**Get User Analytics** (Replace {userId} with actual ID)
```
GET http://localhost:5000/api/interactions/analytics/{userId}
```
Shows learning analytics and patterns

**Get Adaptive Learning Path** (Replace {userId} with actual ID)
```
GET http://localhost:5000/api/learning/adaptive-path/{userId}
```
Shows recommended next steps based on performance

**Points to mention:**
- RESTful API architecture
- JSON responses
- Real-time data
- Scalable design

---

### 7. ML Module Demo

**Open new terminal:**

```powershell
cd ml-module
python src/preprocessor.py
```

**Shows:**
- Feature extraction from user interactions
- 12 behavioral features identified
- Data normalization for ML

```powershell
python src/recommender.py
```

**Shows:**
- Difficulty recommendation algorithm
- Content format recommendation
- Engagement score calculation
- Learning path generation
- Adaptive break scheduling

**Points to mention:**
- Real ML algorithms, not mock-ups
- 12 features extracted from user behavior
- Adaptive difficulty based on performance
- Personalized content format recommendations
- Break frequency optimized for neurodiversity

---

## 🎯 Key Talking Points

### Problem Being Solved
- 15-20% of students are neurodiverse (ADHD, Autism, Dyslexia, etc.)
- Traditional one-size-fits-all education doesn't work
- Need for personalized, accessible learning platforms

### Technical Innovation
- **Full-stack MERN application** (MongoDB, Express, React, Node.js)
- **Machine Learning integration** for personalization
- **12 behavioral features** tracked for adaptation
- **RESTful API architecture** for scalability
- **WCAG 2.1 AA compliant** for accessibility

### What Makes It Unique
1. **Neurodiversity-first design** - Built specifically for neurodiverse learners
2. **AI-powered adaptation** - Real-time adjustment to learning patterns
3. **Comprehensive accessibility** - Multiple sensory formats, customizable UI
4. **Evidence-based** - Follows UDL principles and cognitive science research

### Team Contributions
- **Aakash**: ML/AI algorithms, data preprocessing, recommendation engine
- **Naman**: Backend API, database design, user interaction logging
- **Yash**: Frontend UI, accessibility features, responsive design

---

## 📊 Metrics to Highlight

### Current Implementation
- ✅ 15+ API endpoints
- ✅ 6 complete pages
- ✅ 3 database models
- ✅ 12 ML features
- ✅ 7+ accessibility options
- ✅ 10 sample lessons
- ✅ Full authentication system

### Code Statistics
- **Backend**: ~800 lines of production code
- **Frontend**: ~1000 lines of production code
- **ML Module**: ~500 lines of production code
- **Documentation**: ~2000 lines

---

## 🔧 Troubleshooting

### Port Already in Use

**For port 5000 (Backend):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**For port 3000 (Frontend):**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `backend/.env`
- For Atlas: verify IP whitelist settings
- Test connection: `mongosh mongodb://localhost:27017/neurolearn`

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Frontend Not Loading
- Check if backend is running (http://localhost:5000/api/health)
- Clear browser cache
- Check browser console for errors
- Verify `.env` configuration

---

## 📚 Additional Resources

### Documentation
- **PROGRESS.md** - Detailed week-by-week progress
- **DEMO_GUIDE.md** - Step-by-step demo instructions
- **PRESENTATION_NOTES.md** - Faculty presentation talking points
- **STRUCTURE.md** - Project architecture overview

### Learn More
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎓 Questions Faculty Might Ask

**Q: How does the ML model adapt over time?**
> Currently uses rule-based algorithms with 12 behavioral features. Next phase involves training predictive models on accumulated interaction data for even better personalization.

**Q: What about data privacy and security?**
> - All passwords hashed with bcrypt
> - JWT for secure authentication
> - HTTPS ready for production
> - Planning GDPR compliance
> - No personal data shared with third parties

**Q: How is effectiveness measured?**
> Track multiple metrics: completion rates, engagement scores, focus levels, performance improvements, time-to-completion, and user satisfaction surveys.

**Q: What's the deployment strategy?**
> Cloud deployment ready (AWS/Azure/GCP), Docker containerization planned, CI/CD pipeline setup, MongoDB Atlas for database, scalable architecture with load balancing.

**Q: Have you tested with real users?**
> Currently in prototype stage. Planning pilot program with special education departments. User testing framework prepared.

---

## 🚀 Next Steps After Demo

### Immediate (Week 5-6)
- Expand content library (50+ lessons)
- Implement quiz and assessment system
- Add detailed lesson view pages
- Enhanced analytics dashboard

### Short-term (2-3 months)
- Mobile responsive optimization
- Parent/Teacher dashboard
- Real-time collaboration features
- Advanced gamification

### Long-term (6-12 months)
- Mobile app (iOS/Android)
- Voice interaction support
- Emotion detection via webcam
- Integration with school LMS systems
- Research publication

---

## ✅ Pre-Demo Checklist

Before presenting:

- [ ] MongoDB is running
- [ ] Sample data loaded (`node backend/seedData.js`)
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Test user account created
- [ ] Browser open to localhost:3000
- [ ] Postman open with API requests ready
- [ ] ML test scripts verified
- [ ] Documentation printed/accessible
- [ ] Backup plan if internet fails

---

## 📞 Support & Contact

**Team NeuroLearn**
- Aakash Khandelwal - ML/AI Lead
- Naman Singhal - Backend Lead  
- Yash Goyal - Frontend Lead

**Project Repository**: [GitHub link if available]
**Documentation**: `/docs` folder
**Demo Video**: [Link if available]

---

## 🎊 Success Criteria

Your demo is successful if faculty understand:

1. ✅ The problem being solved (neurodiverse education needs)
2. ✅ The technical solution (MERN + ML platform)
3. ✅ The innovation (AI-powered personalization)
4. ✅ The execution (working prototype with clear progress)
5. ✅ The potential (scalability and real-world impact)

---

**Status**: ✅ Demo Ready  
**Last Updated**: Week 4 Completion  
**Ready to Present**: Yes

Good luck with your demo! 🎉
