/**
 * URL-ul către botul de funnel (Telegram / SmartSender).
 * Toate CTA-urile de cumpărare pe site pot trimite aici; botul oferă apoi checkout.
 */
const DEFAULT_BOT_URL = "https://t.me/liliadubita_bot?start=ZGw6MzE3NzM4";

export function getFunnelBotUrl(): string {
  return process.env.NEXT_PUBLIC_FUNNEL_BOT_URL?.trim() || DEFAULT_BOT_URL;
}
