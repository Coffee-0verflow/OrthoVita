# OrthoVita - AI-Powered Rehabilitation System

## Complete Intelligent AI Physiotherapy Platform

### System Architecture

**Deterministic Math (Biomechanical Safety)**
- Angle calculation using vector mathematics
- Rep detection with stage tracking
- Risk threshold validation (SAFETY_RULES)
- Real-time posture correction

**AI Intelligence (Clinical Reasoning)**
- Personalized rehab planning
- Adaptive progression
- Session analysis
- Nutrition guidance
- Motivational coaching

**Voice Coach (Intelligent Speech)**
- 8-second cooldown between messages
- Priority speech for critical alerts
- Rep milestone announcements (every 5 reps)
- Session completion summaries
- Toggle ON/OFF control

---

## User Flow

### 1. **Login** → AI Greeting (Voice)
- Personalized welcome message
- Current rehab day display
- Last session summary

### 2. **Injury Confirmation**
- User describes injury
- AI returns suspected injury + confirmation questions
- Yes/No answers stored in Firestore

### 3. **AI Rehab Plan Generation**
- Analyzes: injury, fitness level, goal, age
- Returns structured plan:
  - Exercise selection
  - Day 1 plan (sets, reps, intensity)
  - Progression strategy
  - Recovery timeline
  - Safety instructions

### 4. **Pre-Exercise AI Briefing** (Voice)
- Safety checklist (shoes, clothes, mat, space)
- Motivational message
- Demo image preview
- Voice narration

### 5. **Live Exercise Session**
- MediaPipe Pose tracking (33 landmarks)
- Real-time angle calculation
- Safety validation:
  - **RED** (⚠️): Risk zone - voice alert
  - **GREEN** (✓): Perfect form - encouragement
  - **ORANGE** (△): Adjust posture - correction
- Rep counter with milestone voice feedback
- Visual skeleton overlay with joint labels

### 6. **Session Metrics Collection**
- Total reps
- Average angle
- Bad posture percentage
- Duration
- Saved to sessionHistory

### 7. **AI Session Analysis** (Voice)
- Performance rating
- Improvement trend
- Plateau detection
- Next session adjustment
- Motivation message
- Voice summary

### 8. **Adaptive Progression**
- AI analyzes session history
- Difficulty feedback (1-5 scale)
- Decides: increase intensity, reduce reps, add hold time, or maintain
- Updates plan automatically

### 9. **Nutrition Engine** (Voice)
- Foods to eat
- Foods to avoid
- Hydration advice
- Voice tip
- Medical disclaimer

---

## Exercise Safety Rules (Deterministic)

```javascript
Squat: ideal 80-100°, risk <60°
Wall Sit: ideal 80-100°, risk <60°
Bird Dog: ideal 160-180°, risk <140°
Arm Raise: ideal 70-110°, risk <40°
Lunge: ideal 80-110°, risk <60°
```

---

## Voice Coach Rules

**Triggers:**
1. Greeting (on login)
2. Pre-exercise briefing
3. Risk alerts (angle < risk threshold)
4. Rep milestones (every 5 reps)
5. Session completion

**Constraints:**
- Minimum 8-second cooldown
- No interruption of ongoing speech
- Short sentences only
- Toggle control available

---

## Technology Stack

- **Frontend**: React + Vite
- **AI**: Google Gemini API
- **Pose Detection**: MediaPipe Pose
- **State**: Zustand (with persistence)
- **Voice**: Web Speech Synthesis API
- **Styling**: Tailwind CSS

---

## Key Features

✅ AI greeting with voice
✅ Injury confirmation flow
✅ Personalized rehab plans
✅ Pre-exercise voice briefing
✅ Real-time pose detection (MediaPipe)
✅ Deterministic safety validation
✅ Voice coach with cooldown
✅ Rep counting & tracking
✅ Session metrics collection
✅ AI performance analysis
✅ Adaptive progression
✅ Nutrition guidance
✅ Session history persistence
✅ Professional medical UI

---

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add Gemini API key to `.env`:
```
VITE_GEMINI_API_KEY=your_key_here
```

3. Run dev server:
```bash
npm run dev
```

---

## File Structure

```
src/
├── components/
│   ├── AIGreeting.jsx          # Voice greeting
│   ├── InjuryConfirmation.jsx  # Injury flow
│   ├── PreExerciseBriefing.jsx # Voice briefing
│   ├── WebcamFeed.jsx          # Pose detection + voice
│   ├── SessionAnalysis.jsx     # AI analysis + voice
│   ├── NutritionAdvice.jsx     # Nutrition + voice
│   └── ...
├── hooks/
│   ├── useVoiceCoach.js        # Voice synthesis hook
│   └── usePoseDetection.js     # MediaPipe integration
├── services/
│   └── aiService.js            # All Gemini API calls
├── utils/
│   ├── safetyRules.js          # Deterministic validation
│   ├── exerciseDetectors.js   # Angle calculation
│   └── poseUtils.js            # Skeleton drawing
└── store/
    └── useStore.js             # Zustand state + persistence
```

---

## Demo Flow (Under 3 Minutes)

1. **Login** → AI greeting speaks
2. **Describe injury** → AI confirms
3. **Select exercise** → Pre-briefing speaks
4. **Start session** → Live corrections with voice
5. **Complete 10 reps** → Voice milestone at rep 5
6. **Stop session** → AI analysis speaks summary
7. **View nutrition** → Voice tip plays
8. **Dashboard** → Session history displayed

---

## Safety & Compliance

- Medical disclaimer on nutrition advice
- Biomechanical safety enforced by deterministic math
- AI provides guidance, not medical diagnosis
- User data persists locally (Zustand)
- Voice coach enhances, doesn't overwhelm

---

## Goal Achieved

✅ AI controls planning, adaptation, analysis, nutrition, personalization
✅ Deterministic math ensures biomechanical safety
✅ AI speaks intelligently as live voice coach
✅ User data persists across sessions
✅ System feels like real AI physiotherapist

---

**Built with ❤️ for intelligent rehabilitation**
