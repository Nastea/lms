-- ====== VERIFICĂ STATUS ADMIN ======
-- Rulează acest script pentru a verifica dacă ești admin

-- 1. Vezi user_id-ul tău curent
SELECT 
  auth.uid() as your_user_id,
  'Copiază acest ID pentru pasul următor' as note;

-- 2. Verifică dacă ai profil și dacă ești admin
SELECT 
  p.user_id,
  p.is_admin,
  CASE 
    WHEN p.is_admin = true THEN '✓ Ești admin!'
    WHEN p.user_id IS NOT NULL THEN '✗ Ai profil dar NU ești admin'
    ELSE '✗ Nu ai profil - trebuie să creezi unul'
  END as status
FROM public.profiles p
WHERE p.user_id = auth.uid();

-- 3. Dacă nu ești admin, rulează acest UPDATE (înlocuiește YOUR_USER_ID cu ID-ul de mai sus)
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE user_id = 'YOUR_USER_ID';

-- SAU creează profil nou dacă nu există:
-- INSERT INTO public.profiles (user_id, is_admin)
-- VALUES ('YOUR_USER_ID', true)
-- ON CONFLICT (user_id) 
-- DO UPDATE SET is_admin = true;

-- 4. Testează funcția is_admin()
SELECT 
  public.is_admin() as is_admin_result,
  CASE 
    WHEN public.is_admin() = true THEN '✓ Funcția returnează TRUE - totul e OK!'
    ELSE '✗ Funcția returnează FALSE - trebuie să te setezi ca admin'
  END as test_result;

