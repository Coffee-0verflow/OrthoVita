# OrthoVita - AI-Powered Rehabilitation Assistant

An AI-based rehabilitation assistant using computer vision and motion tracking to guide patients through exercises, monitor posture accuracy, and provide real-time corrective feedback.

## 🚀 Features

- **Real-time Pose Detection**: Uses MediaPipe for accurate body tracking
- **9 Rehabilitation Exercises**: Squat, Bicep Curl, Knee Raise, Shoulder Press, and more
- **Live Feedback**: Real-time form corrections and guidance
- **Rep Counter**: Automatic counting with accuracy tracking
- **Voice Feedback**: Audio cues for rep completion
- **Session Analytics**: Progress charts and performance summary
- **User Authentication**: Secure MongoDB-based user accounts
- **Exercise History**: Track your rehabilitation progress over time
- **AI Chatbot**: Gemini-powered assistant for exercise guidance
- **Injury Assessment**: Personalized exercise recommendations

## 🛠️ Tech Stack

### Frontend
- **React + Vite**: Fast development and build
- **MediaPipe**: Browser-based pose detection
- **Tailwind CSS**: Modern styling
- **Zustand**: Lightweight state management
- **Recharts**: Session progress visualization
- **Web Speech API**: Voice feedback
- **Google Gemini AI**: Intelligent chatbot assistant

### Backend
- **Express.js**: RESTful API server
- **MongoDB**: User data and session storage
- **JWT**: Secure authentication
- **bcrypt**: Password hashing

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

### Environment Variables

**Frontend (.env in frontend/):**
```env
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_API_URL=http://localhost:3001
```

**Backend (uses frontend/.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/OrthoVita
JWT_SECRET=your-secret-key
```

## 🎯 How to Use

1. **Sign Up**: Create an account with name, email, and password
2. **Sign In**: Login to access your personalized dashboard
3. **Injury Assessment**: Complete optional injury assessment for personalized recommendations
4. **Allow Camera Access**: Grant webcam permissions when prompted
5. **Position Yourself**: Stand 6-8 feet from camera, ensure full body is visible
6. **Select Exercise**: Choose from recommended or all available exercises
7. **Start Session**: Click "Start Exercise" button
8. **Follow Feedback**: Watch the live feedback panel for form corrections
9. **Complete Reps**: The system automatically counts and tracks accuracy
10. **Review Summary**: Check your session stats and progress chart
11. **View History**: Access your complete exercise history anytime

## 📋 Exercise Guidelines

### Squat
- Stand with feet shoulder-width apart
- Face the camera directly
- Squat until knees reach ~90° angle

### Bicep Curl
- Show side profile to camera
- Keep elbow stable at your side
- Curl from extended (~160°) to contracted (~60°)

### Knee Raise
- Face the camera
- Stand straight
- Raise knee to hip level

### Shoulder Press
- Show side profile to camera
- Start with hands at shoulder level
- Press arms fully overhead

## 🎨 Project Structure

```
OrthoVita/
├── backend/
│   ├── server.js              # Express API server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WebcamFeed.jsx          # Camera + skeleton overlay
│   │   │   ├── ExerciseSelector.jsx    # Exercise selection UI
│   │   │   ├── StatsPanel.jsx          # Live stats display
│   │   │   ├── ControlButtons.jsx      # Start/Stop controls
│   │   │   ├── SessionSummary.jsx      # Post-session analytics
│   │   │   ├── ExerciseHistory.jsx     # User exercise history
│   │   │   ├── GeminiChatbot.jsx       # AI assistant
│   │   │   ├── LandingPage.jsx         # Auth landing page
│   │   │   └── InjuryAssessment.jsx    # Injury evaluation
│   │   ├── hooks/
│   │   │   └── usePoseDetection.js     # MediaPipe integration
│   │   ├── services/
│   │   │   └── auth.js                 # API calls & auth
│   │   ├── store/
│   │   │   └── useStore.js             # Zustand state
│   │   ├── utils/
│   │   │   ├── poseUtils.js            # Angle calculation
│   │   │   └── exerciseDetectors.js    # Exercise logic
│   │   └── App.jsx                     # Main application
│   └── .env                            # Environment variables
└── README.md
```

## 🔐 Authentication & Data Storage

### User Authentication
- JWT-based authentication with 7-day token expiry
- Passwords hashed with bcrypt (10 rounds)
- Session-based token storage (clears on browser close)

### Data Storage
- **MongoDB**: User accounts, exercise sessions, profiles
- **SessionStorage**: JWT token (temporary)
- **In-Memory**: Current exercise state (clears on refresh)

### API Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Verify token
- `POST /api/sessions` - Save exercise session
- `GET /api/sessions` - Get user sessions
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update profile
- `GET /api/health` - Check server status

## 🔧 Key Implementation Details

### Angle Calculation
Uses 3-point angle calculation between body landmarks:
```javascript
angle = atan2(c.y - b.y, c.x - b.x) - atan2(a.y - b.y, a.x - b.x)
```

### Exercise Detection
Each exercise has:
- **Angle thresholds**: Wide ranges for reliability (e.g., 80°-100° for squat)
- **Stage tracking**: "up" and "down" states for rep counting
- **Feedback system**: Context-aware guidance messages

### Performance Optimization
- GPU-accelerated pose detection
- Canvas-based skeleton rendering
- Efficient state updates with Zustand
- MongoDB connection caching for serverless
- Session-based authentication

## 🐛 Troubleshooting

**Pose not detected?**
- Ensure good lighting
- Move further from camera (6-8 feet)
- Make sure full body is visible

**Inaccurate rep counting?**
- Follow the exercise description for camera angle
- Complete full range of motion
- Move at moderate speed

**Camera not working?**
- Check browser permissions
- Try a different browser (Chrome recommended)
- Ensure no other app is using the camera

**Backend not connecting?**
- Ensure MongoDB URI is correct in .env
- Check if backend server is running on port 3001
- Verify JWT_SECRET is set in environment variables

## 📈 Features Implemented

- ✅ User authentication with MongoDB
- ✅ Per-user exercise history
- ✅ AI-powered chatbot with predefined answers
- ✅ Injury assessment and recommendations
- ✅ Session analytics and progress tracking
- ✅ Exercise history export to Excel
- ✅ Nutrition advice based on injury
- ✅ Profile management
- ✅ Real-time pose detection and feedback
- ✅ Voice guidance

## 🚀 Deployment

### Backend
Deploy to Railway, Render, or Heroku

### Frontend
Deploy to Vercel or Netlify

### MongoDB
Use MongoDB Atlas (cloud database)

---

## 📄 License

**MIT License** — Built to promote healthcare accessibility  

---

### Built by **Manthan Sharma** for better rehabilitation outcomes
