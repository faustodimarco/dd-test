'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { ETHNICITY_IMAGES } from '@/lib/assets';
import ProgressPills from '@/components/ProgressPills';
import PhotoCard from '@/components/PhotoCard';

interface Props { onNext: () => void; onBack: () => void }

export default function Step3({ onNext, onBack }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <ProgressPills current={3} total={4} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-2 tracking-tight">
        WHAT DOES SHE LOOK LIKE?
      </h1>
      <p className="text-gray-400 text-center text-sm mb-6">
        Pick her type.
      </p>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[576px] mx-auto mb-8">
        {(Object.entries(ETHNICITY_IMAGES) as Array<[keyof typeof ETHNICITY_IMAGES, string]>).map(([key, url]) => {
          const labelMap: Record<string, string> = {
            white: 'Caucasian',
            black: 'Ebony',
            asian: 'Asian',
            latina: 'Latina',
            arab: 'Middle East',
            indian: 'Indian',
          };
          const label = labelMap[key] ?? (key.charAt(0).toUpperCase() + key.slice(1));
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.ethnicity === key}
              onClick={() => update({ ethnicity: key })}
              theme="purple"
              square
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!state.ethnicity}
        className="btn-purple w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed mb-3"
      >
        ALMOST THERE &#x2192;
      </button>
      <button
        onClick={onBack}
        className="w-full py-3 text-gray-500 text-sm font-medium hover:text-gray-300 transition-colors"
      >
        &#x2190; Back
      </button>
    </motion.div>
  );
}
