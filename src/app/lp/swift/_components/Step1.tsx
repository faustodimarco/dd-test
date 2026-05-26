'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_C, FunnelCState } from '@/lib/types';
import { LOGO_URL, STYLE_IMAGES } from '@/lib/assets';
import ProgressDots from '@/components/ProgressDots';
import GenderTabs from '@/components/GenderTabs';
import PhotoCard from '@/components/PhotoCard';

interface Props { onNext: () => void }

export default function Step1({ onNext }: Props) {
  const { state, update } = useFunnelState<FunnelCState>('funnel_c', DEFAULT_FUNNEL_C);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      {/* Logo */}
      <div className="mb-6">
        <Image
          src={LOGO_URL}
          alt="dondi.ai"
          width={120}
          height={40}
          className="object-contain"
          unoptimized
        />
      </div>

      <ProgressDots current={1} total={3} theme="pink" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-6 tracking-tight">
        BUILD YOUR AI SLUT
      </h1>

      <GenderTabs
        value={state.gender}
        onChange={(g) => update({ gender: g })}
        theme="pink"
      />

      {/* Style cards */}
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        {(Object.keys(STYLE_IMAGES) as Array<keyof typeof STYLE_IMAGES>).map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <PhotoCard
              key={key}
              src={STYLE_IMAGES[key]}
              alt={label}
              label={label}
              selected={state.style === key}
              onClick={() => update({ style: key as FunnelCState['style'] })}
              theme="pink"
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!state.style}
        className="btn-pink w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
      >
        NEXT &#x2192;
      </button>
    </motion.div>
  );
}
