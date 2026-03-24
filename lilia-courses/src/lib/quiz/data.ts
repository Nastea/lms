import type { QuizDefinition } from "./types";

export const QUIZ_1: QuizDefinition = {
  id: "quiz-1",
  slug: "de-ce-nu-te-aude-partenerul",
  shortId: "aude",
  title: "De ce nu te aude partenerul?",
  description: "Află clar ce blochează comunicarea dintre voi.",
  intro: "Află rapid ce blochează, de fapt, comunicarea dintre voi.",
  ready: true,
  questions: [
    {
      id: "q1",
      question: "Când încerc să spun ceva important, cel mai des…",
      options: [
        "simt că tonul meu urcă fără să vreau",
        "explic mult, cu multe detalii",
        "deschid subiectul când deja sunt încărcată",
        "spun ce mă deranjează, dar nu și ce am nevoie",
      ],
    },
    {
      id: "q2",
      question: "Partenerul meu reacționează cel mai des prin faptul că…",
      options: [
        "se aprinde de la felul în care spun",
        "pare că nu mai înțelege esența",
        "se închide, tace sau amână",
        "intră în defensivă foarte repede",
      ],
    },
    {
      id: "q3",
      question: "Când nu te simți auzită, cum reacționezi cel mai des?",
      options: [
        "insist și mai mult",
        "explic și mai mult",
        "forțez discuția pe loc",
        "repet problema, dar nu spun clar de ce am nevoie",
      ],
    },
    {
      id: "q4",
      question: "Ce te frustrează cel mai tare?",
      options: [
        "că reacționează la ton, nu la mesaj",
        "că după atâtea explicații tot nu înțelege",
        "că evită discuția și te lasă singură în tensiune",
        "că vorbiți despre simptome, nu despre problema reală",
      ],
    },
    {
      id: "q5",
      question: "Care frază descrie cel mai bine situația voastră?",
      options: [
        "nu mă aude pentru că reacționează la tonul meu",
        "nu mă aude pentru că spun prea multe deodată",
        "nu mă aude pentru că se închide imediat",
        "nu mă aude pentru că nu spun clar ce am nevoie",
      ],
    },
  ],
  results: {
    A: "Ce blochează comunicarea dintre voi: tonul și tensiunea",
    B: "Ce blochează comunicarea dintre voi: prea multe explicații",
    C: "Ce blochează comunicarea dintre voi: închiderea și evitarea",
    D: "Ce blochează comunicarea dintre voi: nevoia nespusă",
  },
  // Direct SmartSender deep links per rezultat (pentru botul @liliadubita_bot)
  resultLinks: {
    // Rezultatul A – „de ce nu te aude partenerul”
    A: "https://t.me/liliadubita_bot?start=ZGw6MzE4MzQx",
    // Rezultatul B
    B: "https://t.me/liliadubita_bot?start=ZGw6MzE4MzUw",
    // Rezultatul C
    C: "https://t.me/liliadubita_bot?start=ZGw6MzE4MzUz",
    // Rezultatul D
    D: "https://t.me/liliadubita_bot?start=ZGw6MzE4MzU5",
  },
};

