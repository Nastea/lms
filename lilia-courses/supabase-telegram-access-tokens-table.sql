-- =============================================================================
-- Table for SmartSender: verify-telegram-access endpoint
-- Run in Supabase → SQL Editor → New query → Run
-- =============================================================================
-- Populated when we generate a telegram token for a paid order (sync from orders).

CREATE TABLE IF NOT EXISTS public.telegram_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  email TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_access_tokens_token
  ON public.telegram_access_tokens(token)
  WHERE used = false;

CREATE INDEX IF NOT EXISTS idx_telegram_access_tokens_expires_at
  ON public.telegram_access_tokens(expires_at);

COMMENT ON TABLE public.telegram_access_tokens IS
  'Tokens for SmartSender POST /api/verify-telegram-access; single-use, checked by token + used=false + expires_at>now().';
