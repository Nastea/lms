-- ====== FIX COURSE COVERS RLS POLICIES ======
-- Rulează acest script în Supabase SQL Editor
-- IMPORTANT: Asigură-te că bucket-ul 'course-covers' există în Storage UI înainte!

-- Pasul 1: Verifică dacă funcția is_admin() există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name = 'is_admin'
  ) THEN
    RAISE EXCEPTION 'Funcția is_admin() nu există! Rulează mai întâi supabase-admin-setup.sql';
  END IF;
END $$;

-- Pasul 2: Șterge policies existente (dacă există)
DROP POLICY IF EXISTS "admin upload course covers" ON storage.objects;
DROP POLICY IF EXISTS "admin update course covers" ON storage.objects;
DROP POLICY IF EXISTS "admin delete course covers" ON storage.objects;

-- Pasul 3: Creează policies pentru INSERT (upload)
CREATE POLICY "admin upload course covers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-covers'
  AND public.is_admin() = true
);

-- Pasul 4: Creează policy pentru UPDATE (replace)
CREATE POLICY "admin update course covers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-covers'
  AND public.is_admin() = true
)
WITH CHECK (
  bucket_id = 'course-covers'
  AND public.is_admin() = true
);

-- Pasul 5: Creează policy pentru DELETE
CREATE POLICY "admin delete course covers"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-covers'
  AND public.is_admin() = true
);

-- Pasul 6: Verificare finală
SELECT 
  'Policies create cu succes!' as status,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%course covers%';

