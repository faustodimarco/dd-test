'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StepLayout from '@/components/StepLayout';
import TrustBar from '@/components/TrustBar';
import LiveCounter from '@/components/LiveCounter';
import Step1 from './_components/Step1';
import Step2 from './_components/Step2';
import Step3 from './_components/Step3';
import Step4 from './_components/Step4';

function IgniteFunnelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') ?? '1');

  const goTo = (n: number) => router.push(`/lp/ignite?step=${n}`);

  return (
    <StepLayout theme="purple">
      <TrustBar />
      {step === 1 && <Step1 onNext={() => goTo(2)} />}
      {step === 2 && <Step2 onNext={() => goTo(3)} onBack={() => goTo(1)} />}
      {step === 3 && <Step3 onNext={() => goTo(4)} onBack={() => goTo(2)} />}
      {step === 4 && <Step4 />}
      <LiveCounter />
    </StepLayout>
  );
}

export default function IgnitePage() {
  return (
    <Suspense>
      <IgniteFunnelContent />
    </Suspense>
  );
}
