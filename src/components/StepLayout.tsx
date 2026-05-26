'use client';

interface StepLayoutProps {
  children: React.ReactNode;
  theme: 'pink' | 'purple';
  showTrustBar?: boolean;
}

export default function StepLayout({ children }: StepLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
