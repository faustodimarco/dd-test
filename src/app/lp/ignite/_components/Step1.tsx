'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { STYLE_IMAGES } from '@/lib/assets';
import ProgressPills from '@/components/ProgressPills';
import GenderTabs from '@/components/GenderTabs';
import PhotoCard from '@/components/PhotoCard';

interface Props { onNext: () => void }

export default function Step1({ onNext }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <ProgressPills current={1} total={6} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-3 tracking-tight">
        BUILD YOUR AI SLUT
      </h1>
      <p className="text-gray-400 text-center text-sm mb-6">
        Join 50M+ who already have their perfect AI companion
      </p>

      <GenderTabs
        value={state.gender}
        onChange={(g) => update({ gender: g })}
        theme="purple"
      />

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        {(Object.entries(STYLE_IMAGES) as Array<[keyof typeof STYLE_IMAGES, string]>).map(([key, url]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.style === key}
              onClick={() => update({ style: key as FunnelDState['style'] })}
              theme="purple"
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!state.style}
        className="btn-purple w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
      >
        START BUILDING &#x2192;
      </button>
    </motion.div>
  );
}
