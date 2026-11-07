-- Feedback după intensivul „Am un plan pentru viața mea” (pagina /intensiv/feedback).
-- Rulează o singură dată în Supabase → SQL Editor.
create table if not exists public.intensiv_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  name text,
  usefulness int check (usefulness between 1 and 10),
  takeaway text,
  improve text,
  bonus_sent_at timestamptz
);
-- Fără politici: tabelul e accesibil doar de pe server (service role).
alter table public.intensiv_feedback enable row level security;
