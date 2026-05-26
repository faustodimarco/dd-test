'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_C, FunnelCState } from '@/lib/types';
import { ETHNICITY_IMAGES, BODY_TYPE_IMAGES } from '@/lib/assets';
import ProgressDots from '@/components/ProgressDots';
import PhotoCard from '@/components/PhotoCard';

interface Props { onNext: () => void; onBack: () => void }

export default function Step2({ onNext, onBack }: Props) {
  const { state, update } = useFunnelState<FunnelCState>('funnel_c', DEFAULT_FUNNEL_C);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      <ProgressDots current={2} total={3} theme="pink" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-6 tracking-tight">
        WHAT DOES SHE LOOK LIKE?
      </h1>

      {/* Ethnicity */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Ethnicity</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {(Object.keys(ETHNICITY_IMAGES) as Array<keyof typeof ETHNICITY_IMAGES>).map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={ETHNICITY_IMAGES[key]}
              alt={label}
              label={label}
              selected={state.ethnicity === key}
              onClick={() => update({ ethnicity: key })}
              theme="pink"
            />
          );
        })}
      </div>

      {/* Body Type */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Body Type</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(Object.keys(BODY_TYPE_IMAGES) as Array<keyof typeof BODY_TYPE_IMAGES>).map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={BODY_TYPE_IMAGES[key]}
              alt={label}
              label={label}
              selected={state.bodyType === key}
              onClick={() => update({ bodyType: key })}
              theme="pink"
            />
          );
        })}
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
          disabled={!state.ethnicity || !state.bodyType}
          className="flex-[3] btn-pink py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          NEXT &#x2192;
        </button>
      </div>
    </motion.div>
  );
}
