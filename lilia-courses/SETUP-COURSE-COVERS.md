# Setup Course Cover Images

## Pasul 1: Creează bucket-ul în Supabase

1. Mergi la **Supabase Dashboard** → **Storage**
2. Click pe **"New bucket"**
3. Nume: `course-covers`
4. **Public bucket**: ✅ ON (pentru MVP)
5. Click **"Create bucket"**

## Pasul 2: Rulează policies SQL

1. Mergi la **Supabase Dashboard** → **SQL Editor**
2. Deschide fișierul `supabase-course-covers-policies.sql`
3. Copiază tot conținutul
4. Rulează în SQL Editor
5. Verifică că nu sunt erori

## Pasul 3: Verifică că ești admin

Rulează în SQL Editor pentru a verifica:

```sql
-- Verifică dacă utilizatorul curent este admin
SELECT 
  auth.uid() as user_id,
  p.is_admin,
  p.user_id
FROM public.profiles p
WHERE p.user_id = auth.uid();
```

Dacă nu apare niciun rezultat sau `is_admin` este `false`, setează-te ca admin:

```sql
-- Înlocuiește USER_ID cu ID-ul tău de utilizator din auth.users
-- Poți găsi ID-ul în Supabase → Authentication → Users

INSERT INTO public.profiles (user_id, is_admin)
VALUES ('YOUR_USER_ID_HERE', true)
ON CONFLICT (user_id) 
DO UPDATE SET is_admin = true;
```

## Pasul 4: Verifică că bucket-ul are RLS activat

1. Mergi la **Storage** → **course-covers**
2. Click pe **"Policies"** tab
3. Verifică că există 3 policies:
   - `admin upload course covers` (INSERT)
   - `admin update course covers` (UPDATE)
   - `admin delete course covers` (DELETE)

## Debug: Testează manual

Rulează în SQL Editor pentru a testa funcția `is_admin()`:

```sql
-- Testează funcția is_admin()
SELECT public.is_admin() as is_admin;
```

Ar trebui să returneze `true` dacă ești admin.

## Dacă tot nu funcționează

Verifică că funcția `is_admin()` există:

```sql
-- Verifică dacă funcția există
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'is_admin';
```

Dacă nu există, rulează `supabase-admin-setup.sql` din nou.

