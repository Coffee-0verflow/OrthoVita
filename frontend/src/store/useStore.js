import { create } from 'zustand';

export const useStore = create((set) => ({
  // Exercise state
  currentExercise: null,
  isActive: false,
  reps: 0,
  accuracy: 100,
  feedback: '',
  sessionStartTime: null,
  sessionData: [],

  // Actions
  setExercise: (exercise) => set({ 
    currentExercise: exercise, 
    reps: 0, 
    accuracy: 100,
    sessionData: [],
    sessionStartTime: null 
  }),
  
  startSession: () => set({ 
    isActive: true, 
    sessionStartTime: Date.now(),
    reps: 0,
    sessionData: []
  }),
  
  stopSession: () => set({ isActive: false }),
  
  updateStats: (reps, accuracy, feedback) => set((state) => ({
    reps,
    accuracy,
    feedback,
    sessionData: [...state.sessionData, { reps, accuracy, timestamp: Date.now() }]
  })),

  resetSession: () => set({
    currentExercise: null,
    isActive: false,
    reps: 0,
    accuracy: 100,
    feedback: '',
    sessionStartTime: null,
    sessionData: []
  })
}));
