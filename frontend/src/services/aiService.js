import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const aiService = {
  async getGreeting(userName, rehabDay, lastSessionSummary) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.8, maxOutputTokens: 100 },
      });
      const prompt = `User: ${userName}, Rehab Day: ${rehabDay}, Last Session: ${lastSessionSummary || 'First session'}. Generate a warm, motivational greeting (2 sentences max).`;
      const response = await chat.sendMessage({ message: prompt });
      return { greetingMessage: response.text };
    } catch (err) {
      return { greetingMessage: `Welcome back ${userName}. Let's continue your recovery journey today.` };
    }
  },

  async confirmInjury(injuryDescription) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.3, maxOutputTokens: 150 },
      });
      const prompt = `Injury: "${injuryDescription}". Return JSON: {suspectedInjury: string, confirmationQuestions: [string, string]}. Support: knee pain, lower back pain, shoulder pain.`;
      const response = await chat.sendMessage({ message: prompt });
      return JSON.parse(response.text.replace(/```json|```/g, '').trim());
    } catch (err) {
      return {
        suspectedInjury: 'General musculoskeletal pain',
        confirmationQuestions: ['Is the pain constant or intermittent?', 'Does movement worsen the pain?']
      };
    }
  },

  async generateRehabPlan(profile) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.5, maxOutputTokens: 300 },
      });
      const prompt = `Profile: Injury=${profile.injury}, Level=${profile.fitnessLevel}, Goal=${profile.goal}, Age=${profile.age}. Return JSON: {exerciseName, day1Plan: {sets, repsOrDuration, intensityLevel}, progressionStrategy, expectedRecoveryTimeline, dailyDuration, safetyInstructions, keyFocusPoints}`;
      const response = await chat.sendMessage({ message: prompt });
      return JSON.parse(response.text.replace(/```json|```/g, '').trim());
    } catch (err) {
      return {
        exerciseName: 'Squat',
        day1Plan: { sets: 2, repsOrDuration: '8 reps', intensityLevel: 'Light' },
        progressionStrategy: 'Increase by 2 reps every 3 days',
        expectedRecoveryTimeline: '4-6 weeks',
        dailyDuration: '10-15 minutes',
        safetyInstructions: 'Stop if sharp pain occurs',
        keyFocusPoints: 'Maintain proper form'
      };
    }
  },

  async getPreExerciseBriefing(exerciseName) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.7, maxOutputTokens: 120 },
      });
      const prompt = `Exercise: ${exerciseName}. Generate motivational + safety briefing (3 sentences). Mention: proper shoes, comfortable clothes, spacious area, stop if sharp pain.`;
      const response = await chat.sendMessage({ message: prompt });
      return response.text;
    } catch (err) {
      return 'Ensure you have proper footwear and comfortable clothing. Make sure you have enough space around you. Stop immediately if you feel sharp pain.';
    }
  },

  async analyzeSession(sessionMetrics, lastSessions, difficultyFeedback) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.6, maxOutputTokens: 250 },
      });
      const prompt = `Current: ${JSON.stringify(sessionMetrics)}. Last 3: ${JSON.stringify(lastSessions)}. Difficulty: ${difficultyFeedback}. Return JSON: {performanceRating, improvementTrend, plateauDetected, nextSessionAdjustment, motivationMessage, shortVoiceSummary}`;
      const response = await chat.sendMessage({ message: prompt });
      return JSON.parse(response.text.replace(/```json|```/g, '').trim());
    } catch (err) {
      return {
        performanceRating: 'Good',
        improvementTrend: 'Steady progress',
        plateauDetected: false,
        nextSessionAdjustment: 'Continue current level',
        motivationMessage: 'Great work! Keep it up.',
        shortVoiceSummary: 'Good session. Keep practicing.'
      };
    }
  },

  async getAdaptivePlan(sessionHistory, difficultyRating, currentPlan) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.5, maxOutputTokens: 200 },
      });
      const prompt = `History: ${JSON.stringify(sessionHistory)}. Difficulty: ${difficultyRating}/5. Current: ${JSON.stringify(currentPlan)}. Decide: increase intensity, reduce reps, add hold time, or maintain? Return updated plan JSON.`;
      const response = await chat.sendMessage({ message: prompt });
      return JSON.parse(response.text.replace(/```json|```/g, '').trim());
    } catch (err) {
      return currentPlan;
    }
  },

  async getNutritionAdvice(injury, effortLevel, recoveryStage) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { temperature: 0.6, maxOutputTokens: 200 },
      });
      const prompt = `Injury: ${injury}, Effort: ${effortLevel}, Stage: ${recoveryStage}. Return JSON: {foodsToEat: [string], foodsToAvoid: [string], hydrationAdvice: string, shortVoiceTip: string}`;
      const response = await chat.sendMessage({ message: prompt });
      return JSON.parse(response.text.replace(/```json|```/g, '').trim());
    } catch (err) {
      return {
        foodsToEat: ['Protein-rich foods', 'Leafy greens', 'Berries'],
        foodsToAvoid: ['Processed foods', 'Excess sugar'],
        hydrationAdvice: 'Drink 8-10 glasses of water daily',
        shortVoiceTip: 'Stay hydrated and eat protein-rich foods for recovery.'
      };
    }
  }
};
