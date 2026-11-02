// Conținutul paginii principale corporate (liliadubita.md/) — Modelul B:
// nu vindem traininguri dintr-un catalog, ci înțelegerea echipei și intervenții potrivite.
// Regula: orice afirmație neconfirmată are status "de-verificat" și NU apare în producție,
// decât dacă NEXT_PUBLIC_SHOW_PENDING=1 (atunci apare marcată vizibil).
// Lista de verificat: docs/lilia-corporate/content-verification.md (proiectul relatia-360-landing).

export type Status = 'confirmat' | 'de-verificat';

export const showPending = process.env.NEXT_PUBLIC_SHOW_PENDING === '1';
export const visible = (s: Status) => s === 'confirmat' || showPending;

export const brand = {
  name: 'Lilia Dubița',
  tagline: 'Psihologie aplicată în business',
  positioning: 'Dezvoltăm oameni, îmbunătățim comunicarea și construim echipe care funcționează mai eficient.',
};

export const CTA = 'Solicită o discuție inițială';

export const hero = {
  title: 'Traininguri gândite de un psiholog, adaptate companiei dumneavoastră.',
  lead: 'Înainte de orice training, înțelegem ce se întâmplă în echipă: cum comunică oamenii, unde se blochează și ce competențe le lipsesc.',
  secondaryCta: 'Vedeți cum lucrăm',
  who: 'Lilia Dubița, psiholog cu peste 13 ani de practică.',
};

// ——— Explorarea situațiilor (selectorul) ———
// Nu e o evaluare: deschide o discuție. Cauzele și întrebările sunt conținut de expertiză
// propus și trebuie validat de Lilia (status "de-verificat" până atunci).

export type ZoneId = 'comunicare' | 'tensiune' | 'conducere' | 'client' | 'eficienta';

export type Situation = {
  text: string;
  causes: string[];
  questions: string[];
  zones: ZoneId[];
  organisational: string; // ce poate ține de organizare, nu de training
  status: Status;
};

export const situations: Situation[] = [
  {
    text: 'Angajații comunică dificil între departamente.',
    causes: [
      'obiective diferite între departamente, nediscutate deschis',
      'responsabilități neclare la granița dintre echipe',
      'prea multe canale de comunicare, folosite inconsecvent',
      'deprinderi de comunicare: ascultare, feedback, claritate',
    ],
    questions: ['Unde se pierde informația cel mai des?', 'De când apar neînțelegerile și ce s-a schimbat atunci?', 'Cine decide când două departamente nu sunt de acord?'],
    zones: ['comunicare'],
    organisational: 'clarificarea rolurilor și a fluxurilor de lucru dintre departamente',
    status: 'de-verificat',
  },
  {
    text: 'Conflictele consumă timp și energie.',
    causes: [
      'responsabilități neclare între roluri',
      'presiune de termene sau lipsă de resurse',
      'stiluri de comunicare diferite sub stres',
      'conflicte vechi, lăsate nerezolvate',
      'felul în care intervine managerul',
    ],
    questions: ['Între cine apar conflictele?', 'Se repetă aceleași subiecte?', 'Cum se încheie acum un conflict?'],
    zones: ['tensiune', 'conducere'],
    organisational: 'redistribuirea sarcinilor sau a resurselor, dacă presiunea e cauza',
    status: 'de-verificat',
  },
  {
    text: 'Managerii evită conversațiile dificile.',
    causes: [
      'lipsa unor modele concrete pentru feedback dificil',
      'teama de a strica relația cu echipa',
      'manageri promovați din echipă, fără pregătire pentru rol',
      'puțin sprijin din partea conducerii pentru decizii incomode',
    ],
    questions: ['Ce conversații se amână cel mai des?', 'Ce se întâmplă după ce un manager spune ceva incomod?', 'Au primit managerii pregătire pentru rolul lor?'],
    zones: ['conducere'],
    organisational: 'claritate asupra a ce așteaptă conducerea de la manageri și sprijin pentru deciziile lor',
    status: 'de-verificat',
  },
  {
    text: 'Echipele întâmpină dificultăți în relația cu clienții.',
    causes: [
      'nevoile clientului nu sunt înțelese până la capăt',
      'presiune pe rezultate care împinge spre vânzare agresivă',
      'reguli interne care îi lasă pe angajați fără soluții',
      'oboseală acumulată în contactul cu clienți dificili',
    ],
    questions: ['În ce momente se tensionează discuția cu clientul?', 'Ce pot decide angajații singuri?', 'După ce sunt evaluați?'],
    zones: ['client', 'tensiune'],
    organisational: 'revizuirea regulilor care limitează soluțiile oferite clientului',
    status: 'de-verificat',
  },
  {
    text: 'Schimbările organizaționale generează rezistență.',
    causes: [
      'schimbarea nu a fost explicată: de ce și ce urmează',
      'teama de a pierde statut, siguranță sau obiceiuri',
      'prea multe schimbări într-un timp scurt',
      'managerii au aflat odată cu echipa',
    ],
    questions: ['Cum a fost anunțată schimbarea?', 'Ce pierd oamenii, din punctul lor de vedere?', 'Cine o susține și cine nu?'],
    zones: ['conducere', 'comunicare'],
    organisational: 'un plan de comunicare a schimbării și implicarea managerilor de la început',
    status: 'de-verificat',
  },
  {
    text: 'Angajații se confruntă cu stres și suprasolicitare.',
    causes: [
      'volum de muncă mai mare decât resursele',
      'priorități care se schimbă des',
      'lipsa pauzelor și a limitelor clare',
      'puține resurse personale de gestionare a stresului',
    ],
    questions: ['Suprasolicitarea e permanentă sau apare în anumite perioade?', 'Ce s-a schimbat în volumul de muncă?', 'Ce se întâmplă când cineva spune că nu mai poate?'],
    zones: ['tensiune', 'eficienta'],
    organisational: 'dacă volumul depășește resursele, e nevoie de redistribuire sau de oameni, nu doar de training',
    status: 'de-verificat',
  },
  {
    text: 'Trainerii interni nu reușesc întotdeauna să transmită informația eficient.',
    causes: [
      'specialiști foarte buni, fără pregătire de formator',
      'materiale prea încărcate de informație',
      'sesiuni fără exerciții și fără feedback',
      'prea puțin timp alocat pregătirii',
    ],
    questions: ['Cum arată o sesiune internă obișnuită?', 'Ce rețin participanții după o săptămână?', 'Cât timp au trainerii pentru pregătire?'],
    zones: ['eficienta'],
    organisational: 'timp alocat pentru pregătirea sesiunilor interne',
    status: 'de-verificat',
  },
];

