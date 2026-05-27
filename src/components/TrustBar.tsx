'use client';
import { useEffect, useState } from 'react';

export default function TrustBar() {
  const [seconds, setSeconds] = useState(30 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="w-full bg-[#1a1a2e] border-b border-[#A020F0]/30 px-4 py-2.5 flex items-center justify-center gap-4 text-sm sticky top-0 z-50">
      <div className="text-yellow-400 font-medium hidden sm:flex items-center gap-1">
        &#9733;&#9733;&#9733;&#9733;&#9733;{' '}
        <span className="text-white">4.8 &middot; 50M+ Users &middot; #1 AI Companion App</span>
      </div>
      <div className="text-gray-600 hidden sm:block">&middot;</div>
      <div className="text-white font-semibold text-center">
        &#128293; First Month 70% OFF &mdash; Ends in{' '}
        <span className="text-pink-400">
          {mm}:{ss}
        </span>
      </div>
    </div>
  );
}
