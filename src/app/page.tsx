import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8" style={{ background: '#0D0D0D' }}>
      <h1 className="text-3xl font-black text-white">dondi.ai Funnels</h1>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/lp/swift" className="block text-center py-4 px-8 rounded-full font-bold text-white text-lg" style={{ background: '#EC4899' }}>
          Funnel C — Swift (3 steps)
        </Link>
        <Link href="/lp/ignite" className="block text-center py-4 px-8 rounded-full font-bold text-white text-lg" style={{ background: '#8B5CF6' }}>
          Funnel D — Ignite (6 steps)
        </Link>
      </div>
    </main>
  );
}
