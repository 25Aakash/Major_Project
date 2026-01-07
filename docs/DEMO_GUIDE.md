# NeuroLearn - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

#### Backend
```powershell
cd backend
npm install
```

#### Frontend
```powershell
cd frontend
npm install
```

#### ML Module (Optional for demo)
```powershell
cd ml-module
pip install -r requirements.txt
```

### Step 2: Setup MongoDB

Option A: Install MongoDB locally
- Download from: https://www.mongodb.com/try/download/community
- Run MongoDB service

Option B: Use MongoDB Atlas (Cloud)
- Create free account at: https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string

### Step 3: Configure Environment

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neurolearn
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Step 4: Start the Application

Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```

Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

### Step 5: Access the Application

Open browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📱 Demo Flow for Faculty

### 1. Home Page
- Shows platform features
- Highlights neurodiversity support
- Modern, accessible design

### 2. Register New User
- Create student account
- Select neurodiversity profile (ADHD, Dyslexia, etc.)
- Choose learning preferences

### 3. Dashboard
- View personalized metrics
- See learning progress
- Check recommendations

### 4. Learning Center
- Browse content library
- Filter by subject/difficulty
- Start lessons
- Track completion

### 5. Settings Page
- Customize font size/family
- Change color schemes
- Enable text-to-speech
- Set focus mode

### 6. Backend API Demo
Use Postman or browser to test:

**Health Check**
```
GET http://localhost:5000/api/health
```

**Get Recommendations**
```
GET http://localhost:5000/api/learning/recommendations/{userId}
```

**Get Analytics**
```
GET http://localhost:5000/api/interactions/analytics/{userId}
```

---

## 🎯 Key Features to Highlight

### For Students
✅ Personalized learning paths  
✅ Accessible interface  
✅ Progress tracking  
✅ Adaptive difficulty  

### For Educators
✅ Learning analytics  
✅ Content management  
✅ Student progress monitoring  

### Technical Innovation
✅ AI/ML powered recommendations  
✅ Real-time adaptation  
✅ Comprehensive data collection  
✅ Scalable architecture  

---

## 🧪 Testing the ML Module

Run the test scripts:

```powershell
cd ml-module
python src/preprocessor.py
python src/recommender.py
```

This will show:
- Feature extraction
- Content recommendation logic
- Adaptive algorithms in action

---

## 📊 Sample Data

To populate database with sample content, you can use Postman to POST to:

```
POST http://localhost:5000/api/content
```

Sample content body:
```json
{
  "title": "Introduction to Fractions",
  "description": "Learn the basics of fractions with visual aids",
  "subject": "math",
  "difficulty": "beginner",
  "contentType": "lesson",
  "format": ["visual", "interactive"],
  "duration": 15,
  "points": 10,
  "tags": ["math", "fractions", "beginner"]
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify network connectivity

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

---

## 📞 Support

For issues or questions during demo:
- Check console logs (F12 in browser)
- Review backend terminal output
- Refer to README files in each directory

---

## 🎓 What Faculty Should See

By the end of the demo, faculty will understand:

1. **Problem Being Solved**
   - Educational challenges for neurodiverse students
   - Need for adaptive, personalized learning

2. **Technical Solution**
   - Full-stack MERN application
   - Machine learning integration
   - Accessibility-first design

3. **Team Execution**
   - Clear role distribution
   - Consistent progress
   - Professional code quality

4. **Future Potential**
   - Scalable architecture
   - Research opportunities
   - Real-world impact

---

## ✅ Pre-Demo Checklist

- [ ] MongoDB running
- [ ] Backend server started (port 5000)
- [ ] Frontend server started (port 3000)
- [ ] Sample user registered
- [ ] Some content added to database
- [ ] Browser open to localhost:3000
- [ ] Postman ready for API demo
- [ ] ML test scripts tested
- [ ] Progress document ready (docs/PROGRESS.md)

**Status**: Ready to demonstrate! 🚀
