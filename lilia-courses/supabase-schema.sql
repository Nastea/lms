-- ====== SCHEMA ======

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  cover_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

do $$ begin
  if not exists (select 1 from pg_type where typname = 'lesson_type') then
    create type public.lesson_type as enum ('video', 'text', 'mixed');
  end if;
end $$;

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  type public.lesson_type not null default 'mixed',
  video_url text,
  body_md text,
  pdf_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active',
  source text,
  order_id text,
  purchased_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create or replace view public.lesson_full as
select
  l.*,
  m.course_id,
  m.title as module_title,
  c.title as course_title
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id;

-- ====== RLS ======
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.entitlements enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "read courses if entitled" on public.courses;
create policy "read courses if entitled"
on public.courses for select
to authenticated
using (
  exists (
    select 1 from public.entitlements e
    where e.course_id = courses.id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
);

drop policy if exists "read modules if entitled" on public.modules;
create policy "read modules if entitled"
on public.modules for select
to authenticated
using (
  exists (
    select 1 from public.entitlements e
    where e.course_id = modules.course_id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
);

drop policy if exists "read lessons if entitled" on public.lessons;
create policy "read lessons if entitled"
on public.lessons for select
to authenticated
using (
  exists (
    select 1
    from public.modules m
    join public.entitlements e on e.course_id = m.course_id
    where m.id = lessons.module_id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
);

drop policy if exists "read own entitlements" on public.entitlements;
create policy "read own entitlements"
on public.entitlements for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "read own progress" on public.lesson_progress;
create policy "read own progress"
on public.lesson_progress for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "upsert own progress" on public.lesson_progress;
create policy "upsert own progress"
on public.lesson_progress for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "update own progress" on public.lesson_progress;
create policy "update own progress"
on public.lesson_progress for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

