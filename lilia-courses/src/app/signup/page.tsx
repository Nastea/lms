import Link from "next/link";

/**
 * /signup — Account creation is only via invite link (sent after payment).
 * No open signup form; reduces friction and keeps access tied to purchase.
 */
export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-xl font-semibold">Creează cont</h1>
        <p className="mt-3 text-sm opacity-90">
          Contul se creează doar după ce achiziționezi cursul. După plată, primești un email cu un link pentru a-ți seta parola și a accesa cursul.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/inscriere"
            className="rounded-xl bg-white text-black font-medium py-3 px-6 hover:opacity-90 transition"
          >
            Cumpără cursul
          </Link>
          <Link
            href="/login"
            className="text-sm opacity-80 hover:opacity-100 underline"
          >
            Ai deja cont? Autentifică-te
          </Link>
          <Link
            href="/curs/lectia-0"
            className="text-sm opacity-70 hover:opacity-100"
          >
            Lecția gratuită (fără cont)
          </Link>
        </div>
      </div>
    </div>
  );
}
