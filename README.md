# OrthoVita - AI-Powered Rehabilitation Assistant

An AI-based rehabilitation assistant using computer vision and motion tracking to guide patients through exercises, monitor posture accuracy, and provide real-time corrective feedback.

## 🚀 Features

- **Real-time Pose Detection**: Uses MediaPipe for accurate body tracking
- **4 Rehabilitation Exercises**: Squat, Bicep Curl, Knee Raise, Shoulder Press
- **Live Feedback**: Real-time form corrections and guidance
- **Rep Counter**: Automatic counting with accuracy tracking
- **Voice Feedback**: Audio cues for rep completion
- **Session Analytics**: Progress charts and performance summary
- **Zero Backend**: Runs entirely in the browser

## 🛠️ Tech Stack

- **React + Vite**: Fast development and build
- **MediaPipe**: Browser-based pose detection
- **Tailwind CSS**: Modern styling
- **Zustand**: Lightweight state management
- **Recharts**: Session progress visualization
- **Web Speech API**: Voice feedback

## 📦 Installation

```bash
cd frontend
npm install
npm run dev
```

## 🎯 How to Use

1. **Allow Camera Access**: Grant webcam permissions when prompted
2. **Position Yourself**: Stand 6-8 feet from camera, ensure full body is visible
3. **Select Exercise**: Choose from Squat, Bicep Curl, Knee Raise, or Shoulder Press
4. **Start Session**: Click "Start Exercise" button
5. **Follow Feedback**: Watch the live feedback panel for form corrections
6. **Complete Reps**: The system automatically counts and tracks accuracy
7. **Review Summary**: Check your session stats and progress chart

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
src/
├── components/
│   ├── WebcamFeed.jsx          # Camera + skeleton overlay
│   ├── ExerciseSelector.jsx    # Exercise selection UI
│   ├── StatsPanel.jsx          # Live stats display
│   ├── ControlButtons.jsx      # Start/Stop controls
│   └── SessionSummary.jsx      # Post-session analytics
├── hooks/
│   └── usePoseDetection.js     # MediaPipe integration
├── store/
│   └── useStore.js             # Global state management
├── utils/
│   ├── poseUtils.js            # Angle calculation & drawing
│   └── exerciseDetectors.js   # Exercise detection logic
└── App.jsx                     # Main application
```

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

## 📈 Future Enhancements

- [ ] Support for more exercises (lunges, planks, etc.)
- [ ] Custom exercise builder
- [ ] Progress tracking across sessions
- [ ] Session data export
- [ ] Multi-user support
- [ ] Mobile application version  

---

## 📄 License

**MIT License** — Built to promote healthcare accessibility  

---

### Built by **Manthan Sharma** for better rehabilitation outcomes
