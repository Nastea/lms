import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getNotifySecret } from '@/lib/paynet';
import { createHash } from 'crypto';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const hashHeader = req.headers.get('Hash');

    // Log received payload for debugging
    console.log('Paynet callback received:', JSON.stringify(payload, null, 2));
    console.log('Hash header:', hashHeader);

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
        console.error('Hash verification failed');
        if (!isTest) {
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
          );
        }
        console.warn('Test mode: proceeding despite invalid hash');
      } else {
        console.log('Hash verification successful');
      }
    } else if (hashHeader && !notifySecret && isTest) {
      console.warn('Test mode: no notify secret, skipping hash verification');
    }

    // Process Paid event
    if (payload.EventType === 'Paid' || payload.eventType === 'Paid') {
      const payment = payload.Payment || payload.payment || {};
      const externalId = payment.ExternalID || payment.ExternalId;

      if (externalId) {
        // Find order by invoice (ExternalID)
        const { data: order, error: findError } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('invoice', externalId.toString())
          .single();

        if (findError) {
          console.error('Order not found for invoice:', externalId, findError);
        } else if (order) {
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

