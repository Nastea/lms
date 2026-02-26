-- ====== ADMIN READ POLICIES ======
-- Run this to add explicit SELECT policies for admins
-- This ensures admins can read courses/modules/lessons even without entitlements

-- Admin read policies for COURSES
drop policy if exists "admin read courses" on public.courses;
create policy "admin read courses"
on public.courses for select
to authenticated
using (public.is_admin());

-- Admin read policies for MODULES
drop policy if exists "admin read modules" on public.modules;
create policy "admin read modules"
on public.modules for select
to authenticated
using (public.is_admin());

-- Admin read policies for LESSONS
drop policy if exists "admin read lessons" on public.lessons;
create policy "admin read lessons"
on public.lessons for select
to authenticated
using (public.is_admin());

