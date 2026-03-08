import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendCredentialsEmail, generateTemporaryPassword } from '@/lib/credentialsEmail';

function siteUrl(): string {
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.liliadubita.md').replace(/\/$/, '');
}

/**
 * POST /api/orders/send-invite
 * Body: { orderId: string }
 * For a paid order with customer_email:
 * - If RESEND_API_KEY is set: create user with temporary password (or use existing),
 *   send email with login link + password + "change password" link (Resend).
 * - Else: send Supabase Auth invite (magic link to set password).
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

    if (order.invite_sent_at) {
      return NextResponse.json({ ok: true, alreadySent: true });
    }

    const useCredentialsEmail = !!process.env.RESEND_API_KEY;
    const redirectTo = `${siteUrl()}/login`;

    if (useCredentialsEmail) {
      const tempPass = generateTemporaryPassword(12);
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPass,
        email_confirm: true,
        user_metadata: { full_name: order.customer_name || undefined },
      });

      // Get recovery link for "Schimbă parola" (after user exists)
      const { data: recoveryData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo },
      });
      const changePasswordLink =
        (recoveryData as { properties?: { action_link?: string } })?.properties?.action_link ??
        (recoveryData as { action_link?: string })?.action_link;

      if (createError) {
        const msg = createError.message?.toLowerCase() ?? '';
        if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
          // User already exists: send email with only "resetează parola" link
          const sent = await sendCredentialsEmail({
            to: email,
            changePasswordLink: changePasswordLink ?? undefined,
          });
          if (!sent.ok) {
            console.error('Send credentials (existing user) error:', sent.error);
            return NextResponse.json(
              { error: 'Failed to send email', details: sent.error },
              { status: 500 }
            );
          }
          await supabaseAdmin.from('orders').update({ invite_sent_at: new Date().toISOString() }).eq('id', orderId);
          return NextResponse.json({ ok: true, alreadyHadAccount: true });
        }
        console.error('Create user error:', createError);
        return NextResponse.json(
          { error: 'Failed to create user', details: createError.message },
          { status: 500 }
        );
      }

      const sent = await sendCredentialsEmail({
        to: email,
        temporaryPassword: tempPass,
        changePasswordLink: changePasswordLink ?? undefined,
      });
      if (!sent.ok) {
        console.error('Send credentials error:', sent.error);
        return NextResponse.json(
          { error: 'Failed to send email', details: sent.error },
          { status: 500 }
        );
      }

      await supabaseAdmin.from('orders').update({ invite_sent_at: new Date().toISOString() }).eq('id', orderId);
      return NextResponse.json({ ok: true });
    }

    // Fallback: Supabase invite (magic link)
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { full_name: order.customer_name || undefined },
    });

    if (inviteError) {
      if (
        inviteError.message?.toLowerCase().includes('already been invited') ||
        inviteError.message?.toLowerCase().includes('already registered')
      ) {
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
