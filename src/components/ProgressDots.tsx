'use client';

interface ProgressDotsProps {
  current: number;
  total: number;
  theme?: 'pink' | 'purple';
}

export default function ProgressDots({
  current,
  total,
  theme = 'pink',
}: ProgressDotsProps) {
  const accentColor = theme === 'pink' ? '#EC4899' : '#8B5CF6';

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
          style={{ backgroundColor: i < current ? accentColor : '#4b5563' }}
        />
      ))}
    </div>
  );
}
