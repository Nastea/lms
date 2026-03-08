import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ensureOrderHasTelegramToken } from '@/lib/orderTelegramToken';
import { sendPostPaymentTelegramEmail } from '@/lib/postPaymentEmail';

const siteUrl = () =>
  (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.liliadubita.md').replace(/\/$/, '');

/**
 * POST /api/orders/send-telegram-email
 * Body: { orderId: string }
 * For a paid order with customer_email: sends email with Telegram deep link + support. No signup/login.
 * Idempotent: if already sent (invite_sent_at), returns ok.
 */
export async function POST(req: Request) {
  try {
    let body: { orderId?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const orderId = body?.orderId;
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, status, customer_email, invite_sent_at')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.status !== 'paid') {
      return NextResponse.json({ error: 'Order not paid' }, { status: 400 });
    }
    const email = order.customer_email?.trim();
    if (!email) {
      return NextResponse.json({ error: 'No customer email' }, { status: 400 });
    }

    if (order.invite_sent_at) {
      return NextResponse.json({ ok: true, alreadySent: true });
    }

    const tokenResult = await ensureOrderHasTelegramToken(orderId);
    if (!tokenResult.ok || !tokenResult.token) {
      return NextResponse.json(
        { error: 'Could not get Telegram token', details: tokenResult.error },
        { status: 500 }
      );
    }

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'Relatia360Bot';
    const telegramDeepLink = `https://t.me/${botUsername}?start=${tokenResult.token}`;

    const sent = await sendPostPaymentTelegramEmail({
      to: email,
      telegramDeepLink,
      supportUrl: siteUrl(),
    });

    if (!sent.ok) {
      return NextResponse.json(
        { error: 'Failed to send email', details: sent.error },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from('orders')
      .update({ invite_sent_at: new Date().toISOString() })
      .eq('id', orderId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Send telegram email:', e);
    return NextResponse.json(
      { error: 'Internal server error', details: String((e as Error).message) },
      { status: 500 }
    );
  }
}
