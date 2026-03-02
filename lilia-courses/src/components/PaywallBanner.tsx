"use client";

import Link from "next/link";

type Props = {
  courseTitle: string;
  /** Optional: link to payment page (e.g. /plata) */
  paymentUrl?: string;
};

export default function PaywallBanner({ courseTitle, paymentUrl = "/inscriere" }: Props) {
  return (
    <div className="rounded-2xl border-2 border-amber-400/30 bg-amber-500/10 p-8 text-center space-y-4">
      <h2 className="text-xl font-semibold text-amber-200">
        Acces restricționat
      </h2>
      <p className="text-white/80 max-w-md mx-auto">
        Conținutul acestui curs (<strong>{courseTitle}</strong>) este disponibil după achiziție. Achiziționează cursul pentru a accesa toate lecțiile.
      </p>
      <div className="pt-2">
        <Link
          href={paymentUrl}
          className="inline-flex items-center justify-center rounded-xl bg-amber-400 text-black font-semibold px-6 py-3 hover:bg-amber-300 transition-colors"
        >
          Finalizează plata pentru acces complet
        </Link>
      </div>
      <p className="text-sm text-white/50">
        După plată, accesul se activează automat. Dacă ai plătit deja, reîncarcă pagina sau revino la cursuri.
      </p>
    </div>
  );
}
