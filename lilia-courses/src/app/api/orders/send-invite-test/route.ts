import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * POST /api/orders/send-invite-test
 * Body: { email: string, name?: string }
 * Trimite o invitație Supabase la emailul dat (pentru test).
 * Opțional: header "x-invite-test-secret" sau query ?secret=... = INVITE_TEST_SECRET.
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.INVITE_TEST_SECRET;
    if (secret) {
      const headerSecret = req.headers.get('x-invite-test-secret');
      const url = new URL(req.url);
      const querySecret = url.searchParams.get('secret');
      if (headerSecret !== secret && querySecret !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let body: { email?: string; name?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const email = body?.email?.trim();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.liliadubita.md';
    const redirectTo = `${siteUrl}/login`;

    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { full_name: body?.name || undefined },
    });

    if (inviteError) {
      if (
        inviteError.message?.toLowerCase().includes('already been invited') ||
        inviteError.message?.toLowerCase().includes('already registered')
      ) {
        return NextResponse.json({ ok: true, message: 'User already invited or registered' });
      }
      console.error('Send invite test error:', inviteError);
      return NextResponse.json(
        { error: 'Failed to send invite', details: inviteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: 'Invite sent to ' + email });
  } catch (e) {
    console.error('Send invite test:', e);
    return NextResponse.json(
      { error: 'Internal server error', details: String((e as Error).message) },
      { status: 500 }
    );
  }
}