export const explorerNote = 'Acesta nu este un diagnostic. E un punct de plecare pentru o discuție.';

// ——— Cum lucrăm (capitolul central) ———

export type StageItem = { label: string; text: string; status: Status };

export const approach = {
  title: 'Nu începem cu trainingul. Începem cu echipa.',
  intro: 'Aceeași problemă poate avea cauze diferite în două companii. De aceea recomandăm o intervenție abia după ce înțelegem ce se întâmplă la dumneavoastră.',
  stages: [
    {
      title: 'Discuția inițială',
      text: 'Vorbim cu conducerea sau cu HR despre ce observați și ce ar însemna, pentru dumneavoastră, o schimbare reușită.',
      ask: ['Ce observați în echipă și de când?', 'Ce ați încercat deja?'],
      items: [
        { label: 'Ce primiți', text: 'O primă lectură a situației și propunerea pasului următor.', status: 'de-verificat' },
        { label: 'Ce nu este', text: 'O diagnoză a organizației. O discuție nu ajunge pentru asta.', status: 'confirmat' },
      ] as StageItem[],
    },
    {
      title: 'Înțelegerea echipei',
      text: 'Conturăm harta psihologică și de comunicare a echipei: punctele forte, dificultățile de comunicare și zonele de dezvoltare.',
      ask: ['Unde se blochează lucrurile, concret?', 'Ce competențe lipsesc și ce ține de organizarea muncii?'],
      items: [
        { label: 'Cum', text: 'Discuții cu managementul și, cu acordul organizației, cu membrii echipei. Metodele le stabilim împreună.', status: 'de-verificat' },
        { label: 'Ce nu este', text: 'O evaluare psihologică clinică. Chestionarele sau discuțiile individuale se folosesc doar cu acordul părților, cu respectarea confidențialității și a protecției datelor.', status: 'confirmat' },
      ] as StageItem[],
    },
    {
      title: 'Recomandări',
      text: 'Spunem ce competențe merită dezvoltate, la cine și în ce ordine. Și spunem deschis ce ține de organizarea muncii, nu de training.',
      ask: [],
      items: [] as StageItem[],
    },
    {
      title: 'Intervenția',
      text: 'Un training, un workshop pentru lideri, un program modular sau Train the Trainer, construite pe ce am aflat despre echipă.',
      ask: [],
      items: [] as StageItem[],
    },
    {
      title: 'Aplicarea',
      text: 'Recomandări și instrumente pentru a folosi ce s-a învățat în activitatea de zi cu zi.',
      ask: [],
      items: [
        { label: 'După', text: 'O revenire la câteva săptămâni, pentru a vedea ce se aplică și ce nu.', status: 'de-verificat' },
      ] as StageItem[],
    },
  ],
};

