# Content verification — Lilia Corporate

Living file. Rule: nothing from „De verificat" or „Nu se publică" goes live as a fact. In development, placeholders are marked `[DE VERIFICAT: …]`.

Ultima actualizare: 3 noiembrie 2026 (livrare, Faza 7)

## ✅ Confirmat (sursă: brief-ul aprobat)
- Brand: „Lilia Dubița | Psihologie aplicată în business"
- Poziționare: „Dezvoltăm oameni, îmbunătățim comunicarea și construim echipe care funcționează mai eficient."
- Diferențiator: „Nu începem cu trainingul. Începem cu echipa."
- Cele 5 etape de colaborare (titluri + descrieri)
- Cele 8 programe (titluri, teme, rezultat dorit) + teme personalizate
- Formate: intensiv 5 h, extins 8 h, modular, workshop lideri, Train the Trainer
- Secvența de învățare în 4 pași
- Mențiunea: harta echipei = analiză organizațională orientativă, nu evaluare clinică

## ⚠️ De verificat înainte de publicare
| Afirmație | Ce trebuie confirmat | Sursă necesară |
|---|---|---|
| Psiholog | Drept de practică / atestat | Lilia |
| Psihoterapeut | Modalitate, școală, asociație | Lilia |
| 14 ani experiență | Anul de referință (site-ul actual spune „peste 13 ani practică privată") | Lilia |
| ~8 ani training corporate | Formulare exactă publicabilă | Lilia |
| „Psihologul Anului 2023" | Organizatorul exact, eventual link/dovadă | Lilia |
| 60% practică / 40% teorie | Regulă fixă sau „predominant practic" | Lilia |
| Romstal, Aviclima, Doctor Romaniuc, Hippocrates, HiSky | Statut (realizat / în curs / prospect), denumire publică exactă, permisiune nume + logo | Lilia + fiecare client |
| Cazul HiSky (31.10.2026, 5 h, „Arta de a instrui…") | Data, durată, temă, număr participanți (opțional), permisiune publicare | Lilia + HiSky |
| Discuția inițială | Gratuită? Durată? Format? Ce urmează? | Lilia |
| Harta echipei | Instrumente folosite, cost, ce primește clientul, condiții GDPR | Lilia |
| Acoperire geografică și limba trainingului | Chișinău / național / online; RO / RU | Lilia |

## 📷 Asset-uri lipsă
| Asset | Stare | Notă |
|---|---|---|
| Originalele ședinței foto, min. 2400 px pe latura lungă | **lipsește** | acum se folosesc fotografii provizorii, comprimate |
| Fotografii reale din traininguri, cu acordul participanților | **lipsește** | fotografia de pe scenă e folosită provizoriu; trebuie confirmat acordul celor din sală |
| Logo-uri clienți | **lipsește** | doar cu permisiune scrisă |
| Wordmark corporate | rezolvat tipografic | „Lilia Dubița” în Newsreader; un logo propriu e opțional |
| Date juridice: Danex Prim SRL, adresă, telefon, email | folosite în footer | IDNO de adăugat dacă e necesar |
| Politica de confidențialitate, secțiunea formularului | redactată | termenul de 2 ani trebuie confirmat juridic |

## ✍️ Copy propus (de aprobat de Lilia; publicat ca text explicativ)
- Eroul: „Traininguri gândite de un psiholog, adaptate companiei dumneavoastră.” + subtitlul ales (aprobat de client, 2 nov)
- „Când trainingul nu e răspunsul”: introducerea, cele 4 exemple, concluzia
- Zonele de competențe: „ce observați” și „ce nu rezolvă un training aici” pentru fiecare zonă
- „De ce un psiholog”: paragraful introductiv
- Întrebările de la etapele procesului („Ce observați în echipă și de când?” etc.)
- FAQ: răspunsurile la „Faceți o diagnoză organizațională?” și „Putem comanda direct un training?”
- Politica de confidențialitate: secțiunea „Formularul de contact pentru companii”, mai ales **termenul de păstrare de 2 ani** (de confirmat juridic)

## 🔒 Ascunse în producție până la validare (status „de-verificat” în `src/content/corporate.ts`)
| Conținut | Ce trebuie |
|---|---|
| Explorarea situațiilor: cauze posibile + întrebări, pentru toate cele 7 situații | Lilia validează sau corectează ciorna. Până atunci, în producție apar doar „Răspunsuri posibile” și butonul |
| Etapa 1 „Ce primiți”: „O primă lectură a situației și propunerea pasului următor” | Lilia confirmă ce primește clientul după discuția inițială |
| Etapa 2 „Cum”: discuții cu managementul și echipa | Metodele efective ale analizei nevoilor |
| Etapa 5 „După”: revenire la câteva săptămâni | Există follow-up? |
| FAQ „Discuția inițială e gratuită?” și „Cât costă?” | Răspunsurile Liliei |
| FAQ „Ce se întâmplă cu informațiile despre angajați?” | Confirmarea regulii „concluzii la nivel de echipă” |

## 🚫 Nu se publică încă
- Orice rezultat, testimonial sau cifră pentru HiSky până la feedback verificat
- Orice client fără confirmarea statutului și permisiune
- Orice certificare/acreditare care nu e în lista confirmată
- Procentul 60/40 ca promisiune fixă, până la confirmare

## ✅ Lista de verificare înainte de lansare
- [ ] Lilia a citit pagina cu `NEXT_PUBLIC_SHOW_PENDING=1` și a confirmat sau corectat fiecare `[DE VERIFICAT]`
- [ ] Statusurile confirmate schimbate în `src/content/corporate.ts`
- [ ] `CORPORATE_LEADS_TO` setat în Vercel; formular de test primit
- [ ] Acordul participanților din fotografia de pe scenă
- [ ] Termenul de păstrare a datelor (2 ani) confirmat
- [ ] Nicio afirmație din „Nu se publică încă” nu apare pe pagină
