import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/** GET /api/admin/intensiv-feedback[?format=csv] — răspunsurile la feedback, doar administratori. */
export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('intensiv_feedback')
    .select('created_at, name, email, usefulness, takeaway, improve, topics, bonus_sent_at')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = data ?? [];

  if (new URL(req.url).searchParams.get('format') === 'csv') {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      ['Data', 'Nume', 'Email', 'Cat de util (1-10)', 'Ce i-a placut / folosit', 'Ce putem face mai bine', 'Teme pentru workshopuri', 'Bonus trimis'],
      ...rows.map((r) => [
        new Date(r.created_at).toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau' }),
        r.name,
        r.email,
        r.usefulness,
        r.takeaway,
        r.improve,
        r.topics,
        r.bonus_sent_at ? 'da' : 'nu',
      ]),
    ];
    return new Response('﻿' + lines.map((l) => l.map(esc).join(',')).join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="feedback-intensiv.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }

  const scores = rows.map((r) => r.usefulness).filter((n): n is number => typeof n === 'number');
  const average = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null;
  return NextResponse.json({ rows, average }, { headers: { 'Cache-Control': 'no-store' } });
}
