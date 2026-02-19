import { EXERCISES } from '../utils/exerciseDetectors';
import { useStore } from '../store/useStore';

export const ExerciseSelector = () => {
  const { currentExercise, setExercise, isActive } = useStore();

  const categories = {
    'Upper Body': [],
    'Lower Body': [],
    'Core & Balance': [],
  };

  Object.entries(EXERCISES).forEach(([key, exercise]) => {
    categories[exercise.category].push({ key, ...exercise });
  });

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-[#e8f0ff] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
        Select Exercise
      </h2>
      {Object.entries(categories).map(([category, exercises]) => (
        <div key={category} className="mb-5">
          <h3 className="text-xs font-semibold text-[#00e5ff] mb-2 uppercase tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {category}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {exercises.map(({ key, name, description }) => {
              const selected = currentExercise === key;
              return (
                <button
                  key={key}
                  onClick={() => setExercise(key)}
                  disabled={isActive}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${selected
                      ? 'border-[#00e5ff] bg-[#00e5ff]/5 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                      : 'border-[#1c2e50] bg-[#0d1526] hover:border-[#00e5ff]/40 hover:bg-[#111e35]'
                    }
                    ${isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <h4 className={`font-bold text-sm mb-1 ${selected ? 'text-[#00e5ff]' : 'text-[#e8f0ff]'}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    {name}
                  </h4>
                  <p className="text-xs text-[#4a5e80] leading-snug">{description}</p>
                  {selected && (
                    <div className="mt-2 h-0.5 w-6 bg-[#00e5ff] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};