import { useStore } from '../store/useStore';
import { EXERCISES } from '../utils/exerciseDetectors';

export const ExerciseHistory = ({ onClose }) => {
  const { sessionHistory } = useStore();

  const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const groupByDate = () => {
    const grouped = {};
    sessionHistory.forEach(session => {
      const date = session.date || getDateFromTimestamp(session.timestamp);
      if (!grouped[date]) grouped[date] = { sessions: [], day: session.day || 1 };
      grouped[date].sessions.push(session);
    });
    return grouped;
  };

  const formatDateHeader = (dateKey) => {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = dateKey === getDateFromTimestamp(today.getTime());
    const isYesterday = dateKey === getDateFromTimestamp(yesterday.getTime());
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const dateGroups = groupByDate();
  const dates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1526] border border-[#1c2e50] rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#1c2e50] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
              Exercise History
            </h2>
            <p className="text-sm text-[#4a5e80] mt-1">Your rehabilitation journey</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#4a5e80] hover:text-[#e8f0ff] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {dates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-[#4a5e80]">No exercise history yet</p>
              <p className="text-sm text-[#4a5e80] mt-2">Complete your first session to see it here</p>
            </div>
          ) : (
            dates.map(date => {
              const { sessions, day } = dateGroups[date];
              return (
                <div key={date} className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#00e5ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {formatDateHeader(date)}
                      </h3>
                      <p className="text-xs text-[#4a5e80] mt-0.5">Day {day}</p>
                    </div>
                    <span className="text-xs text-[#4a5e80]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {sessions.length} session{sessions.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sessions.map((session, idx) => {
                      const grade = session.avgAccuracy >= 90 ? { label: 'Excellent', color: '#00ff9d' }
                        : session.avgAccuracy >= 75 ? { label: 'Good', color: '#00e5ff' }
                        : session.avgAccuracy >= 60 ? { label: 'Fair', color: '#ff6b35' }
                        : { label: 'Practice', color: '#ff3366' };

                      return (
                        <div key={idx} className="bg-[#0d1526] border border-[#1c2e50] rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#e8f0ff]">
                                {EXERCISES[session.exercise]?.name || session.exercise}
                              </span>
                              <span
                                className="text-xs px-2 py-0.5 rounded font-bold"
                                style={{ 
                                  color: grade.color, 
                                  background: `${grade.color}15`,
                                  border: `1px solid ${grade.color}40`
                                }}
                              >
                                {grade.label}
                              </span>
                            </div>
                            <span className="text-xs text-[#4a5e80]">
                              {formatTime(session.timestamp)}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <div className="text-xs text-[#4a5e80] mb-1">Reps</div>
                              <div className="text-lg font-bold text-[#e8f0ff]">{session.reps}</div>
                            </div>
                            <div>
                              <div className="text-xs text-[#4a5e80] mb-1">Accuracy</div>
                              <div className="text-lg font-bold" style={{ color: grade.color }}>
                                {session.avgAccuracy}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-[#4a5e80] mb-1">Duration</div>
                              <div className="text-lg font-bold text-[#e8f0ff]">
                                {formatDuration(session.duration)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
