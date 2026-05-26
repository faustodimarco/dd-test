'use client';
import { motion } from 'framer-motion';

interface ColorSwatchProps {
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  theme?: 'pink' | 'purple';
  badge?: string;
}

export default function ColorSwatch({
  color,
  label,
  selected,
  onClick,
  theme = 'pink',
  badge,
}: ColorSwatchProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
            selected
              ? theme === 'pink'
                ? 'ring-2 ring-offset-2 ring-pink-500 ring-offset-[#0D0D0D]'
                : 'ring-2 ring-offset-2 ring-purple-500 ring-offset-[#0D0D0D]'
              : 'border-white/20'
          }`}
          style={{ backgroundColor: color }}
          title={label}
        />
        {badge && selected && (
          <div className="absolute -top-1 -right-1 text-xs">&#128293;</div>
        )}
      </div>
      {selected && (
        <span className="text-white text-xs font-medium">{label}</span>
      )}
    </div>
  );
}
