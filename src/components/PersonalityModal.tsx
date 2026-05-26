'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalityModalProps {
  field: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}

export default function PersonalityModal({
  field,
  options,
  value,
  onChange,
  onClose,
}: PersonalityModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70"
          onClick={onClose}
        />
        {/* Panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#1a1a2e] rounded-t-2xl p-6 pb-8 z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold">Choose {field}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  onClose();
                }}
                className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  value === opt
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#0D0D0D] text-gray-300 hover:bg-white/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
