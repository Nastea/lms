-- ====== DIAGNOSTIC SCRIPT FOR COURSE COVERS ======
-- Rulează acest script în Supabase SQL Editor pentru a verifica configurația

-- 1. Verifică dacă bucket-ul există (trebuie să-l creezi manual în Storage UI)
SELECT 'Bucket-ul course-covers trebuie creat manual în Storage UI' as note;

-- 2. Verifică dacă funcția is_admin() există
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_name = 'is_admin'
    ) THEN '✓ Funcția is_admin() există'
    ELSE '✗ Funcția is_admin() NU există - rulează supabase-admin-setup.sql'
  END as status;

-- 3. Verifică dacă utilizatorul curent este admin
SELECT 
  auth.uid() as current_user_id,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.is_admin = true
    ) THEN '✓ Utilizatorul curent ESTE admin'
    ELSE '✗ Utilizatorul curent NU este admin'
  END as admin_status,
  COALESCE(
    (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid()),
    false
  ) as is_admin_value;

-- 4. Verifică policies pentru course-covers
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN policyname LIKE '%course covers%' THEN '✓ Policy există'
    ELSE '✗ Policy lipsește'
  END as status
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%course%cover%'
ORDER BY policyname;

-- 5. Testează funcția is_admin() direct
SELECT 
  public.is_admin() as is_admin_result,
  CASE 
    WHEN public.is_admin() = true THEN '✓ Funcția returnează true'
    ELSE '✗ Funcția returnează false - verifică profiles table'
  END as test_result;

-- 6. Dacă nu ești admin, rulează acest UPDATE (înlocuiește USER_ID)
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE user_id = 'YOUR_USER_ID_HERE';

