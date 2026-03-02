# LMS Architecture – Public lead magnet vs paid course

## Overview

- **Lesson 0** = public lead magnet (no account).
- **Lessons 1+** = paid course (account + purchase required).
- **Account** = created only after payment (invite email).

## Public layer (no auth)

| Route | Purpose |
|-------|--------|
| `/curs/lectia-0` | Public Lesson 0: video, positioning, CTA “Cumpără cursul” → `/inscriere` |
| `/acces-curs` | Redirects to `/curs/lectia-0` |
| `/conflicte`, `/inscriere`, `/plata`, `/multumim`, `/login`, `/signup` | Landing, payment, thank-you, auth (signup is info-only) |

## Protected layer (auth + entitlement)

| Route | Purpose |
|-------|--------|
| `/app` | Dashboard: only courses the user has purchased (entitlements). |
| `/app/course/[courseId]` | Course outline (lessons list). |
| `/app/lesson/[lessonId]` | Lesson content. **All lessons require entitlement**; no “first lesson free” in app. |

## User journey

1. **Visit Lesson 0** → `/curs/lectia-0` (no login).
2. **Buy course** → `/inscriere` → payment → redirect to `/multumim?order=...`.
3. **After payment** → Email with invite link → user sets password (Supabase invite) → redirect to `/app`.
4. **Access** → Entitlements synced from paid orders (by `customer_email`) on `/app` load; user sees only purchased courses.

## Access logic

- **Course access** = row in `entitlements` for `user_id` + `course_id`, status `active`.
- **Entitlements** = created only from paid `orders` (see `syncEntitlementsFromOrders` in `lib/sync-entitlements.ts`).
- **No open signup** → `/signup` shows info only (“Contul se creează doar după achiziție”); account creation is via invite link after payment.

## Config

- `PAYMENT_COURSE_ID` = course whose first lesson is shown on `/curs/lectia-0` and whose access is granted after payment.
- First lesson (by module/lesson sort order) of that course is the public “Lesson 0” content.
