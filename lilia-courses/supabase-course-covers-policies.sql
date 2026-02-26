-- ====== STORAGE POLICIES FOR COURSE COVER IMAGES ======
-- Run this AFTER creating the 'course-covers' bucket in Supabase Storage
-- 
-- Steps:
-- 1. Go to Supabase → Storage → Create bucket
-- 2. Name: course-covers
-- 3. Public: ON (for MVP)
-- 4. Then run this SQL

-- Allow ONLY admins to upload/update/delete cover images in bucket course-covers
-- (Bucket is public for reading in MVP)

-- INSERT (upload)
drop policy if exists "admin upload course covers" on storage.objects;
create policy "admin upload course covers"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'course-covers'
  and public.is_admin()
);

-- UPDATE (replace)
drop policy if exists "admin update course covers" on storage.objects;
create policy "admin update course covers"
on storage.objects for update
to authenticated
using (
  bucket_id = 'course-covers'
  and public.is_admin()
)
with check (
  bucket_id = 'course-covers'
  and public.is_admin()
);

-- DELETE
drop policy if exists "admin delete course covers" on storage.objects;
create policy "admin delete course covers"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'course-covers'
  and public.is_admin()
);

