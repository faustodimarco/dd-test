'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import {
  BODY_TYPE_IMAGES,
  BREAST_SIZE_IMAGES,
  BUTT_SIZE_IMAGES,
} from '@/lib/assets';
import ProgressPills from '@/components/ProgressPills';
import PhotoCard from '@/components/PhotoCard';

interface Props { onNext: () => void; onBack: () => void }

export default function Step4({ onNext, onBack }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);

  if (!hydrated) return null;

  const canProceed = !!state.bodyType && !!state.breastSize && !!state.buttSize;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      <ProgressPills current={4} total={6} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-6 tracking-tight">
        BUILD HER BODY
      </h1>

      {/* Body Type */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Body Type</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(Object.entries(BODY_TYPE_IMAGES) as Array<[keyof typeof BODY_TYPE_IMAGES, string]>).map(([key, url]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.bodyType === key}
              onClick={() => update({ bodyType: key })}
              badge={key === 'slim' ? '🔥 Top Pick' : undefined}
              theme="purple"
            />
          );
        })}
      </div>

      {/* Breast Size */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Breast Size</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(Object.entries(BREAST_SIZE_IMAGES) as Array<[keyof typeof BREAST_SIZE_IMAGES, string]>).map(([key, url]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.breastSize === key}
              onClick={() => update({ breastSize: key })}
              badge={key === 'medium' ? '🔥 Top Pick' : undefined}
              theme="purple"
            />
          );
        })}
      </div>

      {/* Butt Size */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Butt Size</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(Object.entries(BUTT_SIZE_IMAGES) as Array<[keyof typeof BUTT_SIZE_IMAGES, string]>).map(([key, url]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.buttSize === key}
              onClick={() => update({ buttSize: key })}
              badge={key === 'medium' ? '🔥 Top Pick' : undefined}
              theme="purple"
            />
          );
        })}
      </div>

      {/* Social nudge */}
      <p className="text-gray-500 text-sm text-center italic mb-6">
        89% of users chose their body in under 30 seconds
      </p>

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
          disabled={!canProceed}
          className="flex-[3] btn-purple py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          NEXT &#x2192;
        </button>
      </div>
    </motion.div>
  );
}
