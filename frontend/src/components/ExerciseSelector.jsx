import { EXERCISES } from '../utils/exerciseDetectors';
import { useStore } from '../store/useStore';

export const ExerciseSelector = () => {
  const { currentExercise, setExercise, isActive } = useStore();

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {Object.entries(EXERCISES).map(([key, exercise]) => {
        const selected = currentExercise === key;
        return (
          <button
            key={key}
            onClick={() => setExercise(key)}
            disabled={isActive}
            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200
              ${selected
                ? 'border-[#00e5ff] bg-[#00e5ff]/5 shadow-[0_0_24px_rgba(0,229,255,0.1)]'
                : 'border-[#1c2e50] bg-[#0d1526] hover:border-[#00e5ff]/40 hover:bg-[#111e35]'
              }
              ${isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <h3 className={`font-bold text-base mb-1 ${selected ? 'text-[#00e5ff]' : 'text-[#e8f0ff]'}`}
              style={{ fontFamily: "'Syne', sans-serif" }}>
              {exercise.name}
            </h3>
            <p className="text-sm text-[#4a5e80]">{exercise.description}</p>
            {selected && (
              <div className="mt-3 h-0.5 w-8 bg-[#00e5ff] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};