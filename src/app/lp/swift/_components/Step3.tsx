'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useFunnelState } from '@/lib/useFunnelState';
import { DEFAULT_FUNNEL_C, FunnelCState } from '@/lib/types';
import { STYLE_IMAGES } from '@/lib/assets';
import { getAutoName } from '@/lib/names';

export default function Step3() {
  const { state, update, hydrated } = useFunnelState<FunnelCState>('funnel_c', DEFAULT_FUNNEL_C);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (hydrated && !state.name) {
      update({ name: getAutoName(state.ethnicity) });
    }
  }, [hydrated]); // runs once after localStorage is loaded

  const bgImage = STYLE_IMAGES[state.style as keyof typeof STYLE_IMAGES] ?? STYLE_IMAGES.realistic;
  const characterName = state.name || getAutoName(state.ethnicity);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background: blurred CDN image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="character"
          fill
          className="object-cover"
          style={{ filter: 'blur(12px) brightness(0.3)', transform: 'scale(1.1)' }}
          unoptimized
        />
      </div>

      {/* Frosted overlay card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white text-center mb-3 tracking-tight">
            SHE IS READY TO BE FUCKED
          </h1>
          <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
            <span className="text-pink-400 font-bold">{characterName}</span> is waiting for you.{' '}
            Create your free account to unlock her.
          </p>

          {/* Google Sign Up */}
          <button
            onClick={() => {}}
            className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors mb-4"
          >
            {/* Google SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Sign Up With Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-gray-400 text-sm">— or —</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 mb-3"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 mb-4"
          />

          {/* CTA */}
          <button
            onClick={() => {}}
            className="btn-pink w-full py-4 text-lg font-black uppercase tracking-wide rounded-xl mb-4"
          >
            CREATE ACCOUNT &#x2192;
          </button>

          {/* Fine print */}
          <p className="text-gray-500 text-xs text-center mb-3">
            By signing up, you agree to our{' '}
            <span className="text-gray-400 underline cursor-pointer">Terms of Service</span>{' '}
            &amp;{' '}
            <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>
          </p>
          <p className="text-gray-400 text-xs text-center">
            Already have an account?{' '}
            <span className="text-pink-400 font-semibold cursor-pointer">Log in &gt;</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
