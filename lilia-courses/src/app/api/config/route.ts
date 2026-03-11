import { NextResponse } from 'next/server';

/**
 * GET /api/config
 * Returns public configuration values (non-sensitive)
 * Used by client-side to get Telegram bot username
 */
export async function GET() {
  const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.liliadubita.md').replace(/\/$/, '');
  const smartSenderPaidDeepLink =
    process.env.SMART_SENDER_PAID_DEEP_LINK ||
    process.env.NEXT_PUBLIC_SMART_SENDER_PAID_DEEP_LINK ||
    'https://t.me/liliadubita_bot?start=ZGw6MzE3NzUz';
  const telegramQuizBotBase =
    process.env.TELEGRAM_QUIZ_BOT_BASE ||
    process.env.NEXT_PUBLIC_TELEGRAM_QUIZ_BOT_BASE ||
    'https://t.me/liliadubita_bot';

  return NextResponse.json({
    telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || 'Relatia360Bot',
    paynetEnv: process.env.PAYNET_ENV || 'test',
    supportUrl: process.env.SUPPORT_URL || siteUrl,
    smartSenderPaidDeepLink,
    telegramQuizBotBase,
  });
}

