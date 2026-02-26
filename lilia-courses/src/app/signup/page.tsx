"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const supabase = supabaseBrowser();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { phone: phone.trim() || undefined },
      },
    });

    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }

    // If Supabase doesn't require email confirmation, we have a session and can redirect
    if (data.session) {
      router.push(next);
      router.refresh();
      return;
    }

    // Email confirmation required: show message and link to login
    setErr(null);
    setShowConfirmMessage(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Creează cont</h1>
        <p className="text-sm opacity-80 mt-1">
          O singură dată: email, telefon, parolă. Apoi poți accesa lecția gratuită.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
          />
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            autoComplete="tel"
          />
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-medium py-3 disabled:opacity-60"
          >
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>

        {showConfirmMessage ? (
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-400/20 text-sm text-green-200">
            Verifică emailul pentru a confirma contul. După confirmare,{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="underline font-medium">
              autentifică-te aici
            </Link>.
          </div>
        ) : (
          <p className="mt-4 text-center text-sm opacity-80">
            Ai deja cont?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="underline hover:opacity-100">
              Autentifică-te
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă...</div>}>
      <SignupForm />
    </Suspense>
  );
}
