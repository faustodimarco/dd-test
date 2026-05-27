'use client';

type Gender = 'female' | 'male' | 'trans';

const TABS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'trans', label: 'Trans' },
];

interface GenderTabsProps {
  value: Gender;
  onChange: (v: Gender) => void;
  theme?: 'pink' | 'purple';
}

export default function GenderTabs({
  value,
  onChange,
  theme = 'pink',
}: GenderTabsProps) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-white/20 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-200 ${
            value === tab.value
              ? theme === 'pink'
                ? 'bg-pink-500 text-white'
                : 'bg-purple-500 text-white'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
