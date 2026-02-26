# First lesson free, then paywall

Users must **create an account** to access the first lesson (one-step signup: email, phone, password). The first lesson is free; after that they must pay to unlock the rest.

## Setup

### 0. Signup and profile trigger (recommended)

So that new users get a profile row when they sign up, run once in Supabase → SQL Editor:

- **`supabase-auth-profile-trigger.sql`** – creates a trigger so every new auth user gets a row in `public.profiles`.

For the smoothest “one-time enter” experience (no email confirmation step), in Supabase → Authentication → Providers → Email: turn **off** “Confirm email”. Then users are logged in immediately after signup.

### 1. Run the SQL migration

In Supabase → SQL Editor, run:

```
supabase-first-lesson-free.sql
```

This adds:

- `get_first_lesson_id(course_id)` – first lesson of a course (by module/lesson order)
- `is_first_lesson(lesson_id)` – whether a lesson is the first of its course
- `get_first_lesson_ids(course_ids)` – first lesson id per course (for dashboard)
- `get_lesson_paywall_info(lesson_id)` – course_id, course_title, is_first_lesson (for paywall)
- RLS updates so authenticated users can read the first lesson (and its course/module) without an entitlement

### 2. Env for syncing entitlements after payment

When a user pays, they get an entitlement so they can see all lessons. Entitlements are synced on **/app** load from the `orders` table (by `customer_email`).

Set in `.env.local`:

- **`PAYMENT_COURSE_ID`** – UUID of the course to grant when an order is paid. Required for sync.
- **`PAYMENT_PRODUCT_ID`** (optional) – If set, only orders with this `product_id` grant this course. If unset, any paid order for that email grants the course.

Example:

```env
PAYMENT_COURSE_ID=your-course-uuid-from-supabase
PAYMENT_PRODUCT_ID=relatia360_conflicte
```

## Flow

1. User goes to **/signup** (or “Creează cont” on `/login`). One form: **email**, **phone**, **password** → account created. If email confirmation is off in Supabase, they are logged in and redirected to `/app` (or the `next` URL, e.g. first lesson).
2. On **/app** they see all published courses. Entitled courses open fully; others show **“Lecția 1 gratuită”** and link to the first lesson.
3. First lesson is visible without entitlement (RLS allows it).
4. When they try to open any other lesson without entitlement, they see the **paywall** (with link to `/plata`).
5. After payment, order has `customer_email` and `status = 'paid'`. On next **/app** load, `syncEntitlementsFromOrders()` grants entitlement for `PAYMENT_COURSE_ID`, so all lessons unlock.

## Course page

For users **without** entitlement, the course page only loads the first module and first lesson (RLS returns only those). So they see one lesson; clicking “Next” goes to lesson 2 and triggers the paywall.
