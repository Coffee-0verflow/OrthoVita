import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { EXERCISES } from '../utils/exerciseDetectors';

export const SessionSummary = () => {
  const { currentExercise, reps, sessionData, sessionStartTime } = useStore();

  if (!sessionStartTime || sessionData.length === 0) return null;

  const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  const avgAccuracy = sessionData.length > 0
    ? Math.round(sessionData.reduce((sum, d) => sum + d.accuracy, 0) / sessionData.length)
    : 0;

  const chartData = sessionData.map((d, i) => ({ rep: i + 1, accuracy: d.accuracy }));

  const grade = avgAccuracy >= 90 ? { label: 'Excellent', color: '#00ff9d' }
    : avgAccuracy >= 75 ? { label: 'Good', color: '#00e5ff' }
    : avgAccuracy >= 60 ? { label: 'Fair', color: '#ff6b35' }
    : { label: 'Keep Practicing', color: '#ff3366' };

  return (
    <div className="mt-8 bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
          Session Summary
        </h2>
        <span
          className="text-sm font-bold px-3 py-1 rounded-lg border"
          style={{ color: grade.color, borderColor: `${grade.color}40`, background: `${grade.color}10` }}
        >
          {grade.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-4 text-center">
          <div className="text-xs text-[#4a5e80] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            EXERCISE
          </div>
          <div className="text-base font-bold text-[#00e5ff]">
            {EXERCISES[currentExercise]?.name || '—'}
          </div>
        </div>
        <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-4 text-center">
          <div className="text-xs text-[#4a5e80] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            TOTAL REPS
          </div>
          <div className="text-2xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
            {reps}
          </div>
        </div>
        <div className="bg-[#060b14] border border-[#1c2e50] rounded-xl p-4 text-center">
          <div className="text-xs text-[#4a5e80] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            AVG ACCURACY
          </div>
          <div className="text-2xl font-black" style={{ fontFamily: "'Syne', sans-serif", color: grade.color }}>
            {avgAccuracy}%
          </div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-[#4a5e80] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ACCURACY PER REP
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2e50" />
              <XAxis
                dataKey="rep"
                stroke="#1c2e50"
                tick={{ fill: '#4a5e80', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                label={{ value: 'Rep', position: 'insideBottom', offset: -2, fill: '#4a5e80', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#1c2e50"
                tick={{ fill: '#4a5e80', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: '#4a5e80', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#111e35',
                  border: '1px solid #1c2e50',
                  borderRadius: 10,
                  color: '#e8f0ff',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12
                }}
                formatter={(v) => [`${v}%`, 'Accuracy']}
                labelFormatter={(v) => `Rep ${v}`}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#00e5ff"
                strokeWidth={2}
                dot={{ fill: '#00e5ff', r: 3 }}
                activeDot={{ r: 5, fill: '#00ff9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};