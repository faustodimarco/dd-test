'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_D, FunnelDState } from '@/lib/types';
import { ETHNICITY_IMAGES } from '@/lib/assets';
import { getAutoName } from '@/lib/names';
import ProgressPills from '@/components/ProgressPills';

// Countdown
const COUNTDOWN_SECONDS = 10 * 60; // 10 min
function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// Messages that change based on the kinks picked
const MESSAGES_DOM = "Hey... I've been thinking about you 😈 I know you're going to dominate me — and I'm already trembling for you. Just unlock me and I'm yours.";
const MESSAGES_SUB = "I've been waiting for someone to take charge of me... You seem exactly like what I need. Unlock me and I'll show you who's really in control 😈";
const MESSAGES_BOTH = "No rules between us... just pure, unfiltered chaos. I've been fantasising about you. Unlock me — I dare you 🔥";

function getPreviewMessage(control: string): string {
  if (control === 'dom') return MESSAGES_DOM;
  if (control === 'sub') return MESSAGES_SUB;
  return MESSAGES_BOTH;
}

// Control dynamic label
const CONTROL_LABELS: Record<string, string> = {
  dom: 'You Dominate',
  sub: 'She Dominates',
  both: 'Both Wild',
};

export default function Step4() {
  const { state, hydrated } = useFunnelState<FunnelDState>('funnel_d', DEFAULT_FUNNEL_D);
  const [name, setName] = useState('');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!name) {
      setName(getAutoName(state.ethnicity));
    }
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hydrated) return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [hydrated]);

  if (!hydrated) return null;

  const ethKey = state.ethnicity || 'white';
  const avatarSrc = ETHNICITY_IMAGES[ethKey as keyof typeof ETHNICITY_IMAGES] ?? ETHNICITY_IMAGES.white;
  const firstName = name.split(' ')[0] || 'Her';
  const message = getPreviewMessage(state.control);
  const dynamicLabel = CONTROL_LABELS[state.control] ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <ProgressPills current={4} total={4} theme="purple" />

      {/* Urgency bar */}
      <div className="w-full bg-purple-900/30 border border-purple-700/40 rounded-xl px-4 py-2 text-center text-xs text-purple-300 mb-5">
        🔥 <strong>1,847 people</strong> just created their AI companion — your match is ready
      </div>

      {/* Avatar */}
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-500 ring-offset-2 ring-offset-[#0D0D0D]">
          <Image src={avatarSrc} alt={name} width={96} height={96} className="object-cover w-full h-full" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0D0D0D]" />
      </div>

      <h2 className="text-white text-xl font-black mb-1">{name}</h2>
      <p className="text-gray-400 text-xs mb-5">
        Your perfect match{dynamicLabel ? ` · ${dynamicLabel}` : ''}
        {state.kinks.length > 0 && ` · ${state.kinks.slice(0, 2).join(', ')}${state.kinks.length > 2 ? '...' : ''}`}
      </p>

      {/* Blurred message preview */}
      <div className="w-full bg-[#1a1a2e] border border-gray-800 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            <Image src={avatarSrc} alt={firstName} width={28} height={28} className="object-cover w-full h-full" />
          </div>
          <span className="text-gray-400 text-xs">{firstName} · just now</span>
          <span className="ml-auto bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">● ONLINE</span>
        </div>
        {/* Blurred message */}
        <div className="relative">
          <div className="bg-[#0f172a] rounded-xl px-3 py-2.5 text-gray-200 text-sm leading-relaxed select-none blur-[5px]">
            {message}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-purple-400 text-xs font-bold">🔒 Sign up free to read her message</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="w-full text-center text-xs text-pink-400 font-bold mb-4">
        🔥 First Month 70% OFF — Ends in {formatTime(countdown)}
      </div>

      {/* Primary CTA */}
      <button
        className="btn-purple w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl mb-3"
        style={{ animation: 'pulse-purple 2s ease-in-out infinite' }}
      >
        {`UNLOCK ${firstName.toUpperCase()} NOW — FREE →`}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full mb-3">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-xs">— or —</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      {/* Google */}
      <button className="w-full py-3.5 bg-[#1f2937] hover:bg-[#253040] border border-gray-700 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-colors mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-gray-600 text-[10px]">
        🔒 100% Private · No credit card required · Cancel anytime
      </p>
    </motion.div>
  );
}
