'use client';

interface ProgressPillsProps {
  current: number;
  total: number;
  theme?: 'pink' | 'purple';
}

export default function ProgressPills({
  current,
  total,
  theme = 'purple',
}: ProgressPillsProps) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isPast = step < current;

        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isActive
                  ? theme === 'pink'
                    ? 'bg-pink-500 text-white'
                    : 'bg-[#A020F0] text-white'
                  : isPast
                  ? theme === 'pink'
                    ? 'bg-pink-500/40 text-pink-300'
                    : 'bg-[#A020F0]/40 text-[#C060FF]'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < total && (
              <span className="text-gray-600 text-xs">&#8212;</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
