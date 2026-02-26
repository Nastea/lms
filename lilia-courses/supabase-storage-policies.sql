-- ====== STORAGE POLICIES FOR PDF UPLOADS ======
-- Run this AFTER creating the 'course-pdfs' bucket in Supabase Storage
-- 
-- Steps:
-- 1. Go to Supabase → Storage → Create bucket
-- 2. Name: course-pdfs
-- 3. Public: ON (for MVP)
-- 4. Then run this SQL

-- Allow ONLY admins to upload/update/delete PDFs in bucket course-pdfs
-- (Bucket is public for reading in MVP)

-- INSERT (upload)
drop policy if exists "admin upload course pdfs" on storage.objects;
create policy "admin upload course pdfs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'course-pdfs'
  and public.is_admin()
);

-- UPDATE (replace)
drop policy if exists "admin update course pdfs" on storage.objects;
create policy "admin update course pdfs"
on storage.objects for update
to authenticated
using (
  bucket_id = 'course-pdfs'
  and public.is_admin()
)
with check (
  bucket_id = 'course-pdfs'
  and public.is_admin()
);

-- DELETE
drop policy if exists "admin delete course pdfs" on storage.objects;
create policy "admin delete course pdfs"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'course-pdfs'
  and public.is_admin()
);

