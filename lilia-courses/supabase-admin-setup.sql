-- ====== ADMIN SETUP ======
-- Run this in Supabase SQL Editor after the main schema is set up
-- This adds admin role and write permissions

-- 1) Profiles table (one row per auth user)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- allow users to read their own profile
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
on public.profiles for select
to authenticated
using (user_id = auth.uid());

-- helper function: is_admin()
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.is_admin = true
  );
$$;

-- 2) Admin policies: allow admins to insert/update/delete course content
-- COURSES
drop policy if exists "admin write courses" on public.courses;
create policy "admin write courses"
on public.courses for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- MODULES
drop policy if exists "admin write modules" on public.modules;
create policy "admin write modules"
on public.modules for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- LESSONS
drop policy if exists "admin write lessons" on public.lessons;
create policy "admin write lessons"
on public.lessons for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ENTITLEMENTS (optional admin management later)
drop policy if exists "admin write entitlements" on public.entitlements;
create policy "admin write entitlements"
on public.entitlements for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

