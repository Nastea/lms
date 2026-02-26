-- =============================================================================
-- First lesson free: allow authenticated users to read the first lesson of
-- each course (by sort order) without an entitlement. After that, they must pay.
-- Run this in Supabase → SQL Editor after the main schema.
-- =============================================================================

-- Helper: first lesson id of a course (by module sort_order, then lesson sort_order)
create or replace function public.get_first_lesson_id(p_course_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.course_id = p_course_id
  order by m.sort_order asc, l.sort_order asc
  limit 1;
$$;

-- Helper: true if this lesson is the first lesson of its course
create or replace function public.is_first_lesson(p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    where l.id = p_lesson_id
      and l.id = public.get_first_lesson_id(m.course_id)
  );
$$;

-- Allow reading a course if entitled OR if the course has at least one lesson
-- (so we can show course title and "start free lesson")
drop policy if exists "read courses if entitled" on public.courses;
create policy "read courses if entitled or has lessons"
on public.courses for select
to authenticated
using (
  exists (
    select 1 from public.entitlements e
    where e.course_id = courses.id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
  or exists (
    select 1 from public.modules m
    join public.lessons l on l.module_id = m.id
    where m.course_id = courses.id
  )
);

-- Allow reading a module if entitled OR if it contains the first lesson of the course
drop policy if exists "read modules if entitled" on public.modules;
create policy "read modules if entitled or first lesson"
on public.modules for select
to authenticated
using (
  exists (
    select 1 from public.entitlements e
    where e.course_id = modules.course_id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
  or exists (
    select 1 from public.lessons l
    where l.module_id = modules.id
      and l.id = public.get_first_lesson_id(modules.course_id)
  )
);

-- Allow reading a lesson if entitled OR if it is the first lesson of its course
drop policy if exists "read lessons if entitled" on public.lessons;
create policy "read lessons if entitled or first lesson"
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
  or public.is_first_lesson(lessons.id)
);

-- RPC: return (course_id, first_lesson_id) for each course (for app dashboard)
create or replace function public.get_first_lesson_ids(p_course_ids uuid[])
returns table(course_id uuid, first_lesson_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select uid as course_id, public.get_first_lesson_id(uid) as first_lesson_id
  from unnest(p_course_ids) as uid
  where public.get_first_lesson_id(uid) is not null;
$$;

-- RPC: for a lesson, return course_id, course_title, and whether it's the first lesson (for paywall check)
create or replace function public.get_lesson_paywall_info(p_lesson_id uuid)
returns table(course_id uuid, course_title text, is_first_lesson boolean)
language sql
stable
security definer
set search_path = public
as $$
  select m.course_id, c.title as course_title, (l.id = public.get_first_lesson_id(m.course_id)) as is_first_lesson
  from public.lessons l
  join public.modules m on m.id = l.module_id
  join public.courses c on c.id = m.course_id
  where l.id = p_lesson_id;
$$;