export const boundaries = {
  title: 'Când trainingul nu e răspunsul',
  intro: 'Unele dificultăți din echipă nu țin de competențele oamenilor, ci de felul în care e organizată munca. Un training nu le rezolvă, iar a pretinde contrariul ar fi o risipă pentru companie.',
  examples: [
    'Oamenii sunt suprasolicitați pentru că sunt prea puțini pentru volumul de muncă.',
    'Nimeni nu știe exact cine răspunde de o sarcină.',
    'Regulile interne îi împiedică pe angajați să rezolve problema clientului.',
    'Schimbările vin prea des ca să poată fi integrate.',
  ],
  close: 'Când vedem astfel de cauze, vi le spunem și vă propunem ce poate schimba managementul. Trainingul vine, dacă e cazul, ca sprijin, nu ca înlocuitor.',
};

// ——— Intervenții: competențe pe zone (fostele 8 programe) ———

export type ProgramId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Program = {
  id: ProgramId;
  title: string;
  audience: string;
  develops: string[];
  outcome: string;
  care?: string;
};

export const programs: Program[] = [
  { id: 1, title: 'Comunicare eficientă și colaborare în echipă', audience: 'echipe și departamente care lucrează împreună zilnic',
    develops: ['ascultarea activă', 'feedbackul constructiv', 'comunicarea asertivă', 'comunicarea între departamente', 'asumarea responsabilității și prevenirea neînțelegerilor'],
    outcome: 'Mai multă claritate în comunicare și o colaborare mai bună.' },
  { id: 2, title: 'Gestionarea conflictelor și comunicarea în criză', audience: 'echipe cu tensiuni și angajați în contact cu clienți dificili',
    develops: ['comunicarea în situații tensionate', 'gestionarea reclamațiilor', 'de-escaladarea verbală', 'lucrul cu clienți dificili', 'rezolvarea conflictelor interne'],
    outcome: 'Reacții mai profesioniste în situații dificile.' },
  { id: 3, title: 'Psihologia vânzărilor și relația cu clientul', audience: 'echipe de vânzări și relații cu clienții',
    develops: ['vânzarea directă și telefonică', 'înțelegerea nevoilor clientului', 'persuasiunea etică', 'lucrul cu obiecțiile și negocierea', 'fidelizarea clienților'],
    outcome: 'Interacțiuni mai eficiente cu clienții.' },
  { id: 4, title: 'Leadership și psihologia managementului', audience: 'manageri, coordonatori și lideri de echipă',
    develops: ['stilurile de leadership', 'motivarea echipei', 'delegarea și responsabilizarea', 'luarea deciziilor', 'gestionarea rezistenței la schimbare și conversațiile dificile'],
    outcome: 'Competențe mai solide de management și de dezvoltare a oamenilor.' },
  { id: 5, title: 'Psihologia generațiilor și dinamica echipelor', audience: 'echipe mixte ca vârstă și experiență',
    develops: ['înțelegerea așteptărilor diferite', 'stilurile de lucru', 'motivația', 'comunicarea între generații'],
    outcome: 'O colaborare mai bună între grupuri diferite de angajați.',
    care: 'Lucrăm cu tendințe observate la nivel de grup, nu cu etichete pentru persoane.' },
  { id: 6, title: 'Burnout, stres și inteligență emoțională', audience: 'echipe care lucrează sub presiune constantă',
    develops: ['înțelegerea stresului profesional', 'reglarea emoțională', 'resursele psihologice', 'limitele sănătoase', 'prevenirea burnoutului'],
    outcome: 'Abilități mai bune de gestionare a stresului și de reglare emoțională.' },
  { id: 7, title: 'Managementul timpului și eficiență personală', audience: 'angajați și manageri cu multe sarcini în paralel',
    develops: ['planificarea și prioritățile', 'concentrarea', 'lucrul cu procrastinarea', 'gestionarea energiei', 'organizarea sarcinilor'],
    outcome: 'Prioritizare și gestionare a timpului mai bune.' },
  { id: 8, title: 'Train the Trainer: arta de a instrui', audience: 'traineri interni și cei care își instruiesc colegii',
    develops: ['storytellingul', 'vorbitul în public', 'captarea atenției și memorarea', 'feedbackul', 'metodele de instruire și facilitarea grupurilor'],
    outcome: 'Traineri care transmit informația clar și memorabil.' },
];

