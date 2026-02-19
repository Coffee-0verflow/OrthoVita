import { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useVoiceCoach } from '../hooks/useVoiceCoach';

export const NutritionAdvice = ({ injury, effortLevel, onClose }) => {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { speak } = useVoiceCoach();

  useEffect(() => {
    const loadAdvice = async () => {
      const result = await aiService.getNutritionAdvice(injury, effortLevel, 'active');
      setAdvice(result);
      setLoading(false);
      setTimeout(() => speak(result.shortVoiceTip, true), 500);
    };
    loadAdvice();
  }, [injury, effortLevel]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1c2e50] border-t-[#00e5ff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-8 my-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
            🥗 Nutrition Guidance
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#060b14] border border-[#1c2e50] text-[#4a5e80]
              hover:bg-[#1c2e50] hover:text-[#e8f0ff] transition-all"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-[#060b14] border border-[#00ff9d]/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#00ff9d] mb-2">✓ Foods to Eat</h3>
            <ul className="space-y-1">
              {advice.foodsToEat.map((food, i) => (
                <li key={i} className="text-[#c8d8f0] text-sm">• {food}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#060b14] border border-[#ff3366]/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#ff3366] mb-2">✗ Foods to Avoid</h3>
            <ul className="space-y-1">
              {advice.foodsToAvoid.map((food, i) => (
                <li key={i} className="text-[#c8d8f0] text-sm">• {food}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#060b14] border border-[#00e5ff]/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#00e5ff] mb-2">💧 Hydration</h3>
            <p className="text-[#c8d8f0] text-sm">{advice.hydrationAdvice}</p>
          </div>
        </div>

        <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-xl p-4 mb-4">
          <p className="text-xs text-[#ff6b35]">
            ⚠️ This is assistive guidance. Consult a healthcare professional for personalized advice.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold
            hover:bg-[#00ccee] transition-all"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
