-- =============================================================================
-- Telegram-first post-payment: telegram_access_token (generated when paid)
-- Run in Supabase → SQL Editor → New query → Run
-- =============================================================================
-- Token is generated only after payment confirmation. Single-use (first bind).
-- Optional: expiry 90 days from creation (enforced in app if needed).

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS telegram_access_token TEXT UNIQUE NULL,
  ADD COLUMN IF NOT EXISTS telegram_access_token_created_at TIMESTAMPTZ NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_telegram_access_token
  ON public.orders(telegram_access_token)
  WHERE telegram_access_token IS NOT NULL;

COMMENT ON COLUMN public.orders.telegram_access_token IS
  'Secure token for Telegram/Smart Sender deep link; generated when order becomes paid; single-use (first verification binds to telegram_user_id).';
COMMENT ON COLUMN public.orders.telegram_access_token_created_at IS
  'When telegram_access_token was generated; can be used for expiry (e.g. 90 days).';
