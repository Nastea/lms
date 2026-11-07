import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { INTENSIV } from '@/lib/intensiv';
import { bonusToken, sendBonus } from '@/lib/intensivFeedback';
import { requireAdmin } from '@/lib/admin';

const MAX = 4000;
const clean = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, MAX) : '');

/**
 * POST /api/intensiv/feedback — public.
 * { email, usefulness (1–10), takeaway, improve, topics }
 * Salvează răspunsul (unul per email; a doua oară îl actualizează) și, doar pentru
 * participanții plătiți, trimite o singură dată caietul bonus pe email.
 * Un administrator logat poate testa cu orice email (rândul e salvat cu numele „TEST admin”).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = clean(body.email).toLowerCase();
  const usefulness = Number(body.usefulness);
  const takeaway = clean(body.takeaway);
  const improve = clean(body.improve);
  const topics = clean(body.topics);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Scrie o adresă de email validă.' }, { status: 400 });
  }
  if (!Number.isInteger(usefulness) || usefulness < 1 || usefulness > 10 || !takeaway || !improve || !topics) {
    return NextResponse.json({ error: 'Te rog să răspunzi la toate cele 4 întrebări.' }, { status: 400 });
  }

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from('orders')
    .select('customer_email, customer_name')
    .eq('product_id', INTENSIV.productId)
    .eq('status', 'paid');
  if (ordersError) {
    console.error('INTENSIV_FEEDBACK_ORDERS', ordersError);
    return NextResponse.json({ error: 'A apărut o eroare. Încearcă din nou peste un minut.' }, { status: 500 });
  }
  let order = (orders ?? []).find((o) => (o.customer_email || '').trim().toLowerCase() === email);
  if (!order && (await requireAdmin()).ok) order = { customer_email: email, customer_name: 'TEST admin' };
  if (!order) {
    return NextResponse.json(
      { error: 'Nu găsim această adresă printre participanți. Folosește emailul cu care te-ai înscris la intensiv.' },
      { status: 404 },
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('intensiv_feedback')
    .select('bonus_sent_at')
    .eq('email', email)
    .maybeSingle();

  const { error: saveError } = await supabaseAdmin.from('intensiv_feedback').upsert(
    { email, name: order.customer_name, usefulness, takeaway, improve, topics, updated_at: new Date().toISOString() },
    { onConflict: 'email' },
  );
  if (saveError) {
    console.error('INTENSIV_FEEDBACK_SAVE', saveError);
    return NextResponse.json({ error: 'Nu am putut salva răspunsul. Încearcă din nou peste un minut.' }, { status: 500 });
  }

  let bonusSent = !!existing?.bonus_sent_at;
  if (!bonusSent) {
    const firstName = (order.customer_name || '').trim().split(/\s+/)[0] || '';
    const r = await sendBonus(email, firstName);
    if (r.ok) {
      bonusSent = true;
      await supabaseAdmin.from('intensiv_feedback').update({ bonus_sent_at: new Date().toISOString() }).eq('email', email);
    } else {
      console.error('INTENSIV_FEEDBACK_BONUS_FAILED', { email, error: r.error });
    }
  }
  console.log('INTENSIV_FEEDBACK_SAVED', { email, bonusSent });

  return NextResponse.json({ ok: true, bonusSent, downloadUrl: `/api/intensiv/feedback/bonus?t=${bonusToken(email)}` });
}
