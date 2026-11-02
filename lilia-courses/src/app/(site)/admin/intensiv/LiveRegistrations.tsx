'use client';

import { useCallback, useEffect, useState } from 'react';

type Order = {
  id: string;
  created_at: string;
  paid_at: string | null;
  amount: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  invite_sent_at: string | null;
};

type Data = { paid: Order[]; pendingCount: number; revenue: number };

const REFRESH_MS = 10_000;

function when(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ro-RO', {
    timeZone: 'Europe/Chisinau',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Lista înscrierilor la intensiv, actualizată singură la fiecare 10 secunde. */
export default function LiveRegistrations() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/intensiv-orders', { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status === 401 ? 'Nu ai acces. Intră în cont ca administrator.' : `Eroare ${res.status}`);
      setData(await res.json());
      setError(null);
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcare');
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const refresh = setInterval(load, REFRESH_MS);
    const clock = setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(refresh);
      clearInterval(clock);
    };
  }, [load]);

  const ago = updatedAt ? Math.max(0, Math.round((Date.now() - updatedAt.getTime()) / 1000)) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Înscrieri: Am un plan pentru viața mea</h1>
          <p className="text-sm opacity-60 mt-1">
            Se actualizează singur la fiecare 10 secunde
            {ago !== null && ` · ultima actualizare acum ${ago} s`}
          </p>
        </div>
        <a
          href="/api/admin/intensiv-orders?format=csv"
          className="rounded-xl bg-white text-black px-4 py-2 font-medium"
        >
          Descarcă Excel (CSV)
        </a>
      </div>

      {error && <p className="rounded-xl bg-red-500/15 text-red-300 p-4">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/5 p-5">
              <p className="text-sm opacity-60">Înscriși (plătit)</p>
              <p className="text-4xl font-semibold mt-1">{data.paid.length}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <p className="text-sm opacity-60">Încasat</p>
              <p className="text-4xl font-semibold mt-1">{data.revenue.toLocaleString('ro-RO')} lei</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <p className="text-sm opacity-60">Au început plata, dar n-au finalizat</p>
              <p className="text-4xl font-semibold mt-1">{data.pendingCount}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl bg-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left opacity-60">
                  <th className="p-3 font-medium">Plătit la</th>
                  <th className="p-3 font-medium">Nume</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Telefon</th>
                  <th className="p-3 font-medium">Email trimis</th>
                </tr>
              </thead>
              <tbody>
                {data.paid.length === 0 && (
                  <tr>
                    <td className="p-3 opacity-60" colSpan={5}>Încă nu sunt înscrieri.</td>
                  </tr>
                )}
                {data.paid.map((o) => (
                  <tr key={o.id} className="border-t border-white/10">
                    <td className="p-3 whitespace-nowrap">{when(o.paid_at)}</td>
                    <td className="p-3">{o.customer_name || '—'}</td>
                    <td className="p-3">{o.customer_email || '—'}</td>
                    <td className="p-3 whitespace-nowrap">{o.customer_phone || '—'}</td>
                    <td className="p-3">{o.invite_sent_at ? 'da' : 'nu'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
