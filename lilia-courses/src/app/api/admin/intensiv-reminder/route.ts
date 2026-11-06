import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { INTENSIV } from '@/lib/intensiv';
import { sendReminder } from '@/lib/intensivReminder';

export const maxDuration = 60;

const BATCH = 5;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * POST /api/admin/intensiv-reminder — doar administratori.
 * { mode: 'test' }               → trimite reminderul doar adminului logat.
 * { mode: 'all', offset: number } → trimite următorii 5 participanți plătiți;
 *                                   pagina cheamă din nou cu `next` până la final.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  if (body.mode === 'test') {
    const to = admin.user?.email;
    if (!to) return NextResponse.json({ error: 'Adminul nu are email' }, { status: 400 });
    const r = await sendReminder(to);
    return NextResponse.json({ to, ...r });
  }

  if (body.mode !== 'all') return NextResponse.json({ error: 'mode invalid' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('customer_email, created_at')
    .eq('product_id', INTENSIV.productId)
    .eq('status', 'paid')
    .order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const emails = [
    ...new Set((data ?? []).map((o) => (o.customer_email || '').trim().toLowerCase()).filter(Boolean)),
  ];
  const offset = Math.max(0, Number(body.offset) || 0);
  const slice = emails.slice(offset, offset + BATCH);

  const failed: { email: string; error?: string }[] = [];
  for (const email of slice) {
    const r = await sendReminder(email);
    if (!r.ok) failed.push({ email, error: r.error });
    await sleep(600); // sub limita Resend de ~2 emailuri/secundă
  }
  console.log('INTENSIV_REMINDER_BATCH', { offset, sent: slice.length - failed.length, failed: failed.length });

  const next = offset + slice.length;
  return NextResponse.json({ total: emails.length, sent: slice.length - failed.length, failed, next, done: next >= emails.length });
}
