import { useStore } from '../store/useStore';
import { EXERCISES } from '../utils/exerciseDetectors';

export const StatsPanel = () => {
  const { reps, accuracy, feedback, isActive, sessionStartTime, currentExercise } = useStore();

  const getRepLabel = () => {
    if (!currentExercise) return 'REPS';
    const exercise = EXERCISES[currentExercise];
    if (!exercise) return 'REPS';
    
    const name = exercise.name.toUpperCase();
    if (name.includes('CURL')) return 'CURLS';
    if (name.includes('SQUAT')) return 'SQUATS';
    if (name.includes('LUNGE')) return 'LUNGES';
    if (name.includes('RAISE')) return 'RAISES';
    if (name.includes('PRESS')) return 'PRESSES';
    if (name.includes('PUSH')) return 'PUSHES';
    if (name.includes('CIRCLE')) return 'CIRCLES';
    if (name.includes('ROTATION')) return 'ROTATIONS';
    if (name.includes('TWIST')) return 'TWISTS';
    if (name.includes('PLANK')) return 'SECONDS';
    return 'REPS';
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '0:00';
    const seconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracyColor = accuracy >= 80 ? '#00ff9d' : accuracy >= 60 ? '#ff6b35' : '#ff3366';

  return (
    <div className="bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 h-full">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-[#060b14] rounded-xl p-2 sm:p-3 text-center border border-[#1c2e50]">
          <div className="text-2xl sm:text-3xl font-black text-[#00e5ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
            {reps}
          </div>
          <div className="text-[10px] sm:text-xs text-[#4a5e80] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {getRepLabel()}
          </div>
        </div>

        <div className="bg-[#060b14] rounded-xl p-2 sm:p-3 text-center border border-[#1c2e50]">
          <div className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "'Syne', sans-serif", color: accuracyColor }}>
            {accuracy}%
          </div>
          <div className="text-[10px] sm:text-xs text-[#4a5e80] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ACCURACY
          </div>
        </div>

        <div className="bg-[#060b14] rounded-xl p-2 sm:p-3 text-center border border-[#1c2e50]">
          <div className="text-2xl sm:text-3xl font-black text-[#a78bfa]" style={{ fontFamily: "'Syne', sans-serif" }}>
            {isActive ? getSessionDuration() : '0:00'}
          </div>
          <div className="text-[10px] sm:text-xs text-[#4a5e80] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            TIME
          </div>
        </div>
      </div>

      {/* Live feedback */}
      <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-3 sm:p-4">
        <div className="text-xs font-medium text-[#4a5e80] mb-2 flex items-center gap-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {isActive && (
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse inline-block" />
          )}
          LIVE FEEDBACK
        </div>
        <div className="text-sm sm:text-base font-medium text-[#00e5ff]">
          {feedback || 'Select an exercise to begin'}
        </div>
      </div>

      {/* Accuracy bar */}
      <div>
        <div className="flex justify-between text-xs text-[#4a5e80] mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <span>FORM SCORE</span>
          <span style={{ color: accuracyColor }}>{accuracy}%</span>
        </div>
        <div className="h-1.5 bg-[#060b14] rounded-full overflow-hidden border border-[#1c2e50]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${accuracy}%`,
              background: `linear-gradient(90deg, ${accuracyColor}88, ${accuracyColor})`
            }}
          />
        </div>
      </div>
    </div>
  );
};