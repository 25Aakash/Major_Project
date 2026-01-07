# NeuroLearn Project Structure

```
major_project/
│
├── backend/                      # Node.js + Express Backend
│   ├── models/                   # Database schemas
│   │   ├── User.js              # User model with neurodiversity profile
│   │   ├── Interaction.js       # Interaction logging for ML
│   │   └── Content.js           # Learning content model
│   │
│   ├── routes/                   # API endpoints
│   │   ├── userRoutes.js        # Auth & profile management
│   │   ├── learningRoutes.js    # Adaptive learning APIs
│   │   ├── interactionRoutes.js # Interaction logging
│   │   └── contentRoutes.js     # Content management
│   │
│   ├── server.js                 # Main server file
│   ├── package.json              # Dependencies
│   └── .env.example              # Environment variables template
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── Header.jsx       # Navigation header
│   │   │
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Learning.jsx     # Learning center
│   │   │   └── Settings.jsx     # Accessibility settings
│   │   │
│   │   ├── context/              # React Context
│   │   │   ├── UserContext.jsx  # User state management
│   │   │   └── AccessibilityContext.jsx # Accessibility settings
│   │   │
│   │   ├── services/             # API services
│   │   │   └── api.js           # Axios API client
│   │   │
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   │
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── package.json              # Dependencies
│
├── ml-module/                    # Python ML Module
│   ├── src/
│   │   ├── preprocessor.py      # Data preprocessing (Week 3-4)
│   │   └── recommender.py       # Content recommendation (Week 4)
│   │
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # ML module documentation
│
├── docs/                         # Documentation
│   ├── PROGRESS.md              # Week-by-week progress tracker
│   ├── DEMO_GUIDE.md            # Faculty demo instructions
│   └── STRUCTURE.md             # This file
│
└── README.md                     # Project overview

```

## File Counts
- **Backend**: 11 files
- **Frontend**: 15 files
- **ML Module**: 4 files
- **Documentation**: 4 files
- **Total**: 34 core project files

## Key Technologies by Directory

### Backend (`/backend`)
- Express.js - Web framework
- MongoDB + Mongoose - Database
- JWT - Authentication
- bcryptjs - Password hashing
- Helmet - Security

### Frontend (`/frontend`)
- React 18 - UI library
- React Router - Navigation
- Tailwind CSS - Styling
- Axios - HTTP client
- Vite - Build tool

### ML Module (`/ml-module`)
- NumPy, Pandas - Data processing
- scikit-learn - ML algorithms
- TensorFlow - Deep learning
- Matplotlib - Visualization

## Database Collections

### users
- User profiles
- Neurodiversity settings
- Learning preferences
- Accessibility settings
- Progress tracking

### contents
- Learning materials
- Multi-format content
- Difficulty levels
- Accessibility metadata

### interactions
- User activity logs
- Performance data
- Engagement metrics
- ML training data

## API Endpoints

### User Management
- POST `/api/users/register` - Create account
- POST `/api/users/login` - Authenticate
- GET `/api/users/profile/:id` - Get profile
- PUT `/api/users/settings/:id` - Update settings

### Learning
- GET `/api/learning/recommendations/:userId` - Get recommendations
- GET `/api/learning/adaptive-path/:userId` - Get learning path
- POST `/api/learning/complete/:userId/:contentId` - Mark complete

### Content
- GET `/api/content` - Get all content
- GET `/api/content/:id` - Get specific content
- POST `/api/content` - Create content
- GET `/api/content/subjects/list` - List subjects

### Interactions
- POST `/api/interactions/log` - Log interaction
- GET `/api/interactions/user/:userId` - Get user interactions
- GET `/api/interactions/analytics/:userId` - Get analytics

## Feature Implementation Status

### ✅ Completed (Week 1-4)
- User authentication & authorization
- Database schema & models
- RESTful API architecture
- React component structure
- Accessibility settings
- Interaction logging
- Feature extraction
- Basic recommendations
- Responsive UI

### 🟡 In Progress (Next Phase)
- ML model training
- Real-time adaptation
- Content creation
- Advanced analytics
- Testing & optimization

### ⚪ Planned (Future)
- Mobile app
- Parent/teacher portal
- Gamification
- Social features
- Advanced AI features

## Code Quality Standards

### Backend
- Async/await error handling
- Input validation
- JWT authentication middleware
- MongoDB indexing
- API documentation

### Frontend
- Component-based architecture
- Context API for state
- Custom hooks
- Accessibility best practices
- Responsive design

### ML Module
- Type hints
- Docstrings
- Unit tests
- Data validation
- Performance optimization

## Development Workflow

1. **Backend First** - Naman creates APIs
2. **Frontend Integration** - Yash builds UI connecting to APIs
3. **ML Development** - Aakash creates algorithms
4. **Integration** - Team integrates ML with backend
5. **Testing** - All test their components
6. **Deployment** - Combined effort

## Git Structure (Recommended)

```
main
├── dev
│   ├── feature/backend-api
│   ├── feature/frontend-ui
│   └── feature/ml-models
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neurolearn
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Dependencies Summary

### Backend
- Production: 8 packages
- Development: 2 packages

### Frontend
- Production: 7 packages
- Development: 4 packages

### ML Module
- Production: 10 packages

## Build & Deploy

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

---

**Created**: Week 4  
**Last Updated**: [Current Date]  
**Maintained By**: Team NeuroLearn
