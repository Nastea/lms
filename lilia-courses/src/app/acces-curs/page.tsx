"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

const brand = {
  bg: "linear-gradient(to bottom, #f5ede3, #ebdfce)",
  text: "#1F2933",
  textMuted: "#6B7280",
  ctaGradient: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
  ctaShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
  cardBg: "#FFFFFF",
  cardBorder: "1px solid rgba(0, 0, 0, 0.05)",
  cardShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  inputBg: "#faf8f5",
  inputBorder: "#e5d9c8",
  accent: "#E56B6F",
};

function AccesCursForm() {
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

    if (data.session) {
      router.push(next);
      router.refresh();
      return;
    }

    setErr(null);
    setShowConfirmMessage(true);
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden py-12 md:py-20" style={{ background: brand.bg }}>
      <div className="mx-auto px-4 sm:px-6 max-w-lg w-full">
        {/* Back to landing */}
        <p className="text-center mb-6">
          <Link
            href="/conflicte"
            className="text-sm font-medium hover:underline"
            style={{ color: brand.textMuted }}
          >
            ← Înapoi la prezentarea cursului
          </Link>
        </p>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor: brand.cardBg,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.accent }} />
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: brand.text }}>
              Lecția 1 gratuită
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-2xl md:text-3xl font-bold text-center uppercase mb-2"
          style={{ color: brand.text, letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          RELAȚIA 360
        </h1>
        <p className="text-center text-lg font-semibold mb-2" style={{ color: brand.text }}>
          De la conflict la conectare
        </p>
        <p className="text-center mb-8" style={{ color: brand.textMuted }}>
          Creează cont și accesează imediat prima lecție, gratuit.
        </p>

        {/* Card + form */}
        <div
          className="rounded-2xl p-6 md:p-8 shadow-lg"
          style={{
            backgroundColor: brand.cardBg,
            border: brand.cardBorder,
            boxShadow: brand.cardShadow,
          }}
        >
          <p className="text-sm mb-6" style={{ color: brand.text }}>
            Completează doar aceste câmpuri — nu te mai întrebăm nimic altceva.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-black placeholder:opacity-70"
                style={{ borderColor: brand.inputBorder, backgroundColor: brand.inputBg }}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Telefon (opțional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-black placeholder:opacity-70"
                style={{ borderColor: brand.inputBorder, backgroundColor: brand.inputBg }}
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Parolă
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                placeholder="Parolă (min. 6 caractere) *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-black placeholder:opacity-70"
                style={{ borderColor: brand.inputBorder, backgroundColor: brand.inputBg }}
                autoComplete="new-password"
              />
            </div>

            {err && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg text-base font-semibold uppercase tracking-wide text-white transition-all hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: brand.ctaGradient,
                boxShadow: brand.ctaShadow,
              }}
            >
              {loading ? "Se creează contul..." : "Creează cont și accesează lecția 1"}
            </button>
          </form>

          {showConfirmMessage && (
            <div
              className="mt-4 p-4 rounded-lg text-sm"
              style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
            >
              Verifică emailul pentru a confirma contul. După confirmare,{" "}
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="underline font-medium">
                autentifică-te aici
              </Link>.
            </div>
          )}

          <p className="mt-5 text-center text-sm" style={{ color: brand.textMuted }}>
            Ai deja cont?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="font-medium underline"
              style={{ color: brand.text }}
            >
              Autentifică-te
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: brand.textMuted }}>
          După ce îți creezi contul, vei putea viziona prima lecție imediat. Restul cursului este disponibil după plată.
        </p>
      </div>
    </div>
  );
}

export default function AccesCursPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: brand.bg }}>
          <span style={{ color: brand.textMuted }}>Se încarcă...</span>
        </div>
      }
    >
      <AccesCursForm />
    </Suspense>
  );
}
