import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { INTENSIV } from '@/lib/intensiv';

/**
 * Participanți fără comandă plătită pe site (adăugați manual), care primesc totuși
 * emailurile de după intensiv și pot completa feedbackul.
 */
export const EXTRA_PARTICIPANTS = ['jizdancarolina@gmail.com'];

/** Toate adresele participanților: comenzile plătite + EXTRA_PARTICIPANTS, fără dubluri, în ordine stabilă. */
export async function participantEmails(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('customer_email, created_at')
    .eq('product_id', INTENSIV.productId)
    .eq('status', 'paid')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return [
    ...new Set(
      [...(data ?? []).map((o) => o.customer_email || ''), ...EXTRA_PARTICIPANTS]
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

type Send = (to: string) => Promise<{ ok: boolean; error?: string }>;
const BATCH = 5;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Logica comună a butoanelor din /admin/intensiv (doar administratori):
 * { mode: 'test' } → doar adminului logat; { mode: 'all', offset } → următorii 5 participanți.
 * Cheile de idempotență din `send` împiedică dublurile la reapăsare.
 */
export async function bulkSendRoute(req: Request, send: Send, logLabel: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));

  if (body.mode === 'test') {
    const to = admin.user?.email;
    if (!to) return NextResponse.json({ error: 'Adminul nu are email' }, { status: 400 });
    return NextResponse.json({ to, ...(await send(to)) });
  }
  if (body.mode !== 'all') return NextResponse.json({ error: 'mode invalid' }, { status: 400 });

  let emails: string[];
  try {
    emails = await participantEmails();
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
  const offset = Math.max(0, Number(body.offset) || 0);
  const slice = emails.slice(offset, offset + BATCH);

  const failed: { email: string; error?: string }[] = [];
  for (const email of slice) {
    const r = await send(email);
    if (!r.ok) failed.push({ email, error: r.error });
    await sleep(600); // sub limita Resend de ~2 emailuri/secundă
  }
  console.log(logLabel, { offset, sent: slice.length - failed.length, failed: failed.length });

  const next = offset + slice.length;
  return NextResponse.json({ total: emails.length, sent: slice.length - failed.length, failed, next, done: next >= emails.length });
}
