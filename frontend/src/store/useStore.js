import { create } from 'zustand';
import { createSession as apiCreateSession, getSessions as apiGetSessions } from '../services/auth';

const getDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const useStore = create((set, get) => ({
  // User state
  user: null,
  rehabDay: 1,
  confirmedInjury: null,
  rehabPlan: null,
  sessionHistory: [],
  lastLoginDate: null,

  // Exercise state
  currentExercise: null,
  isActive: false,
  reps: 0,
  accuracy: 100,
  feedback: '',
  sessionStartTime: null,
  sessionData: [],
  badPostureCount: 0,

  // Actions
  setUser: (user) => set((state) => {
    const today = getDateKey();
    const isNewDay = state.lastLoginDate !== today;
    return {
      user,
      lastLoginDate: today,
      rehabDay: isNewDay ? state.rehabDay + 1 : state.rehabDay,
      sessionHistory: []
    };
  }),
  
  loadUserSessions: async () => {
    try {
      const sessions = await apiGetSessions();
      set({ sessionHistory: sessions.map(s => ({
        exercise: s.exercise,
        reps: s.reps,
        avgAccuracy: s.avg_accuracy,
        avgAngle: s.avg_angle,
        badPosturePercent: s.bad_posture_percent,
        duration: s.duration,
        timestamp: new Date(s.createdAt).getTime(),
        day: s.day || 1,
        date: new Date(s.createdAt).toISOString().split('T')[0]
      })) });
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  },
  
  setInjury: (injury) => set({ confirmedInjury: injury }),
  setRehabPlan: (plan) => set({ rehabPlan: plan }),
  incrementRehabDay: () => set((state) => ({ rehabDay: state.rehabDay + 1 })),

  setExercise: (exercise) => set({ 
    currentExercise: exercise, 
    reps: 0, 
    accuracy: 100,
    sessionData: [],
    sessionStartTime: null,
    badPostureCount: 0
  }),
  
  startSession: () => set({ 
    isActive: true, 
    sessionStartTime: Date.now(),
    reps: 0,
    sessionData: [],
    badPostureCount: 0
  }),
  
  stopSession: async () => {
    const state = get();
    const duration = Math.floor((Date.now() - state.sessionStartTime) / 1000);
    const avgAccuracy = state.sessionData.length > 0
      ? Math.round(state.sessionData.reduce((sum, d) => sum + d.accuracy, 0) / state.sessionData.length)
      : 0;
    const avgAngle = state.sessionData.length > 0
      ? Math.round(state.sessionData.reduce((sum, d) => sum + (d.angle || 0), 0) / state.sessionData.length)
      : 0;
    const badPosturePercent = state.sessionData.length > 0
      ? Math.round((state.badPostureCount / state.sessionData.length) * 100)
      : 0;

    const session = {
      exercise: state.currentExercise,
      reps: state.reps,
      avg_accuracy: avgAccuracy,
      avg_angle: avgAngle,
      bad_posture_percent: badPosturePercent,
      duration
    };

    try {
      await apiCreateSession(session);
      await get().loadUserSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
    }

    set({ isActive: false });
  },
  
  updateStats: (reps, accuracy, feedback, angle) => set((state) => {
    if (accuracy === 0) {
      return { feedback, accuracy: 0 };
    }
    
    let newSessionData = state.sessionData;
    if (reps > state.reps) {
      newSessionData = [...state.sessionData, { rep: reps, accuracy, angle: angle || 0, timestamp: Date.now() }];
    }
    
    const avgAccuracy = newSessionData.length > 0
      ? Math.round(newSessionData.reduce((sum, d) => sum + d.accuracy, 0) / newSessionData.length)
      : accuracy;
    
    return {
      reps,
      accuracy: avgAccuracy,
      feedback,
      sessionData: newSessionData,
      badPostureCount: accuracy < 70 ? state.badPostureCount + 1 : state.badPostureCount
    };
  }),

  resetSession: () => set({
    currentExercise: null,
    isActive: false,
    reps: 0,
    accuracy: 100,
    feedback: '',
    sessionStartTime: null,
    sessionData: [],
    badPostureCount: 0
  }),

  deleteSession: (sessionIndex) => set((state) => ({
    sessionHistory: state.sessionHistory.filter((_, index) => index !== sessionIndex)
  }))
}));
