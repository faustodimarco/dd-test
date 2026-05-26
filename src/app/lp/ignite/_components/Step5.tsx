'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { getAutoName } from '@/lib/names';
import ProgressPills from '@/components/ProgressPills';
import PersonalityModal from '@/components/PersonalityModal';

interface Props { onNext: () => void; onBack: () => void }

const PERSONALITY_OPTIONS: Record<string, string[]> = {
  Voice: ['Avery', 'Emma', 'Sophia', 'Aria', 'Luna'],
  Personality: ['Shy', 'Bold', 'Playful', 'Dominant', 'Submissive', 'Intellectual', 'Romantic'],
  Occupation: ['Stripper', 'Nurse', 'Student', 'Teacher', 'Model', 'CEO', 'Maid'],
  Relationship: ['Crush', 'Girlfriend', 'Friend', 'Dominant', 'Submissive', 'Wife'],
  Hobby: ['Yoga', 'Gaming', 'Reading', 'Cooking', 'Dancing', 'Fitness'],
  Fetish: ['BDSM', 'Roleplay', 'Cosplay', 'Public', 'Voyeur', 'Feet', 'Lingerie'],
};

const TRAIT_EMOJIS: Record<string, string> = {
  Voice: '🎙️',
  Personality: '💫',
  Occupation: '💼',
  Relationship: '❤️',
  Hobby: '🎯',
  Fetish: '🔥',
};

const FIELD_TO_KEY: Record<string, keyof FunnelDState> = {
  Voice: 'voice',
  Personality: 'personality',
  Occupation: 'occupation',
  Relationship: 'relationship',
  Hobby: 'hobby',
  Fetish: 'fetish',
};

export default function Step5({ onNext, onBack }: Props) {
  const { state, update, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && !state.name) {
      update({ name: getAutoName(state.ethnicity) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  const traitFields = Object.keys(PERSONALITY_OPTIONS);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col lg:flex-row gap-6"
    >
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ProgressPills current={5} total={6} theme="purple" />

        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-6 tracking-tight">
          MAKE HER YOURS
        </h1>

        {/* Name input */}
        <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Her Name</p>
        <input
          type="text"
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Enter her name..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-6"
        />

        {/* Age picker */}
        <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Age</p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => update({ age: Math.max(18, state.age - 1) })}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center"
            aria-label="Decrease age"
          >
            &#8722;
          </button>
          <span className="text-4xl font-black text-white w-16 text-center">{state.age}</span>
          <button
            onClick={() => update({ age: Math.min(40, state.age + 1) })}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center"
            aria-label="Increase age"
          >
            &#43;
          </button>
        </div>

        {/* Personality grid */}
        <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3">Personality</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {traitFields.map((field) => {
            const stateKey = FIELD_TO_KEY[field];
            const currentValue = (state as unknown as Record<string, string>)[stateKey] ?? '';
            return (
              <button
                key={field}
                onClick={() => setActiveModal(field)}
                className="bg-[#1a1a2e] border border-purple-900/40 rounded-xl p-3 flex flex-col items-center gap-1 hover:border-purple-500/60 hover:bg-purple-900/20 transition-all duration-200"
              >
                <span className="text-2xl">{TRAIT_EMOJIS[field]}</span>
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wide">{field}</span>
                <span className="text-purple-300 text-sm font-semibold truncate max-w-full px-1">
                  {currentValue || 'Choose...'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={onBack}
            className="flex-1 py-4 text-white border border-white/20 rounded-xl font-bold uppercase tracking-wide hover:bg-white/5 transition-colors"
          >
            &#x2190; Back
          </button>
          <button
            onClick={onNext}
            className="flex-[3] btn-purple py-4 text-lg font-black uppercase tracking-wide rounded-xl"
          >
            FINISH HER &#x2192;
          </button>
        </div>
      </div>

      {/* Live preview card */}
      <aside className="lg:w-72 w-full">
        <div className="bg-[#1a1a2e] rounded-2xl p-4 border border-purple-900/30 lg:sticky lg:top-4">
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto mb-3" />

          {/* Name + age */}
          <p className="text-white text-xl font-black text-center mb-0.5">
            {state.name || 'Your Companion'}
          </p>
          <p className="text-gray-400 text-sm text-center mb-3">
            Age {state.age}
          </p>

          {/* Trait chips */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {[state.style, state.ethnicity, state.personality, state.relationship]
              .filter(Boolean)
              .map((chip, i) => (
                <span
                  key={i}
                  className="bg-purple-900/40 text-purple-300 text-xs px-2 py-0.5 rounded-full capitalize"
                >
                  {chip}
                </span>
              ))}
          </div>

          {/* Progress bar */}
          <div>
            <p className="text-white text-xs font-semibold mb-1">She&apos;s 80% ready 🔥</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full w-4/5" />
            </div>
          </div>
        </div>
      </aside>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <PersonalityModal
            field={activeModal}
            options={PERSONALITY_OPTIONS[activeModal]}
            value={(state as unknown as Record<string, string>)[FIELD_TO_KEY[activeModal]] ?? ''}
            onChange={(v) => {
              update({ [FIELD_TO_KEY[activeModal]]: v } as Partial<FunnelDState>);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
