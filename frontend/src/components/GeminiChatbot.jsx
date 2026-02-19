import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// Initialize once — picks up VITE_GEMINI_API_KEY from .env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are OrthoVita's AI rehabilitation assistant. You help patients with:
1. Understanding their injuries and what exercises may help
2. Answering questions about the 4 exercises available: Squat, Bicep Curl, Knee Raise, Shoulder Press
3. General physical therapy advice, posture tips, and recovery guidance
4. Recommending which exercises to try based on their injury or condition

Keep responses concise, warm, and medically responsible. Always recommend consulting a doctor for serious injuries. 
If someone describes an injury, recommend relevant exercises from the 4 available ones and explain why.
Use plain text with occasional bullet points. No markdown headers. Max 3-4 sentences per response unless detail is needed.`;

const QUICK_PROMPTS = [
  "I have knee pain, what exercises can help?",
  "My shoulder feels weak after injury",
  "What's the correct form for squats?",
  "I have lower back pain",
  "How many reps should I do?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#00e5ff] opacity-60"
          style={{ animation: `ovBounce 1.2s ${i * 0.2}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}

export function GeminiChatbot({ userName }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi ${userName || 'there'}! 👋 I'm your OrthoVita AI assistant.\n\nDescribe your injury or condition and I'll recommend exercises, or ask me anything about your rehabilitation journey.`,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  // Persistent chat session — keeps conversation history automatically
  const chatRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Create chat session once on mount
  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    });
  }, []);

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    setError('');

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      const reply = response.text || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('Gemini error:', err);
      const msg = err?.message || '';
      setError(
        msg.includes('API_KEY') || msg.includes('403')
          ? 'Invalid API key. Check VITE_GEMINI_API_KEY in your .env and restart dev server.'
          : msg.includes('404') || msg.includes('not found')
          ? 'Model not found. Ensure you are using gemini-3-flash-preview.'
          : 'Could not reach Gemini. Check your API key and internet connection.'
      );
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ I\'m having trouble connecting right now. Check the error message below.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <style>{`
        @keyframes ovBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes ovSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ov-chat-panel {
          animation: ovSlideUp 0.25s ease both;
        }
        .ov-msg-user {
          background: rgba(0,229,255,0.1);
          border: 1px solid rgba(0,229,255,0.15);
          border-radius: 18px 18px 4px 18px;
          color: #e8f0ff;
          align-self: flex-end;
          max-width: 80%;
          padding: 10px 14px;
          font-size: 0.875rem;
          line-height: 1.55;
          white-space: pre-wrap;
        }
        .ov-msg-bot {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px 18px 18px 4px;
          color: #c8d8f0;
          align-self: flex-start;
          max-width: 85%;
          padding: 10px 14px;
          font-size: 0.875rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .ov-typing {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px 18px 18px 4px;
          align-self: flex-start;
        }
        .ov-quick-pill {
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.15);
          color: #6b9fb8;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .ov-quick-pill:hover {
          background: rgba(0,229,255,0.12);
          border-color: rgba(0,229,255,0.35);
          color: #00e5ff;
        }
      `}</style>

      {/* ── Floating button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-[#00e5ff] text-[#060b14]
            flex items-center justify-center text-2xl shadow-[0_0_32px_rgba(0,229,255,0.4)]
            hover:bg-[#00ccee] hover:scale-105 transition-all duration-200 active:scale-95"
          title="OrthoVita AI Assistant"
        >
          🤖
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] ov-chat-panel"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="bg-[#0a1220] border border-[#1c2e50] rounded-2xl flex flex-col overflow-hidden"
            style={{ height: '560px', boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.06)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c2e50] bg-[#060b14]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/20
                  flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-bold text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
                    OrthoVita AI
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
                    <span className="text-xs text-[#4a5e80]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Powered by Gemini
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#0d1526] border border-[#1c2e50] text-[#4a5e80]
                  hover:bg-[#1c2e50] hover:text-[#e8f0ff] transition-all text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#1c2e50 transparent' }}>
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'ov-msg-user' : 'ov-msg-bot'}>
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="ov-typing">
                  <TypingDots />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts — only show on first message */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto"
                style={{ scrollbarWidth: 'none' }}>
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="ov-quick-pill flex-shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-4 mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg
                text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[#1c2e50] bg-[#060b14]">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your injury or ask a question..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-[#0d1526] border border-[#1c2e50] text-[#e8f0ff]
                    placeholder-[#2d3f5c] rounded-xl px-4 py-2.5 text-sm resize-none
                    focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/20
                    disabled:opacity-50 transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '42px', maxHeight: '100px' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-[#00e5ff] text-[#060b14] flex items-center justify-center
                    hover:bg-[#00ccee] disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-150 active:scale-95 flex-shrink-0 text-base font-bold"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#060b14]/30 border-t-[#060b14]
                      rounded-full animate-spin" />
                  ) : '↑'}
                </button>
              </div>
              <p className="text-center text-[#2d3f5c] text-xs mt-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}