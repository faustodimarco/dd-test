'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PhotoCardProps {
  src: string;
  alt: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
  theme?: 'pink' | 'purple';
}

export default function PhotoCard({
  src,
  alt,
  label,
  selected,
  onClick,
  badge,
  theme = 'pink',
}: PhotoCardProps) {
  const ringColor = selected
    ? theme === 'pink'
      ? 'ring-pink-500'
      : 'ring-purple-500'
    : 'ring-transparent';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden bg-[#1a1a2e] cursor-pointer ring-2 transition-all duration-200 ${ringColor}`}
    >
      <div className="aspect-[3/4] relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
        <span className="text-white text-sm font-semibold">{label}</span>
      </div>
      {/* Badge */}
      {badge && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </div>
      )}
      {/* Checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">&#10003;</span>
        </div>
      )}
    </motion.div>
  );
}
