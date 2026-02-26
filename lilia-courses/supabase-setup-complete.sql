-- ====== COMPLETE SETUP: SCHEMA + SEED DATA ======
-- Run this entire script in Supabase SQL Editor
-- Make sure you have created a user in Auth → Users first!

-- ====== PART 1: SCHEMA ======

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

-- ====== PART 2: SEED DATA ======

DO $$
DECLARE
  demo_user_id uuid;
  demo_course_id uuid;
  demo_module_1_id uuid;
  demo_module_2_id uuid;
BEGIN
  -- Get the first user (or replace with your specific user_id)
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create a user in Supabase Auth → Users first.';
  END IF;

  -- Create a course
  INSERT INTO public.courses (title, description, cover_url, is_published)
  VALUES (
    'Introduction to Web Development',
    'Learn the fundamentals of building modern web applications with HTML, CSS, and JavaScript.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    true
  )
  RETURNING id INTO demo_course_id;

  -- Create modules (insert separately to get IDs)
  INSERT INTO public.modules (course_id, title, sort_order)
  VALUES (demo_course_id, 'Getting Started', 1)
  RETURNING id INTO demo_module_1_id;

  INSERT INTO public.modules (course_id, title, sort_order)
  VALUES (demo_course_id, 'Core Concepts', 2)
  RETURNING id INTO demo_module_2_id;

  -- Create lessons
  INSERT INTO public.lessons (module_id, title, sort_order, type, video_url, body_md, pdf_url)
  VALUES 
    -- Module 1 lessons
    (
      demo_module_1_id,
      'Welcome to the Course',
      1,
      'mixed',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'Welcome! In this course, you will learn the fundamentals of web development.

## What You Will Learn

- HTML structure and semantics
- CSS styling and layout
- JavaScript basics
- Building your first website

Let''s get started!',
      NULL
    ),
    (
      demo_module_1_id,
      'Setting Up Your Development Environment',
      2,
      'text',
      NULL,
      'Before we start coding, you need to set up your development environment.

## Required Tools

1. **Code Editor**: Download VS Code or your preferred editor
2. **Web Browser**: Chrome, Firefox, or Safari
3. **Git**: For version control (optional but recommended)

## Installation Steps

1. Install VS Code from code.visualstudio.com
2. Install the Live Server extension
3. Create a new folder for your projects

You''re all set!',
      NULL
    ),
    -- Module 2 lessons
    (
      demo_module_2_id,
      'HTML Basics',
      1,
      'mixed',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'HTML (HyperText Markup Language) is the foundation of every web page.

## Key Concepts

- HTML tags and elements
- Document structure
- Semantic HTML
- Forms and inputs

Practice makes perfect!',
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    ),
    (
      demo_module_2_id,
      'CSS Styling',
      2,
      'video',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      NULL,
      NULL
    ),
    (
      demo_module_2_id,
      'JavaScript Fundamentals',
      3,
      'text',
      NULL,
      'JavaScript brings interactivity to your websites.

## Topics Covered

- Variables and data types
- Functions
- DOM manipulation
- Event handling

Start coding and experiment!',
      NULL
    );

  -- Create entitlement (give user access to the course)
  INSERT INTO public.entitlements (user_id, course_id, status, source, order_id)
  VALUES (
    demo_user_id,
    demo_course_id,
    'active',
    'demo',
    'demo-seed-' || gen_random_uuid()::text
  )
  ON CONFLICT (user_id, course_id) DO NOTHING;

  RAISE NOTICE '✅ Setup complete!';
  RAISE NOTICE 'Course ID: %', demo_course_id;
  RAISE NOTICE 'User ID: %', demo_user_id;
END $$;

-- Verify the data
SELECT 
  c.title as course_title,
  m.title as module_title,
  l.title as lesson_title,
  l.type as lesson_type
FROM public.courses c
JOIN public.modules m ON m.course_id = c.id
JOIN public.lessons l ON l.module_id = m.id
ORDER BY m.sort_order, l.sort_order;

