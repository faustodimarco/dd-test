'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { EYE_COLORS, HAIR_COLORS, HAIR_STYLE_IMAGES } from '@/lib/assets';
import ProgressPills from '@/components/ProgressPills';
import ColorSwatch from '@/components/ColorSwatch';
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
      className="flex flex-col"
    >
      <ProgressPills current={3} total={6} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-6 tracking-tight">
        STYLE HER YOUR WAY
      </h1>

      {/* Eye Color */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Eye Color</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {EYE_COLORS.map((color) => (
          <ColorSwatch
            key={color.hex}
            color={color.hex}
            label={color.label}
            selected={state.eyeColor === color.hex}
            onClick={() => update({ eyeColor: color.hex })}
            badge={color.label === 'Blue' ? '🔥' : undefined}
            theme="purple"
          />
        ))}
      </div>

      {/* Hair Color */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Hair Color</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {HAIR_COLORS.map((color) => (
          <ColorSwatch
            key={color.hex}
            color={color.hex}
            label={color.label}
            selected={state.hairColor === color.hex}
            onClick={() => update({ hairColor: color.hex })}
            badge={color.label === 'Black' ? '🔥' : undefined}
            theme="purple"
          />
        ))}
      </div>

      {/* Hair Style */}
      <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Hair Style</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(Object.entries(HAIR_STYLE_IMAGES) as Array<[keyof typeof HAIR_STYLE_IMAGES, string]>).map(([key, url]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={url}
              alt={label}
              label={label}
              selected={state.hairStyle === key}
              onClick={() => update({ hairStyle: key })}
              badge={key === 'long' ? '🔥 Most Popular' : undefined}
              theme="purple"
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
          disabled={!state.eyeColor || !state.hairColor || !state.hairStyle}
          className="flex-[3] btn-purple py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          NEXT &#x2192;
        </button>
      </div>
    </motion.div>
  );
}
