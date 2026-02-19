import { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useVoiceCoach } from '../hooks/useVoiceCoach';

export const AIGreeting = ({ user, rehabDay, onContinue }) => {
  const [greeting, setGreeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const { speak } = useVoiceCoach();

  useEffect(() => {
    const loadGreeting = async () => {
      const lastSession = localStorage.getItem('lastSessionSummary') || 'First session';
      const result = await aiService.getGreeting(user.name, rehabDay, lastSession);
      setGreeting(result.greetingMessage);
      setLoading(false);
      setTimeout(() => speak(result.greetingMessage, true), 500);
    };
    loadGreeting();
  }, [user.name, rehabDay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1c2e50] border-t-[#00e5ff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b14] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-8 text-center">
        <div className="text-6xl mb-6">👋</div>
        <h1 className="text-3xl font-black text-[#e8f0ff] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Welcome Back, {user.name}!
        </h1>
        <div className="bg-[#060b14] border border-[#00e5ff]/20 rounded-xl p-6 mb-6">
          <p className="text-lg text-[#c8d8f0] leading-relaxed">{greeting}</p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl px-4 py-2">
            <div className="text-xs text-[#4a5e80]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              REHAB DAY
            </div>
            <div className="text-2xl font-black text-[#00e5ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
              {rehabDay}
            </div>
          </div>
        </div>
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold text-lg
            hover:bg-[#00ccee] hover:shadow-[0_0_24px_rgba(0,229,255,0.4)]
            transition-all duration-200 active:scale-95"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};
