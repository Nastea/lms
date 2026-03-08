import { NextResponse } from 'next/server';
import { ensureOrderHasTelegramToken } from '@/lib/orderTelegramToken';

/**
 * GET /api/orders/access?order=<uuid>
 * Returns Telegram deep-link token ONLY if order is paid.
 * Token is generated when payment is confirmed (single-use in bot).
 * Used by /multumim thank-you page for "Accesează în Telegram" button.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order parameter' },
        { status: 400 }
      );
    }

    const result = await ensureOrderHasTelegramToken(orderId);

    if (!result.ok) {
      if (result.error === 'Order not found') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      if (result.error === 'Order not paid') {
        return NextResponse.json({ error: 'Order not paid yet' }, { status: 403 });
      }
      return NextResponse.json(
        { error: 'Internal server error', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      access_token: result.token,
    });
  } catch (error) {
    console.error('Order access error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

