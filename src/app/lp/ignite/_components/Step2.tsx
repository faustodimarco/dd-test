'use client';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState, ControlDynamic } from '@/lib/types';
import ProgressPills from '@/components/ProgressPills';

interface Props { onNext: () => void; onBack: () => void }

const OPTIONS: { value: ControlDynamic; emoji: string; title: string; sub: string }[] = [
  { value: 'dom', emoji: '👑', title: "YOU DOMINATE", sub: "She obeys every command. Completely yours." },
  { value: 'sub', emoji: '🔥', title: "SHE DOMINATES", sub: "She takes total control. You belong to her." },
  { value: 'both', emoji: '⚡', title: "BOTH GO WILD", sub: "No rules. Pure filth. Equal chaos." },
];

export default function Step2({ onNext, onBack }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <ProgressPills current={2} total={4} theme="purple" />

      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-2 tracking-tight">
        WHO&apos;S IN CONTROL?
      </h1>
      <p className="text-gray-400 text-center text-sm mb-6">
        Set the power dynamic. She&apos;ll act accordingly.
      </p>

      <div className="flex flex-col gap-3 w-full mb-8">
        {OPTIONS.map(({ value, emoji, title, sub }) => {
          const selected = state.control === value;
          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.98 }}
              onClick={() => update({ control: value })}
              className={`flex items-center gap-4 rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer w-full text-left ${
                selected
                  ? 'border-[#A020F0] bg-[#1a1a2e]'
                  : 'border-gray-700 bg-[#1a1a2e] hover:border-gray-500'
              }`}
            >
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div className="flex-1">
                <div className="text-white text-base font-black uppercase tracking-wide">{title}</div>
                <div className="text-gray-400 text-xs mt-1">{sub}</div>
              </div>
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  selected ? 'bg-[#A020F0] border-[#C050FF]' : 'border-gray-600 bg-transparent'
                }`}
              >
                {selected && <span className="text-white text-xs font-bold">&#10003;</span>}
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!state.control}
        className="btn-purple w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl disabled:opacity-40 disabled:cursor-not-allowed mb-3"
      >
        NEXT &#x2192;
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
