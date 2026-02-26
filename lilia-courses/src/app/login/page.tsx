"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

function parseHashParams(hash: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!hash || !hash.startsWith("#")) return params;
  const q = hash.slice(1);
  q.split("&").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const k = decodeURIComponent(pair.slice(0, idx));
    const v = decodeURIComponent(pair.slice(idx + 1));
    if (k && v) params[k] = v;
  });
  return params;
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [handlingInvite, setHandlingInvite] = useState(false);

  // Handle auth redirect: invite tokens or error (expired/invalid link)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = parseHashParams(window.location.hash);
    const error = params.error || params["error"];
    const errorCode = params.error_code || params["error_code"];
    if (error === "access_denied" || errorCode === "otp_expired") {
      setErr("Link invalid sau expirat. Te poți autentifica cu email și parolă dacă ai deja cont.");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    const access_token = params.access_token || params["access_token"];
    const refresh_token = params.refresh_token || params["refresh_token"];
    if (!access_token || !refresh_token) return;

    let cancelled = false;
    setHandlingInvite(true);

    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      setErr("Link expirat sau eroare la confirmare. Autentifică-te cu email și parolă.");
      setHandlingInvite(false);
    }, 12000);

    const supabase = supabaseBrowser();
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ data, error }) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        if (error) {
          setErr(error.message || "Link invalid sau expirat.");
          setHandlingInvite(false);
          return;
        }
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        router.push(next);
        router.refresh();
      })
      .catch((e) => {
        if (!cancelled) {
          clearTimeout(timeoutId);
          setErr(e?.message || "Link invalid sau expirat.");
          setHandlingInvite(false);
        }
      });
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [router, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) return setErr(error.message);

    router.push(next);
    router.refresh();
  }

  if (handlingInvite) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-white/80">Se confirmă invitația...</p>
        <button
          type="button"
          onClick={() => {
            setHandlingInvite(false);
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }}
          className="text-sm text-white/60 hover:text-white underline"
        >
          Autentifică-te cu parolă
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Autentificare</h1>
        <p className="text-sm opacity-80 mt-1">Accesează cursurile tale.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-medium py-3 disabled:opacity-60"
          >
            {loading ? "Se conectează..." : "Conectează-te"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm opacity-80">
          Nu ai cont?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="underline hover:opacity-100">
            Creează cont
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă...</div>}>
      <LoginForm />
    </Suspense>
  );
}

