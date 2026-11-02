'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Plata2CheckoutView from '@/components/Plata2CheckoutView';

export default function Plata2Gate({ initialUnlocked }: { initialUnlocked: boolean }) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const serif = { fontFamily: 'var(--font-heading), Georgia, serif' };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const res = await fetch('/api/plata2/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(typeof json.error === 'string' ? json.error : 'Parolă incorectă');
      return;
    }
    setUnlocked(true);
    router.refresh();
  };

  if (unlocked) {
    return <Plata2CheckoutView />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-[#2A1F18]" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="w-full max-w-[400px] rounded-xl border bg-white p-8 shadow-[0_4px_32px_rgba(61,43,31,0.08)]" style={{ borderColor: '#DDD4C4' }}>
        <h1 className="mb-2 text-center text-xl font-medium text-[#3D2B1F]" style={serif}>
          Acces la plată
        </h1>
        <p className="mb-6 text-center text-sm text-[#6B5245]">Introdu parola pentru a continua către pagina de plată (1 MDL).</p>
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label htmlFor="plata2-pw" className="mb-1.5 block text-xs font-medium text-[#6B5245]">
              Parolă
            </label>
            <input
              id="plata2-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-[#E56B6F]"
              style={{ borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full rounded-lg py-3 text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: '#E56B6F' }}
          >
            {loading ? 'Se verifică...' : 'Continuă'}
          </button>
        </form>
      </div>
    </div>
  );
}
