# Configurare email invitație Supabase (română, de la cursuri@liliadubita.md)

Pentru ca invitațiile după plată să sosească în română, de la **cursuri@liliadubita.md**, și ca linkul din email să ducă la site-ul live (nu la localhost), configurează în **Supabase Dashboard** următoarele.

---

## 1. URL-uri (de ce apărea localhost în email și link expirat)

Dacă în email vezi „platforma http://localhost:3000” sau linkul din email te duce la **localhost** sau la **/conflicte** și apoi „Link invalid sau expirat”, în Supabase este setat încă **Site URL** la localhost și/sau **Redirect URL** la /conflicte.

- **Authentication** → **URL Configuration**
- **Site URL**: pune URL-ul de producție, ex. `https://www.liliadubita.md`  
  (acest URL apare în linkul din email; dacă e `http://localhost:3000`, linkul va duce la localhost.)
- **Redirect URLs**: adaugă:
  - `https://www.liliadubita.md/login`
  - `https://www.liliadubita.md/auth/callback` (dacă folosești un callback dedicat)

După salvare, noile invitații vor conține link către site-ul live și după acceptare utilizatorul va fi redirecționat la `/login` (apoi în app).

---

## 2. Email trimis de la cursuri@liliadubita.md (SMTP custom)

- **Project Settings** (roata din stânga jos) → **Auth** → **SMTP Settings**
- Activează **Custom SMTP** și completează cu datele pentru **cursuri@liliadubita.md**.

Opțiuni frecvente:

- **Cont de email pe domeniu** (ex. la hostingu liliadubita.md): folosești SMTP-ul furnizat de host (server, port 587/465, utilizator = cursuri@liliadubita.md, parolă).
- **Serviciu de email transacțional** care permite „From” personalizat:
  - **Resend**: verifici domeniul liliadubita.md și pui ca „From” cursuri@liliadubita.md; Resend oferă SMTP sau API.
  - **Brevo (Sendinblue)**, **SendGrid**, **Postmark** etc.: la fel, verifici domeniul și setezi expeditorul la cursuri@liliadubita.md.

În Supabase completezi:

- **Sender email**: `cursuri@liliadubita.md`
- **Sender name** (opțional): ex. „Lilia Dubița – Cursuri”
- **Host / Port / User / Password**: conform serviciului ales.

Fără SMTP custom, Supabase trimite de la `noreply@mail.app.supabase.io`.

---

## 3. Conținutul emailului în română (template Invite)

- **Authentication** → **Email Templates** → alege **Invite**.

Poți folosi variabilele Supabase, ex. `{{ .ConfirmationURL }}` (linkul de acceptare invitație), `{{ .Email }}`, `{{ .Data }}` (metadata, ex. nume).

**Exemplu subiect:**

```text
Ai fost invitat(ă) la cursul „De la conflict la conectare”
```

**Exemplu corp (simplu, în română):**

```html
<p>Bună ziua,</p>
<p>Ai achiziționat accesul la cursul <strong>De la conflict la conectare</strong> (RELAȚIA 360).</p>
<p>Apasă linkul de mai jos pentru a-ți seta parola și a accesa platforma:</p>
<p><a href="{{ .ConfirmationURL }}">Accept invitația și accesez cursul</a></p>
<p>Linkul este valabil 24 de ore. Dacă nu ai făcut tu această înscriere, poți ignora acest email.</p>
<p>Cu drag,<br>Echipa Lilia Dubița</p>
```

Salvezi template-ul. Toate invitațiile trimise după plată vor folosi acest subiect și acest conținut, de la cursuri@liliadubita.md (dacă SMTP e configurat ca mai sus).

---

## 4. Variantă alternativă: utilizator cu parolă temporară

În loc de „invite” (link magic), poți:

- Crea utilizatorul în Supabase cu o parolă temporară (din API: `createUser` + parolă).
- Trimite un email propriu (de la cursuri@liliadubita.md, prin Resend/SMTP) în română: „Te-ai înscris la curs. Date de autentificare: email + parolă temporară. Te rugăm să te autentifici și să îți schimbi parola.”

Această variantă necesită: API care creează user cu parolă, trimitere email custom (template în română) și, opțional, flux „schimbă parola la prima autentificare” în app. O poți implementa ulterior dacă renunți la flow-ul de invite.

---

## Rezumat

| Ce vrei | Unde (Supabase) |
|--------|-------------------|
| Link în email către site live | **URL Configuration** → Site URL = `https://www.liliadubita.md`, Redirect URLs = `/login` (și `/auth/callback` dacă e cazul) |
| Email de la cursuri@liliadubita.md | **Auth** → **SMTP Settings** → Custom SMTP cu cursuri@liliadubita.md |
| Text în română, specific cursului | **Authentication** → **Email Templates** → **Invite** (subiect + corp ca mai sus) |

După ce creezi contul **cursuri@liliadubita.md** și obții SMTP (sau configurezi un serviciu cu domeniu verificat), completezi SMTP în Supabase și refaci un test de invitație; emailul ar trebui să sosească în română, de la cursuri@liliadubita.md, cu link corect către site-ul live.