export const QUIZ_2: QuizDefinition = {
  id: "quiz-2",
  slug: "de-ce-repetati-mereu-aceleasi-certuri",
  shortId: "certuri",
  title: "De ce repetați mereu aceleași certuri?",
  description: "Află ce reaprinde între voi același conflict, iar și iar.",
  intro: "Vezi rapid ce reaprinde între voi același conflict.",
  ready: true,
  questions: [
    {
      id: "q1",
      question: "Cele mai frecvente certuri dintre voi apar în jurul…",
      options: [
        "banilor, cheltuielilor, responsabilităților",
        "timpului petrecut împreună",
        "suspiciunilor, explicațiilor, geloziei",
        "felului în care „trebuie” făcute lucrurile",
      ],
    },
    {
      id: "q2",
      question: "Ce te doare cel mai tare în aceste certuri?",
      options: [
        "că nu simt stabilitate",
        "că nu mă simt aleasă",
        "că nu mă simt în siguranță emoțional",
        "că mă simt controlată sau corectată",
      ],
    },
    {
      id: "q3",
      question: "Ce se repetă cel mai des?",
      options: [
        "reproșuri legate de bani sau asumare",
        "promisiuni legate de timp care nu se respectă",
        "tensiuni din cauza neîncrederii",
        "critici, indicații sau presiune",
      ],
    },
    {
      id: "q4",
      question: "După ceartă, cel mai des rămâne…",
      options: [
        "frică de viitor sau instabilitate",
        "distanță și tristețe",
        "neliniște și scenarii în minte",
        "revoltă sau închidere",
      ],
    },
    {
      id: "q5",
      question: "Care propoziție seamănă cel mai mult cu adevărul dintre voi?",
      options: [
        "nu ne simțim în siguranță împreună",
        "nu ne alegem unul pe altul cu adevărat",
        "între noi există prea multă nesiguranță",
        "între noi există prea multă presiune",
      ],
    },
  ],
  results: {
    A: "Ce reaprinde aceleași certuri: lupta pentru siguranță",
    B: "Ce reaprinde aceleași certuri: lipsa de prioritate",
    C: "Ce reaprinde aceleași certuri: nesiguranța dintre voi",
    D: "Ce reaprinde aceleași certuri: lupta pentru control",
  },
  resultLinks: {
    A: "https://t.me/liliadubita_bot?start=ZGw6MzIwMjgy",
    B: "https://t.me/liliadubita_bot?start=ZGw6MzIwMjg1",
    C: "https://t.me/liliadubita_bot?start=ZGw6MzIwMjg4",
    // Rezultat D – inbox Instagram (SmartSender)
    D: "https://ig.me/m/liliadubita.psiholog?ref=ZGw6MzIwMjkx",
  },
};

export const QUIZ_3: QuizDefinition = {
  id: "quiz-3",
  slug: "de-ce-va-certati-atat-de-des",
  shortId: "des",
  title: "De ce vă certați atât de des?",
  description: "Află de ce tensiunea dintre voi apare atât de frecvent.",
  intro: "Vezi de ce tensiunea dintre voi apare atât de des.",
  ready: true,
  questions: [
    {
      id: "q1",
      question: "Cel mai des, certurile dintre voi pornesc pentru că…",
      options: [
        "vă aprindeți foarte repede",
        "se adună prea multe lucruri nespuse",
        "unul evită până când celălalt explodează",
        "vă atingeți unul altuia punctele sensibile",
      ],
    },
    {
      id: "q2",
      question: "Cum începe, de obicei, o ceartă între voi?",
      options: [
        "dintr-un lucru mic, totul escaladează repede",
        "după o perioadă în care s-au adunat multe",
        "unul vrea să vorbească, celălalt se retrage",
        "unul spune ceva care îl rănește profund pe celălalt",
      ],
    },
    {
      id: "q3",
      question: "Ce se întâmplă cel mai des între voi?",
      options: [
        "reacționați prea impulsiv",
        "lăsați prea multe nerezolvate",
        "nu sunteți disponibili în același timp pentru discuție",
        "vă activați reciproc dureri mai vechi",
      ],
    },
    {
      id: "q4",
      question: "După ce vă certați, cel mai des simți că…",
      options: [
        "totul a scăpat de sub control prea repede",
        "problema era mai veche, nu doar cea de acum",
        "iar n-ați reușit să vorbiți în același ritm",
        "v-ați rănit mai mult decât era cazul",
      ],
    },
    {
      id: "q5",
      question: "Care frază descrie cel mai bine situația voastră?",
      options: [
        "ne aprindem prea repede",
        "lăsăm prea multe să se adune",
        "unul vrea să rezolve, altul evită",
        "ne lovim exact unde doare mai tare",
      ],
    },
  ],
  results: {
    A: "De ce vă certați atât de des: reacționați prea impulsiv",
    B: "De ce vă certați atât de des: se adună prea multe lucruri",
    C: "De ce vă certați atât de des: unul insistă, altul evită",
    D: "De ce vă certați atât de des: vă activați unul altuia rănile",
  },
  resultLinks: {
    A: "https://t.me/liliadubita_bot?start=ZGw6MzIwMjk0",
    B: "https://t.me/liliadubita_bot?start=ZGw6MzIwMzAw",
    C: "https://t.me/liliadubita_bot?start=ZGw6MzIwMjk3",
    D: "https://t.me/liliadubita_bot?start=ZGw6MzIwMzAz",
  },
};

