import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { INTENSIV } from '@/lib/intensiv';

/**
 * GET /api/admin/intensiv-orders[?format=csv]
 *
 * Înscrierile la intensiv, doar pentru administratori. Comenzile de test sunt mutate
 * pe product_id `intensiv_plan_test`, deci nu apar. JSON pentru pagina live
 * /admin/intensiv, CSV pentru Excel.
 */
export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, created_at, paid_at, status, amount, customer_name, customer_email, customer_phone, invite_sent_at')
    .eq('product_id', INTENSIV.productId)
    .in('status', ['paid', 'pending'])
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const paid = (data ?? []).filter((o) => o.status === 'paid');
  const pending = (data ?? []).filter((o) => o.status === 'pending');

  if (new URL(req.url).searchParams.get('format') === 'csv') {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Data platii', 'Nume', 'Email', 'Telefon', 'Suma (lei)', 'Email trimis'],
      ...paid.map((o) => [
        o.paid_at ? new Date(o.paid_at).toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau' }) : '',
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.amount,
        o.invite_sent_at ? 'da' : 'nu',
      ]),
    ];
    const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="inscrieri-intensiv.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }

  return NextResponse.json(
    {
      paid,
      pendingCount: pending.length,
      revenue: paid.reduce((sum, o) => sum + Number(o.amount || 0), 0),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