export type Zone = { id: ZoneId; title: string; observe: string; programs: ProgramId[]; limit: string };

export const zones: Zone[] = [
  { id: 'comunicare', title: 'Comunicare și colaborare', observe: 'Informația se pierde, departamentele sau generațiile diferite nu se înțeleg.', programs: [1, 5],
    limit: 'Dacă rolurile și fluxurile de lucru nu sunt clare, le clarificăm întâi cu managementul.' },
  { id: 'tensiune', title: 'Tensiune și presiune', observe: 'Conflicte care se repetă, reacții impulsive, oboseală.', programs: [2, 6],
    limit: 'Un training nu reduce volumul de muncă. Dacă suprasolicitarea e structurală, o spunem deschis.' },
  { id: 'conducere', title: 'Conducerea oamenilor', observe: 'Conversații amânate, delegare greoaie, rezistență la schimbare.', programs: [4],
    limit: 'Managerii au nevoie și de claritate despre ce așteaptă conducerea de la ei.' },
  { id: 'client', title: 'Relația cu clientul', observe: 'Discuții cu clienții care nu duc la rezultat sau se tensionează.', programs: [3],
    limit: 'Dacă regulile interne nu le permit angajaților să rezolve, comunicarea singură nu ajunge.' },
  { id: 'eficienta', title: 'Eficiență și transfer de cunoștințe', observe: 'Priorități amestecate; cunoștințele nu ajung de la cei care știu la cei care învață.', programs: [7, 8],
    limit: 'Trainerii interni au nevoie și de timp alocat pentru pregătire.' },
];

export const interventions = {
  title: 'Competențe pe care le dezvoltăm',
  intro: 'Când înțelegerea echipei arată că e nevoie de dezvoltarea unor competențe, construim intervenția pe ce am aflat. Acestea sunt zonele în care lucrăm cel mai des.',
  customTopics: 'Lucrăm și pe teme specifice: etică profesională, tipare comportamentale, motivație și responsabilitate, adaptarea la schimbare, încredere și inițiativă, comunicarea în mediul medical, standarde de servire a clienților, cultură organizațională.',
};

export const formats = [
  { name: 'Training intensiv', duration: '5 ore', fit: 'Echipe cu un obiectiv specific' },
  { name: 'Training extins', duration: '8 ore', fit: 'Dezvoltarea mai aprofundată a competențelor' },
  { name: 'Program modular', duration: 'Mai multe sesiuni', fit: 'Dezvoltare continuă, cu aplicare între sesiuni' },
  { name: 'Workshop pentru lideri', duration: 'Personalizat', fit: 'Manageri, lideri și coordonatori' },
  { name: 'Train the Trainer', duration: 'Personalizat', fit: 'Traineri interni și cei care își instruiesc colegii' },
];

export const method = {
  title: 'Mai puțină teorie. Mai multă aplicabilitate.',
  intro: 'Când trainingul e răspunsul potrivit, participanții lucrează pe situațiile lor, nu pe exemple din manual.',
  sequence: [
    { title: 'O situație profesională reală', text: 'O discuție cu un client, o ședință tensionată, o sarcină delegată prost.' },
    { title: 'Simulare și analiză psihologică', text: 'Situația se joacă în sală, apoi analizăm ce a declanșat reacțiile și de ce.' },
    { title: 'Un comportament alternativ', text: 'Un model de comunicare sau un alt mod de a răspunde, explicat simplu.' },
    { title: 'Repetiție, feedback, aplicare', text: 'Se exersează până devine natural și se stabilește cum se aplică la locul de muncă.' },
  ],
  sources: 'Folosim principii din comunicarea aplicată, învățarea experiențială, abordarea cognitiv-comportamentală și exerciții de reglare emoțională.',
  ratio: { text: '60% practică: simulări, exerciții, joc de rol și feedback. 40% fundament teoretic.', status: 'de-verificat' as Status },
};

export const directPath = {
  title: 'Știți deja ce training vă trebuie?',
  intro: 'Spuneți-ne tema și formatul. Îl adaptăm după o scurtă discuție despre echipă.',
  cta: 'Cereți o propunere pentru un training',
};

// ——— Credibilitate ———

