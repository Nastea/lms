import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * POST /api/orders/send-invite
 * Body: { orderId: string }
 * For a paid order with customer_email, sends Supabase Auth invite (email with login link).
 * Idempotent: if invite already sent, returns ok.
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
      .select('id, status, customer_email, customer_name, invite_sent_at')
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

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://liliadubita.md';
    const redirectTo = `${siteUrl}/login`;

    if (order.invite_sent_at) {
      return NextResponse.json({ ok: true, alreadySent: true });
    }

    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { full_name: order.customer_name || undefined },
    });

    if (inviteError) {
      if (inviteError.message?.toLowerCase().includes('already been invited') || inviteError.message?.toLowerCase().includes('already registered')) {
        await supabaseAdmin.from('orders').update({ invite_sent_at: new Date().toISOString() }).eq('id', orderId);
        return NextResponse.json({ ok: true });
      }
      console.error('Send invite error:', inviteError);
      return NextResponse.json(
        { error: 'Failed to send invite', details: inviteError.message },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from('orders')
      .update({ invite_sent_at: new Date().toISOString() })
      .eq('id', orderId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Send invite:', e);
    return NextResponse.json(
      { error: 'Internal server error', details: String((e as Error).message) },
      { status: 500 }
    );
  }
}
