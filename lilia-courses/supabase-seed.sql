-- ====== SEED DEMO DATA ======
-- Run this AFTER running supabase-schema.sql
-- This script creates a sample course with modules and lessons

-- Step 1: Get your user_id (replace this with your actual user ID from Auth → Users)
-- Or use the first user in the system:
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

  -- Step 2: Create a course
  INSERT INTO public.courses (title, description, cover_url, is_published)
  VALUES (
    'Introduction to Web Development',
    'Learn the fundamentals of building modern web applications with HTML, CSS, and JavaScript.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    true
  )
  RETURNING id INTO demo_course_id;

  -- Step 3: Create modules (insert separately to get IDs)
  INSERT INTO public.modules (course_id, title, sort_order)
  VALUES (demo_course_id, 'Getting Started', 1)
  RETURNING id INTO demo_module_1_id;

  INSERT INTO public.modules (course_id, title, sort_order)
  VALUES (demo_course_id, 'Core Concepts', 2)
  RETURNING id INTO demo_module_2_id;

  -- Step 4: Create lessons
  INSERT INTO public.lessons (module_id, title, sort_order, type, video_url, body_md, pdf_url)
  VALUES 
    -- Module 1 lessons
    (
      demo_module_1_id,
      'Welcome to the Course',
      1,
      'mixed',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', -- Replace with your video embed URL
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
      'https://www.youtube.com/embed/dQw4w9WgXcQ', -- Replace with your video embed URL
      'HTML (HyperText Markup Language) is the foundation of every web page.

## Key Concepts

- HTML tags and elements
- Document structure
- Semantic HTML
- Forms and inputs

Practice makes perfect!',
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' -- Replace with your PDF URL
    ),
    (
      demo_module_2_id,
      'CSS Styling',
      2,
      'video',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', -- Replace with your video embed URL
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

  -- Step 5: Create entitlement (give user access to the course)
  INSERT INTO public.entitlements (user_id, course_id, status, source, order_id)
  VALUES (
    demo_user_id,
    demo_course_id,
    'active',
    'demo',
    'demo-seed-' || gen_random_uuid()::text
  )
  ON CONFLICT (user_id, course_id) DO NOTHING;

  RAISE NOTICE 'Demo data created successfully!';
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

