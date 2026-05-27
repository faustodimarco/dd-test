'use client';

interface StepLayoutProps {
  children: React.ReactNode;
  theme?: 'pink' | 'purple'; // reserved for future use; child components receive theme directly
  header?: React.ReactNode;  // full-width slot rendered above the content container
}

export default function StepLayout({ children, header }: StepLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {header}
      <div className={`max-w-3xl mx-auto px-4 ${header ? 'pt-6 pb-8' : 'py-8'}`}>
        {children}
      </div>
    </div>
  );
}
