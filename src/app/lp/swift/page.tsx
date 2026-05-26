'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import StepLayout from '@/components/StepLayout';
import Step1 from './_components/Step1';
import Step2 from './_components/Step2';
import Step3 from './_components/Step3';

function SwiftFunnelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') ?? '1');

  const goTo = (n: number) => router.push(`/lp/swift?step=${n}`);

  return (
    <StepLayout theme="pink">
      {step === 1 && <Step1 onNext={() => goTo(2)} />}
      {step === 2 && <Step2 onNext={() => goTo(3)} onBack={() => goTo(1)} />}
      {step === 3 && <Step3 />}
    </StepLayout>
  );
}

export default function SwiftPage() {
  return (
    <Suspense>
      <SwiftFunnelContent />
    </Suspense>
  );
}
