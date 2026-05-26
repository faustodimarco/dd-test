'use client';

import { useState, useEffect, useCallback } from 'react';

export function useFunnelState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setState({ ...initial, ...(JSON.parse(stored) as Partial<T>) });
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback((updates: Partial<T>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [key]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setState(initial);
  }, [key, initial]);

  return { state, update, clear, hydrated };
}
