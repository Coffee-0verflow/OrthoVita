import { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useVoiceCoach } from '../hooks/useVoiceCoach';

export const PreExerciseBriefing = ({ exerciseName, onStart }) => {
  const [briefing, setBriefing] = useState('');
  const [loading, setLoading] = useState(true);
  const { speak } = useVoiceCoach();

  useEffect(() => {
    const loadBriefing = async () => {
      const text = await aiService.getPreExerciseBriefing(exerciseName);
      setBriefing(text);
      setLoading(false);
      setTimeout(() => speak(text, true), 500);
    };
    loadBriefing();
  }, [exerciseName]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1c2e50] border-t-[#00e5ff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
            Ready for {exerciseName}?
          </h2>
        </div>

        <div className="bg-[#060b14] border border-[#00e5ff]/20 rounded-xl p-6 mb-6">
          <p className="text-[#c8d8f0] leading-relaxed">{briefing}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {['✓ Proper Shoes', '✓ Comfortable Clothes', '✓ Yoga Mat', '✓ Spacious Area'].map((item) => (
            <div key={item} className="bg-[#060b14] border border-[#1c2e50] rounded-lg p-3 text-center text-sm text-[#00e5ff]">
              {item}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full px-6 py-4 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold text-lg
            hover:bg-[#00ccee] hover:shadow-[0_0_24px_rgba(0,229,255,0.4)]
            transition-all duration-200 active:scale-95"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Start Exercise
        </button>
      </div>
    </div>
  );
};
