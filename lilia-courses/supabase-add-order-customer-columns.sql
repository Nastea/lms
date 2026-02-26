-- Add customer + invite columns to existing public.orders
-- Run in Supabase → SQL Editor → New query → Run

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMPTZ NULL;
