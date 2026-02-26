-- =============================================================================
-- Supabase: tables for landing / payments / Telegram (RELAȚIA 360)
-- Run this in Supabase → SQL Editor → New query → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ORDERS (checkout, Paynet, RunPay, mock)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MDL',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  access_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ NULL,
  access_used_at TIMESTAMPTZ NULL,
  -- RunPay
  runpay_payment_id TEXT NULL,
  runpay_payload JSONB NULL,
  -- Paynet (invoice set by /api/paynet/create; null for RunPay/mock orders)
  invoice BIGINT UNIQUE NULL,
  paynet_payment_id BIGINT NULL,
  paynet_signature TEXT NULL,
  paynet_transaction_id TEXT NULL,
  paynet_payload JSONB NULL,
  -- Telegram binding
  telegram_user_id BIGINT NULL,
  telegram_username TEXT NULL,
  -- Generic provider (mock / runpay)
  provider TEXT NULL,
  provider_payment_id TEXT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Customer (form on /inscriere)
  customer_name TEXT NULL,
  customer_email TEXT NULL,
  customer_phone TEXT NULL,
  -- LMS invite email sent (once per paid order)
  invite_sent_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_access_token ON public.orders(access_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_invoice ON public.orders(invoice);

-- -----------------------------------------------------------------------------
-- 2. TELEGRAM USERS (bot state)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.telegram_users (
  telegram_user_id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  state TEXT NOT NULL DEFAULT 'NEW',
  blocked_until TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NULL
);

-- -----------------------------------------------------------------------------
-- 3. TELEGRAM ACCESS (granted products per user)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.telegram_access (
  telegram_user_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_user_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  access_granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL,
  source_token_hash TEXT NULL,
  PRIMARY KEY (telegram_user_id, product_id)
);

-- -----------------------------------------------------------------------------
-- 4. TELEGRAM TOKEN ATTEMPTS (rate limiting / audit)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.telegram_token_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  reason TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_telegram_attempts_user_time
  ON public.telegram_token_attempts (telegram_user_id, attempted_at DESC);

-- -----------------------------------------------------------------------------
-- 5. If "orders" already exists but is missing columns (e.g. from an old migration)
--    run only this block:
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice BIGINT UNIQUE NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paynet_payment_id BIGINT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paynet_signature TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paynet_transaction_id TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paynet_payload JSONB NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS telegram_user_id BIGINT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS telegram_username TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider_payment_id TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT NULL;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMPTZ NULL;
-- CREATE INDEX IF NOT EXISTS idx_orders_invoice ON public.orders(invoice);

-- -----------------------------------------------------------------------------
-- 6. RLS (optional – enable if you want row-level security)
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.telegram_access ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.telegram_token_attempts ENABLE ROW LEVEL SECURITY;
-- Then add policies so only the service role (your API) can read/write.
