import { useState } from 'react';
import { aiService } from '../services/aiService';
import { useVoiceCoach } from '../hooks/useVoiceCoach';
import { useStore } from '../store/useStore';

export const SessionAnalysis = ({ onClose }) => {
  const { sessionHistory, currentExercise, reps, accuracy } = useStore();
  const [analysis, setAnalysis] = useState(null);
  const [difficulty, setDifficulty] = useState(3);
  const [loading, setLoading] = useState(false);
  const { speak } = useVoiceCoach();

  const handleAnalyze = async () => {
    setLoading(true);
    const lastSession = sessionHistory[sessionHistory.length - 1];
    const last3 = sessionHistory.slice(-3);
    
    const result = await aiService.analyzeSession(
      lastSession,
      last3,
      difficulty
    );
    
    setAnalysis(result);
    setLoading(false);
    setTimeout(() => speak(result.shortVoiceSummary, true), 500);
  };

  return (
    <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-8">
        <h2 className="text-2xl font-black text-[#e8f0ff] mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
          Session Complete! 🎉
        </h2>

        {!analysis ? (
          <>
            <p className="text-[#c8d8f0] mb-4">How difficult was this session?</p>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    difficulty === level
                      ? 'bg-[#00e5ff] text-[#060b14]'
                      : 'bg-[#060b14] text-[#4a5e80] border border-[#1c2e50]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full px-6 py-3 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold
                hover:bg-[#00ccee] disabled:opacity-50 transition-all"
            >
              {loading ? 'Analyzing...' : 'Get AI Analysis'}
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="bg-[#060b14] border border-[#00e5ff]/20 rounded-xl p-4">
                <p className="text-xs text-[#4a5e80] mb-1">Performance Rating</p>
                <p className="text-lg font-bold text-[#00e5ff]">{analysis.performanceRating}</p>
              </div>
              <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-4">
                <p className="text-xs text-[#4a5e80] mb-1">Improvement Trend</p>
                <p className="text-sm text-[#c8d8f0]">{analysis.improvementTrend}</p>
              </div>
              <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-4">
                <p className="text-xs text-[#4a5e80] mb-1">Next Session</p>
                <p className="text-sm text-[#c8d8f0]">{analysis.nextSessionAdjustment}</p>
              </div>
              <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-xl p-4">
                <p className="text-sm text-[#00ff9d]">{analysis.motivationMessage}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold
                hover:bg-[#00ccee] transition-all"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};
