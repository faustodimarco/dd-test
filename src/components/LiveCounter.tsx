'use client';
import { useEffect, useState, useRef } from 'react';

export default function LiveCounter() {
  const [count, setCount] = useState<number>(0);
  const idRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Initialise with random value on client only to avoid hydration mismatch
    setCount(Math.floor(Math.random() * 201) + 1200);

    const tick = () => {
      const delay = Math.random() * 4000 + 8000;
      idRef.current = setTimeout(() => {
        setCount((c) => c + Math.floor(Math.random() * 41) - 20);
        tick();
      }, delay);
    };

    tick();
    return () => {
      if (idRef.current) clearTimeout(idRef.current);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 text-white text-xs font-medium shadow-lg">
      &#9889;{' '}
      <span className="font-bold">{count.toLocaleString()}</span> people building right now
    </div>
  );
}