export const QUIZ_4: QuizDefinition = {
  id: "quiz-4",
  slug: "care-este-tiparul-vostru-de-conflict",
  shortId: "tipar",
  title: "Care este tiparul vostru de conflict?",
  description: "Află dinamica ce se repetă între voi în momentele tensionate.",
  intro: "Identifică tiparul care se repetă între voi în conflict.",
  ready: true,
  questions: [
    {
      id: "q1",
      question: "Când apare tensiunea între voi, cel mai des…",
      options: [
        "amândoi ridicați intensitatea",
        "vorbiți mult, dar nu ajungeți nicăieri",
        "unul insistă, celălalt se retrage",
        "vă răniți subtil, apoi rămâne distanță",
      ],
    },
    {
      id: "q2",
      question: "În timpul unei certuri, cel mai des simți că…",
      options: [
        "totul se transformă rapid în confruntare",
        "discuția se învârte în cerc",
        "alergi după o conversație care nu se întâmplă",
        "rămân lucruri spuse care dor mult",
      ],
    },
    {
      id: "q3",
      question: "Cum se termină, de obicei, conflictul dintre voi?",
      options: [
        "prin explozie, oboseală sau ruptură de moment",
        "fără concluzie clară, după multe explicații",
        "prin retragere, tăcere sau amânare",
        "aparent se oprește, dar rămâne rece între voi",
      ],
    },
    {
      id: "q4",
      question: "Ce se repetă cel mai des în certurile voastre?",
      options: [
        "reacții puternice și escaladare",
        "aceleași discuții fără rezolvare",
        "alergare după celălalt și evitare",
        "înțepături, răni și distanță",
      ],
    },
    {
      id: "q5",
      question: "Care formulare vă descrie cel mai bine?",
      options: [
        "vă confruntați prea intens",
        "vă pierdeți în discuții fără sfârșit",
        "unul urmărește, altul fuge",
        "vă răniți și apoi vă îndepărtați",
      ],
    },
  ],
  results: {
    A: "Tiparul vostru de conflict: confruntare și escaladare",
    B: "Tiparul vostru de conflict: discuții în cerc",
    C: "Tiparul vostru de conflict: unul urmărește, altul evită",
    D: "Tiparul vostru de conflict: răni și distanță",
  },
  resultLinks: {
    A: "https://t.me/liliadubita_bot?start=ZGw6MzIwMzA5",
    B: "https://t.me/liliadubita_bot?start=ZGw6MzIwMzEy",
    C: "https://t.me/liliadubita_bot?start=ZGw6MzIwMzE1",
    D: "https://t.me/liliadubita_bot?start=ZGw6MzIwMzE4",
  },
};

const ALL_QUIZZES: QuizDefinition[] = [
  QUIZ_1,
  QUIZ_2,
  QUIZ_3,
  QUIZ_4,
];

export function getQuizBySlug(slug: string): QuizDefinition | undefined {
  return ALL_QUIZZES.find((q) => q.slug === slug);
}

export function getAllQuizzes(): QuizDefinition[] {
  return ALL_QUIZZES;
}

export function getReadyQuizzes(): QuizDefinition[] {
  return ALL_QUIZZES.filter((q) => q.ready);
}
