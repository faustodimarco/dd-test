'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { KINK_IMAGES } from '@/lib/assets';
import ProgressPills from '@/components/ProgressPills';
import PhotoCard from '@/components/PhotoCard';

interface Props { onNext: () => void }

const KINKS = [
  'BDSM',
  'Anal',
  'Domination',
  'Squirting',
  'Deepthroat',
  'Spanking',
  'Feet',
  'Choking',
  'Creampie',
] as const;

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

      <div className="grid grid-cols-3 gap-2 w-full max-w-[576px] mx-auto mb-8">
        {KINKS.map((label) => (
          <PhotoCard
            key={label}
            src={KINK_IMAGES[label]}
            alt={label}
            label={label}
            selected={state.kinks.includes(label)}
            onClick={() => toggle(label)}
            theme="purple"
            square
          />
        ))}
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
