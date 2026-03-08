'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const supabase = supabaseBrowser();
    const siteUrl = (typeof window !== 'undefined' && window.location.origin) || '';
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${siteUrl}/login`,
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-white/90">Am trimis un link de resetare parolă la adresa indicată.</p>
          <p className="text-sm text-white/60 mt-2">Verifică emailul (inclusiv spam).</p>
          <Link href="/login" className="mt-4 inline-block text-sm underline text-white/80 hover:text-white">
            Înapoi la autentificare
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Ai uitat parola?</h1>
        <p className="text-sm opacity-80 mt-1">Introdu emailul contului și îți trimitem un link pentru resetare.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-medium py-3 disabled:opacity-60"
          >
            {loading ? 'Se trimite...' : 'Trimite link resetare'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm opacity-80">
          <Link href="/login" className="underline hover:opacity-100">
            Înapoi la autentificare
          </Link>
        </p>
      </div>
    </div>
  );
}
