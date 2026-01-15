# 🧪 AI-Adaptive Features Testing Guide

This guide will help you verify that all AI-adaptive features are working correctly.

---

## 📋 **Pre-Testing Checklist**

✅ All 4 services running:
- MongoDB (port 27017)
- Backend (http://localhost:5000)
- ML API (http://localhost:5001)
- Frontend (http://localhost:5173)

✅ Check ML API health:
```
Open browser: http://localhost:5001/health
Should see: {"status": "healthy", ...}
```

✅ Check Backend health:
```
Open browser: http://localhost:5000/api/health
Should see: {"status": "active", ...}
```

---

## 🎯 **Feature 1: Real-Time Behavioral Tracking**

### What to Test:
Video player tracking of user behavior

### Steps:
1. **Login** to your account
2. **Go to Learning page**
3. **Click on any video** to open VideoPlayer
4. **Perform these actions:**
   - ⏸️ Pause the video (multiple times)
   - ⏪ Rewind using timeline
   - ⏩ Fast forward
   - 🔊 Change volume
   - ⚙️ Change playback speed (if available)

### Expected Results:
✅ **While watching:**
- Bottom of video shows: "X pauses • Y rewinds"
- Counter updates in real-time

✅ **After closing video:**
- Open Browser DevTools (F12) → Console
- Should see tracking data logged
- Check Network tab for POST to `/api/interactions`

✅ **In Database (MongoDB Compass):**
```javascript
// Check interaction document has:
{
  mediaMetrics: {
    pausePoints: [...],
    rewindCount: 3,
    seekCount: 5,
    averagePlaybackSpeed: 1.0
  },
  attentionMetrics: {
    attentionSpan: 5.2,
    comprehensionSignals: {...}
  }
}
```

### Success Indicator:
🟢 If you see the pause/rewind counts updating → **WORKING!**

---

## 🚨 **Feature 2: Struggle Detection & Interventions**

### What to Test:
AI detects when you're struggling and offers help

### Steps:
1. **Watch a video** on Learning page
2. **Simulate struggle:**
   - ⏸️ Pause video **6+ times**
   - ⏪ Rewind **4+ times**
   - 🔄 Seek back and forth rapidly

### Expected Results:
✅ **Automatic intervention toast appears:**
```
💡 Having trouble? Try switching to a different format!
```

✅ **In Browser Console:**
```
Video tracking error: (or success message)
```

✅ **Check ML API endpoint:**
```javascript
// Open DevTools → Network → Filter: detect-struggle
POST http://localhost:5001/api/ml/detect-struggle
Response: {
  isStruggling: true,
  struggleLevel: "high",
  suggestedInterventions: [...]
}
```

### Success Indicator:
🟢 Toast notification appears after excessive pauses/rewinds → **WORKING!**

---

## 🎨 **Feature 5: Adaptive UI Settings**

### What to Test:
UI automatically adjusts based on behavior patterns

### Steps:
1. **Login and stay active for 30+ minutes**
2. **Simulate behaviors:**
   - Zoom in/out browser (Ctrl + Plus/Minus) **5+ times**
   - Keep session active for 35+ minutes

### Expected Results:
✅ **After 2 minutes (auto-check interval):**
- Browser Console shows: `✨ Auto-adapted UI settings: {...}`

✅ **Settings auto-adjust:**
- Font size increases (if zoomed frequently)
- Dark mode activates (for long sessions)
- Animations reduce (if detected ADHD patterns)

✅ **Check accessibility settings:**
- Go to Settings page
- Should see updated preferences

### Manual Test:
```javascript
// In Browser Console, trigger immediately:
localStorage.setItem('userId', 'YOUR_USER_ID');
// Wait 2 minutes or refresh
```

### Success Indicator:
🟢 UI settings change automatically → **WORKING!**

---

## 📊 **Feature 6: Performance Prediction**

### What to Test:
AI predicts your next performance score

### Steps:
1. **Complete 3+ lessons** with scores
2. **Go to Dashboard**
3. **Scroll to "AI Performance Prediction" section**

### Expected Results:
✅ **Dashboard displays:**
```
┌─────────────────────────────────────┐
│ AI Performance Prediction           │
├─────────────────────────────────────┤
│ Predicted Next Score:    87.5%      │
│ Performance Trend:       Improving   │
│ Improvement Rate:        +12.3%     │
└─────────────────────────────────────┘

AI Recommendations:
⚡ Great progress! You've improved by 12.3%
⚡ Ready for advanced challenges
```

✅ **Check ML API call:**
```javascript
// DevTools → Network → Filter: predict-performance
POST http://localhost:5001/api/ml/predict-performance
Response: {
  predictedScore: 87.5,
  trend: "improving",
  recommendations: [...]
}
```

### Success Indicator:
🟢 Prediction card visible on Dashboard with score → **WORKING!**

---

## 🧠 **Feature 7: Neurodiversity Pattern Detection**

### What to Test:
AI detects ADHD, dyslexia, autism patterns from behavior

### Steps:
1. **Simulate ADHD pattern:**
   - Switch browser tabs frequently (10+ times)
   - Short attention bursts (pause videos after 30 sec)
   - Low completion rates (start but don't finish)

2. **Complete 10+ interactions**

3. **Check detection:**
   - Go to Dashboard
   - Look for personalized tips mentioning detected patterns

### Expected Results:
✅ **Dashboard shows:**
```
Your Personalized Learning Tips:
✨ Interactive content works best for you
   (ADHD pattern detected)
```

✅ **Check User model in MongoDB:**
```javascript
{
  detectedPatterns: {
    showsAdhdPatterns: true,
    confidenceScore: 0.7
  }
}
```

✅ **ML API endpoint:**
```javascript
POST http://localhost:5001/api/ml/detect-neurodiversity
Response: {
  detectedPatterns: ["adhd"],
  patternScores: {adhd: 0.7},
  adaptiveRecommendations: [...]
}
```

### Success Indicator:
🟢 Personalized tips appear based on detected patterns → **WORKING!**

---

## 📚 **Feature 11: Skill Mastery Tracking**

### What to Test:
Individual skill levels tracked and updated

### Steps:
1. **Complete lessons** tagged with skills
2. **Check User document** in MongoDB
3. **Look for skillMastery map**

### Expected Results:
✅ **In MongoDB User document:**
```javascript
{
  skillMastery: {
    "algebra_basics": {
      masteryLevel: 0.75,
      practiceCount: 5,
      averageScore: 85
    },
    "fractions": {
      masteryLevel: 0.62,
      practiceCount: 3,
      averageScore: 78
    }
  }
}
```

✅ **After completing content:**
```javascript
POST http://localhost:5001/api/ml/update-skill-mastery
Response: {
  updatedMastery: {...},
  recommendations: [
    {skill: "fractions", priority: "high", ...}
  ]
}
```

### Success Indicator:
🟢 Skills show mastery levels that update with practice → **WORKING!**

---

## 🎮 **Feature 12: Gamification Adaptation**

### What to Test:
System learns which rewards motivate you

### Steps:
1. **Interact with gamification elements:**
   - Click on badges/achievements (if visible)
   - Check points multiple times
   - Ignore leaderboard (don't click)

2. **Complete 5+ lessons**

3. **Check User preferences**

### Expected Results:
✅ **In MongoDB User document:**
```javascript
{
  gamificationPreferences: {
    respondsToAchievements: true,  // You clicked badges
    respondsToPoints: true,         // You checked points
    respondsToLeaderboards: false,  // You ignored them
    engagementScore: 0.6
  }
}
```

✅ **Dashboard adapts:**
- Shows badges prominently (if you like them)
- Hides leaderboard (if you ignore it)

### Success Indicator:
🟢 Gamification elements adjust based on your interaction → **WORKING!**

---

## 🎯 **Learning Rhythm Insights (Feature 5)**

### What to Test:
System learns your optimal study patterns

### Steps:
1. **Study at consistent times** (e.g., always at 7 PM)
2. **Complete 5+ sessions**
3. **Go to Dashboard**

### Expected Results:
✅ **Dashboard shows "Your Learning Rhythm":**
```
┌──────────────────────────────────────┐
│ Optimal Session:     30 min          │
│ Best Time:           Evening         │
│ Attention Span:      22 min          │
│ Break Interval:      25 min          │
└──────────────────────────────────────┘
```

✅ **Personalized tip appears:**
```
⏰ You learn best in the evening
   Schedule your toughest lessons then
```

### Success Indicator:
🟢 Learning rhythm card shows on Dashboard → **WORKING!**

---

## 🔍 **Quick Verification Checklist**

Test all features in 10 minutes:

```
□ 1. Watch video → See pause/rewind counters update ✅
□ 2. Pause 6+ times → See intervention toast ✅
□ 3. Stay active 30+ min → UI settings auto-adjust ✅
□ 4. Go to Dashboard → See performance prediction ✅
□ 5. Go to Dashboard → See personalized tips ✅
□ 6. Go to Dashboard → See learning rhythm ✅
□ 7. Check MongoDB → See skillMastery data ✅
□ 8. Check MongoDB → See gamification preferences ✅
```

---

## 🐛 **Debugging Tips**

### If Features Don't Work:

**1. Check Browser Console (F12):**
```javascript
// Look for errors
// Check Network tab for failed API calls
```

**2. Check ML API is responding:**
```bash
# In PowerShell
curl http://localhost:5001/health
# Should return: {"status": "healthy"}
```

**3. Check Backend is responding:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status": "active"}
```

**4. Check MongoDB connection:**
```javascript
// In MongoDB Compass, connect to:
mongodb://localhost:27017/neurolearn
```

**5. Check Python modules installed:**
```bash
cd ml-module
pip list | findstr "flask numpy pandas scikit"
```

---

## 📸 **Visual Proof of Features Working**

### Screenshot Checklist:

1. **VideoPlayer** - showing "5 pauses • 3 rewinds"
2. **Toast notification** - "💡 Having trouble?"
3. **Dashboard** - AI Performance Prediction card
4. **Dashboard** - Your Learning Rhythm card
5. **Dashboard** - Personalized Learning Tips
6. **Browser Console** - "✨ Auto-adapted UI settings"
7. **MongoDB** - User document with skillMastery
8. **Network Tab** - ML API calls successful (200 status)

---

## ✅ **Success Criteria**

Your implementation is **FULLY WORKING** if:

1. ✅ Video tracks pauses/rewinds in real-time
2. ✅ Intervention toast appears when struggling
3. ✅ Dashboard shows AI prediction with score
4. ✅ Dashboard shows learning rhythm insights
5. ✅ Dashboard shows personalized tips
6. ✅ ML API endpoints respond (check Network tab)
7. ✅ MongoDB stores tracking data
8. ✅ UI settings adapt automatically

**If 6+ out of 8 work → GREAT SUCCESS! 🎉**

---

## 🎓 **Demo Script for Presentation**

### 5-Minute Demo:

**Minute 1-2: Behavioral Tracking**
"Watch how the system tracks everything I do..."
- Open video → Pause 3 times → Rewind 2 times
- Point out counters updating

**Minute 3: Struggle Detection**
"Now I'll simulate struggling with content..."
- Pause rapidly 6+ times
- Show intervention toast appearing

**Minute 4-5: AI Predictions**
"The AI has learned my patterns..."
- Go to Dashboard
- Show performance prediction
- Show learning rhythm
- Show personalized tips

**Conclusion:**
"All this happens automatically, adapting to each student's unique needs!"

---

## 📞 **Need Help?**

Check these logs:
- Backend: Check terminal output
- ML API: Check terminal output  
- Frontend: Browser console (F12)
- Database: MongoDB Compass

Good luck testing! 🚀
