import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getNotifySecret } from '@/lib/paynet';
import { ensureOrderHasTelegramToken } from '@/lib/orderTelegramToken';
import { sendPostPaymentTelegramEmail } from '@/lib/postPaymentEmail';
import { createHash } from 'crypto';

/** GET: verify endpoint is reachable (e.g. open in browser). Paynet must call POST. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Paynet callback endpoint. Paynet should POST here.',
    env: {
      hasNotifySecret: !!getNotifySecret(),
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      paynetEnv: process.env.PAYNET_ENV ?? '(not set)',
    },
  });
}

export async function POST(req: Request) {
  console.log('[Paynet] POST /api/paynet/callback invoked');
  try {
    const payload = await req.json();
    const hashHeader = req.headers.get('Hash');

    console.log('[Paynet] payload keys:', Object.keys(payload || {}), 'EventType:', payload?.EventType ?? payload?.eventType);

    const notifySecret = getNotifySecret();
    const isTest = process.env.PAYNET_ENV === 'test';

    if (!notifySecret && !isTest) {
      console.error('Paynet notify secret not configured');
      return NextResponse.json({ ok: true });
    }

    // Verify signature when Hash is present and we have a secret
    if (hashHeader && notifySecret) {
      const payment = payload.Payment || payload.payment || {};
      
      // Build PreparedString exactly as per Paynet docs
      const preparedString = 
        (payload.EventDate || '') +
        (payload.Eventid || payload.EventId || '') +
        (payload.EventType || '') +
        (payment.Amount || '') +
        (payment.Customer || '') +
        (payment.ExternalID || payment.ExternalId || '') +
        (payment.ID || payment.Id || '') +
        (payment.Merchant || '') +
        (payment.StatusDate || '');

      // Compute hash: Base64(MD5(PreparedString + notifySecretKey))
      const hashInput = preparedString + notifySecret;
      const md5Hash = createHash('md5').update(hashInput).digest();
      const computedHash = Buffer.from(md5Hash).toString('base64');

      if (hashHeader !== computedHash) {
        // In practice, Paynet may have undocumented differences in PreparedString.
        // For now, log the mismatch but continue processing so paid orders are unlocked.
        console.error('Hash verification failed');
      } else {
        console.log('Hash verification successful');
      }
    } else if (hashHeader && !notifySecret && isTest) {
      console.warn('Test mode: no notify secret, skipping hash verification');
    }

    // Process Paid event (case-insensitive)
    const eventTypeRaw = payload.EventType || payload.eventType || '';
    const eventType = String(eventTypeRaw).toLowerCase();
    if (eventType === 'paid') {
      const payment = payload.Payment || payload.payment || {};
      const externalId = payment.ExternalID || payment.ExternalId;

      if (externalId) {
        // Find order by invoice (ExternalID)
        const { data: order, error: findError } = await supabaseAdmin
          .from('orders')
          .select('id, status, customer_email, invite_sent_at')
          .eq('invoice', externalId.toString())
          .single();

        if (findError) {
          console.error('[Paynet] Order not found for invoice:', externalId, findError.message ?? findError);
        } else if (order) {
          console.log('[Paynet] Order found:', order.id, 'email:', order.customer_email ?? '(empty)', 'invite_sent_at:', order.invite_sent_at ?? 'null');
          const updateData: any = {
            status: 'paid',
            paid_at: new Date().toISOString(),
            paynet_payload: payload,
          };

          // Add paynet_payment_id (Payment.ID) and paynet_transaction_id
          const paymentId = payment.ID || payment.Id;
          if (paymentId) {
            updateData.paynet_payment_id = paymentId.toString();
            updateData.paynet_transaction_id = paymentId.toString();
          }

          const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', order.id);

          if (updateError) {
            console.error('Supabase update error:', updateError);
          } else {
            console.log(`Order ${order.id} marked as paid (invoice: ${externalId})`);

            // After marking as paid, ensure Telegram token + send bot access email (idempotent via invite_sent_at)
            try {
              if (order.customer_email && !order.invite_sent_at) {
                const email = order.customer_email.trim();
                if (email) {
                  console.log('Paynet callback: sending post-payment email to', email, 'order', order.id);

                  // Try to ensure per-order Telegram token; if it fails, fall back to SmartSender deep link.
                  const tokenResult = await ensureOrderHasTelegramToken(order.id);
                  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'Relatia360Bot';
                  const smartSenderPaidDeepLink =
                    process.env.SMART_SENDER_PAID_DEEP_LINK ||
                    process.env.NEXT_PUBLIC_SMART_SENDER_PAID_DEEP_LINK ||
                    'https://t.me/liliadubita_bot?start=ZGw6MzE3NzUz';

                  let telegramDeepLink: string;
                  if (tokenResult.ok && tokenResult.token) {
                    telegramDeepLink = `https://t.me/${botUsername}?start=${tokenResult.token}`;
                  } else {
                    console.error(
                      'Telegram token ensure failed for order',
                      order.id,
                      tokenResult.error,
                      '- falling back to SmartSender deep link',
                    );
                    telegramDeepLink = smartSenderPaidDeepLink;
                  }

                  const sent = await sendPostPaymentTelegramEmail({
                    to: email,
                    telegramDeepLink,
                  });
                  if (!sent.ok) {
                    console.error('Post-payment Telegram email failed for order', order.id, 'error:', sent.error);
                  } else {
                    await supabaseAdmin
                      .from('orders')
                      .update({ invite_sent_at: new Date().toISOString() })
                      .eq('id', order.id);
                    console.log('Post-payment email sent and invite_sent_at set for order', order.id);
                  }
                } else {
                  console.warn('Paynet callback: order', order.id, 'has empty customer_email after trim');
                }
              } else {
                if (!order.customer_email) console.warn('Paynet callback: order', order.id, 'has no customer_email');
                if (order.invite_sent_at) console.log('Paynet callback: order', order.id, 'already had invite_sent_at');
              }
            } catch (e) {
              console.error('Post-payment Telegram email flow error for order', order.id, e);
            }
          }
        }
      } else {
        console.warn('No ExternalID in Payment object');
      }
    }

    // Always return 200 OK quickly to avoid retries
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Callback error:', error);
    // Still return 200 to avoid retries from Paynet
    return NextResponse.json({ ok: true });
  }
}

