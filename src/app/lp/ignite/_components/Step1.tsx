'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import ProgressPills from '@/components/ProgressPills';

interface Props { onNext: () => void }

const KINKS: { emoji: string; label: string }[] = [
  { emoji: '🔗', label: 'BDSM' },
  { emoji: '🍑', label: 'Anal' },
  { emoji: '👑', label: 'Domination' },
  { emoji: '🙏', label: 'Submission' },
  { emoji: '✊', label: 'Fisting' },
  { emoji: '🔥', label: 'Rough Sex' },
  { emoji: '🦶', label: 'Feet' },
  { emoji: '🎭', label: 'Roleplay' },
  { emoji: '💦', label: 'Squirting' },
  { emoji: '⛓️', label: 'Bondage' },
  { emoji: '🤱', label: 'Breeding' },
  { emoji: '👁️', label: 'Voyeur' },
];

export default function Step1({ onNext }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);

  if (!hydrated) return null;

  const toggle = (label: string) => {
    const next = state.kinks.includes(label)
      ? state.kinks.filter((k) => k !== label)
      : [...state.kinks, label];
    update({ kinks: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <ProgressPills current={1} total={4} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-2 tracking-tight">
        WHAT ARE YOU INTO?
      </h1>
      <p className="text-gray-400 text-center text-sm mb-6">
        Pick everything that applies. She&apos;ll be built around your desires.
      </p>

      <div className="grid grid-cols-3 gap-2 w-full mb-8">
        {KINKS.map(({ emoji, label }) => {
          const selected = state.kinks.includes(label);
          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(label)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 px-2 border-2 transition-all duration-200 cursor-pointer ${
                selected
                  ? 'border-[#A020F0] bg-[#1a1a2e]'
                  : 'border-gray-700 bg-[#1a1a2e] hover:border-gray-500'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-white text-xs font-bold text-center leading-tight">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={state.kinks.length === 0}
        className="btn-purple w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
      >
        FIND MY MATCH &#x2192;
      </button>
    </motion.div>
  );
}