export const about = {
  title: 'De ce un psiholog',
  why: 'Dificultățile dintr-o echipă sunt, de cele mai multe ori, despre oameni: cum percep o situație, cum reacționează sub presiune, ce îi motivează și ce îi blochează. Un psiholog le poate recunoaște și poate lucra cu ele, fără să le reducă la reguli de comunicare.',
  bio: [
    { text: 'Lilia Dubița este psiholog și lucrează de peste 13 ani în practică privată cu oameni, relații și comunicare.', status: 'confirmat' as Status },
    { text: 'În companii aduce aceeași atenție la ce se întâmplă între oameni, împreună cu instrumente practice pe care echipele le pot folosi a doua zi.', status: 'confirmat' as Status },
  ],
  credentials: [
    { text: 'Psiholog', status: 'confirmat' as Status },
    { text: 'Psihoterapeut', status: 'de-verificat' as Status },
    { text: 'Trainer și educator', status: 'de-verificat' as Status },
    { text: '14 ani de experiență în psihologie și dezvoltare umană', status: 'de-verificat' as Status },
    { text: 'Aproximativ 8 ani de training corporate și organizațional', status: 'de-verificat' as Status },
    { text: 'Premiul „Psihologul Anului 2023”', status: 'de-verificat' as Status },
  ],
};

export const organizations: { name: string; status: Status }[] = [
  { name: 'Romstal', status: 'de-verificat' },
  { name: 'Aviclima', status: 'de-verificat' },
  { name: 'Doctor Romaniuc', status: 'de-verificat' },
  { name: 'Hippocrates', status: 'de-verificat' },
  { name: 'HiSky', status: 'de-verificat' },
];

export type CaseStudy = {
  client: string;
  title: string;
  context: string;
  understood: string; // ce am înțeles
  intervention: string;
  methods: string;
  results: string | null; // null = în curs de colectare; nu se inventează
  status: Status;
};

export const caseStudies: CaseStudy[] = [
  {
    client: 'HiSky',
    title: 'Dezvoltarea competențelor trainerilor interni',
    context: 'Training de 5 ore, 31 octombrie 2026: „Arta de a instrui: comunicare, storytelling și memorare”.',
    understood: 'Provocarea era transmiterea materialelor de instruire într-un mod clar, captivant și ușor de reținut.',
    intervention: 'Training practic despre storytelling, atenție, memorare, feedback și metode de instruire.',
    methods: 'Simulări, exerciții de prezentare, lucru în echipă și demonstrații practice.',
    results: null,
    status: 'de-verificat',
  },
];

export const faq: { q: string; a: string; status: Status }[] = [
  { q: 'Discuția inițială este gratuită?', a: '[Răspunsul Liliei: gratuită sau nu, durata, online sau la sediu.]', status: 'de-verificat' },
  { q: 'Faceți o diagnoză organizațională?', a: 'Nu în sensul unei evaluări clinice sau al unui audit complet. Facem o analiză orientativă a comunicării și a nevoilor de dezvoltare din echipă, cu metode stabilite împreună cu dumneavoastră.', status: 'confirmat' },
  { q: 'Putem comanda direct un anumit training?', a: 'Da. Dacă știți deja ce vă trebuie, ne spuneți tema și formatul, iar noi îl adaptăm după o scurtă discuție despre echipă.', status: 'confirmat' },
  { q: 'Ce se întâmplă cu informațiile despre angajați?', a: 'Discuțiile individuale și chestionarele se folosesc doar cu acordul părților și rămân confidențiale. Concluziile se prezintă la nivel de echipă, nu despre persoane.', status: 'de-verificat' },
  { q: 'Cât costă?', a: '[Răspunsul Liliei: cum se stabilește prețul.]', status: 'de-verificat' },
];

export const contact = {
  title: 'Să înțelegem împreună ce se întâmplă în echipă.',
  intro: 'Spuneți-ne pe scurt ce observați. Vă contactăm pentru o primă discuție despre situație, obiective și pașii potriviți.',
  next: [
    { text: 'Vă contactăm pentru a stabili discuția inițială.', status: 'confirmat' as Status },
    { text: 'Discutăm cu managementul sau HR despre ce observați.', status: 'confirmat' as Status },
    { text: 'Vă propunem pasul următor: înțelegerea echipei, o intervenție, sau ambele.', status: 'confirmat' as Status },
  ],
  participants: ['până la 10', '10–20', '20–50', 'peste 50', 'încă nu știm'],
  intents: ['Nu încă, vrem să înțelegem situația', 'Un training pe o temă anume', 'Workshop pentru lideri', 'Program modular', 'Train the Trainer'],
};

export const company = {
  legalName: 'Danex Prim SRL',
  address: 'mun. Chișinău, sec. Buiucani, str. Calea Ieșilor, 11',
  phone: '067102290',
  email: 'danexprim@liliadubita.md',
};
