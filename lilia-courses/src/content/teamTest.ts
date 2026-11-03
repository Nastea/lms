// Testul „Cum comunică echipa dumneavoastră?” — ciornă, de validat de Lilia.
// Cât timp status e "de-verificat", pagina există doar în preview (NEXT_PUBLIC_SHOW_PENDING=1).
import type { Status } from './corporate';

export type DimensionId = 'A' | 'B' | 'C' | 'D';

export const teamTest = {
  status: 'de-verificat' as Status,
  slug: 'comunicare-echipa',
  title: 'Cum comunică echipa dumneavoastră?',
  intro:
    'Un test de 3 minute pentru manageri, lideri de echipă și HR. Douăsprezece afirmații despre ce se întâmplă, concret, în echipă. La final vedeți unde comunicarea funcționează și unde merită atenție.',
  instruction: 'Gândiți-vă la ultimele două-trei luni din echipa dumneavoastră. Cât de des se întâmplă următoarele?',
  note: 'Acesta este un instrument de reflecție, nu o evaluare psihologică. Rezultatul arată percepția dumneavoastră, nu un diagnostic al echipei.',
  scale: ['Rar sau deloc', 'Uneori', 'Des', 'Aproape mereu'],
};

export const dimensions: Record<DimensionId, string> = {
  A: 'Claritate și informație',
  B: 'Feedback și siguranța de a vorbi',
  C: 'Tensiuni și conflicte',
  D: 'Colaborare între roluri și departamente',
};

// Ordinea de pe ecran amestecă dimensiunile, ca grupele să nu se vadă.
export const statements: { text: string; dim: DimensionId; reversed?: boolean }[] = [
  { dim: 'A', text: 'Oamenii știu clar cine decide și cine răspunde de fiecare sarcină.' },
  { dim: 'B', text: 'Colegii spun deschis când nu sunt de acord, inclusiv în fața managerului.' },
  { dim: 'C', text: 'Aceleași neînțelegeri revin, fără să se rezolve.', reversed: true },
  { dim: 'D', text: 'Colegii din echipe diferite își cer ajutorul direct, fără să treacă prin conducere.' },
  { dim: 'A', text: 'Informațiile importante ajung la timp la toți cei care au nevoie de ele.' },
  { dim: 'B', text: 'Feedbackul, și cel critic, se dă direct persoanei, nu pe la spate.' },
  { dim: 'C', text: 'Când apare un conflict, cei implicați îl discută în câteva zile.' },
  { dim: 'D', text: 'Când ceva nu merge, se caută mai întâi cine e de vină.', reversed: true },
  { dim: 'A', text: 'După o ședință, toți pleacă cu aceeași înțelegere despre ce urmează.' },
  { dim: 'B', text: 'Greșelile se recunosc devreme, fără teama de a fi blamat.' },
  { dim: 'C', text: 'Sub presiune, tonul devine tăios sau oamenii se retrag.', reversed: true },
  { dim: 'D', text: 'Oamenii înțeleg cum munca lor influențează alte echipe.' },
];

export type Profile = {
  title: string;
  seen: string;
  behind?: string;
  question: string;
  know: { label: string; text: string };
  programs: string[];
};

export const profiles: Record<DimensionId | 'all', Profile> = {
  A: {
    title: 'Toată lumea muncește, dar informația se pierde',
    seen: 'Sarcini făcute de două ori sau deloc, ședințe după care fiecare a înțeles altceva, întrebarea „cine trebuia să se ocupe?”.',
    behind: 'Roluri și responsabilități neclare, prea multe canale, decizii luate fără să fie comunicate mai departe.',
    question: 'Ce informație v-a lipsit ultima dată când ceva a mers greu?',
    know: { label: 'Ce merită știut', text: 'Uneori nu e o problemă de comunicare, ci de organizare. Clarificarea rolurilor vine înaintea oricărui training.' },
    programs: ['Comunicare eficientă și colaborare în echipă'],
  },
  B: {
    title: 'Echipa politicoasă',
    seen: 'Ședințe liniștite, acord aparent, dar nemulțumiri spuse pe hol; problemele se află târziu.',
    behind: 'Teama de conflict sau de consecințe, feedback care în trecut a costat, un manager care decide repede și închide discuția.',
    question: 'Ce ar trebui să se schimbe ca să spunem mai ușor când nu suntem de acord?',
    know: { label: 'Ce merită știut', text: 'Tăcerea nu înseamnă acord. Siguranța de a vorbi se construiește mai ales prin felul în care managerul reacționează la vești proaste.' },
    programs: ['Comunicare eficientă și colaborare în echipă', 'Leadership și psihologia managementului'],
  },
  C: {
    title: 'Echipa sub tensiune',
    seen: 'Aceleași conflicte care revin, reacții tăioase sub presiune, colegi care se evită.',
    behind: 'Presiune de termene sau lipsă de resurse, conflicte vechi nerezolvate, lipsa unui mod comun de a discuta dezacordurile.',
    question: 'Ce subiect revine mereu și n-a fost niciodată discutat până la capăt?',
    know: { label: 'Ce merită știut', text: 'Dacă tensiunea vine din volumul de muncă, un training o reduce doar parțial; e nevoie și de decizii de organizare.' },
    programs: ['Gestionarea conflictelor și comunicarea în criză', 'Burnout, stres și inteligență emoțională'],
  },
  D: {
    title: 'Insulele',
    seen: 'Fiecare echipă își face bine partea, dar între echipe apar blocaje; problemele urcă la conducere ca să fie rezolvate.',
    behind: 'Obiective diferite între departamente, granițe de responsabilitate neclare, o cultură în care greșeala se caută la alții.',
    question: 'Ce ar trebui să știe celălalt departament despre munca noastră ca să ne fie mai ușor tuturor?',
    know: { label: 'Ce merită știut', text: 'Colaborarea între echipe depinde mult de obiective comune, nu doar de bunăvoință.' },
    programs: ['Comunicare eficientă și colaborare în echipă', 'Psihologia generațiilor și dinamica echipelor'],
  },
  all: {
    title: 'Echipa care vorbește',
    seen: 'Oamenii știu ce au de făcut, își spun deschis părerea și rezolvă dezacordurile între ei.',
    question: 'Ce facem bine și n-ar trebui să pierdem când echipa crește sau se schimbă?',
    know: { label: 'Ce merită păstrat', text: 'Obiceiurile care au dus aici: ședințe clare, feedback direct, un manager care ascultă.' },
    programs: ['Leadership și psihologia managementului', 'Train the Trainer: arta de a instrui'],
  },
};

export const STRONG = 10;
export const WATCH = 7;
// La egalitate, tensiunea și tăcerea costă cel mai mult.
const PRIORITY: DimensionId[] = ['C', 'B', 'A', 'D'];

export const level = (score: number) => (score >= STRONG ? 'Punct forte' : score >= WATCH ? 'De urmărit' : 'Zonă de atenție');

// answers[i] = 0..3 (indexul din scală) pentru afirmația i.
export function scoreTest(answers: number[]) {
  const scores: Record<DimensionId, number> = { A: 0, B: 0, C: 0, D: 0 };
  statements.forEach((s, i) => {
    const v = answers[i] + 1;
    scores[s.dim] += s.reversed ? 5 - v : v;
  });
  const min = Math.min(...Object.values(scores));
  const key: DimensionId | 'all' = min >= STRONG ? 'all' : PRIORITY.find((d) => scores[d] === min)!;
  return { scores, key, profile: profiles[key] };
}
