'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { ETHNICITY_IMAGES, SKIN_TONES } from '@/lib/assets';
import ProgressPills from '@/components/ProgressPills';
import PhotoCard from '@/components/PhotoCard';
import ColorSwatch from '@/components/ColorSwatch';

interface Props { onNext: () => void; onBack: () => void }

export default function Step2({ onNext, onBack }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      <ProgressPills current={2} total={6} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-6 tracking-tight">
        WHAT DOES SHE LOOK LIKE?
      </h1>

      {/* Ethnicity */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Ethnicity</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {(Object.entries(ETHNICITY_IMAGES) as Array<[keyof typeof ETHNICITY_IMAGES, string]>).map(([key, url]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.ethnicity === key}
              onClick={() => update({ ethnicity: key })}
              badge={key === 'white' ? '🔥 Most Popular' : undefined}
              theme="purple"
            />
          );
        })}
      </div>

      {/* Skin Tone */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Skin Tone</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {SKIN_TONES.map((tone) => (
          <ColorSwatch
            key={tone.hex}
            color={tone.hex}
            label={tone.label}
            selected={state.skinTone === tone.hex}
            onClick={() => update({ skinTone: tone.hex })}
            theme="purple"
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 text-white border border-white/20 rounded-xl font-bold uppercase tracking-wide hover:bg-white/5 transition-colors"
        >
          &#x2190; Back
        </button>
        <button
          onClick={onNext}
          disabled={!state.ethnicity}
          className="flex-[3] btn-purple py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          NEXT &#x2192;
        </button>
      </div>
    </motion.div>
  );
}
