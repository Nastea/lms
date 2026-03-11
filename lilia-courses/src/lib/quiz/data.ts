import type { QuizDefinition } from "./types";

export const QUIZ_1: QuizDefinition = {
  id: "quiz-1",
  slug: "de-ce-nu-te-aude-partenerul",
  shortId: "aude",
  title: "De ce nu te aude partenerul?",
  description: "Descoperă ce blochează comunicarea dintre voi și de ce mesajul tău nu ajunge.",
  intro: "Răspunde sincer la câteva întrebări și vei vedea ce împiedică, de fapt, partenerul să te audă.",
  ready: true,
  questions: [
    {
      id: "q1",
      question: "Când încerci să spui ceva important, cel mai des…",
      options: [
        "simt că tonul meu urcă fără să vreau",
        "explic mult, cu multe detalii",
        "deschid subiectul când deja sunt încărcată",
        "spun ce mă deranjează, dar nu și ce am nevoie",
      ],
    },
    {
      id: "q2",
      question: "Partenerul tău reacționează cel mai des prin faptul că…",
      options: [
        "se aprinde de la felul în care spun",
        "pare că nu mai înțelege esența",
        "se închide, tace sau amână",
        "intră în defensivă foarte repede",
      ],
    },
    {
      id: "q3",
      question: "Când nu te simți auzită, tu tind să…",
      options: [
        "insist cu mai multă intensitate",
        "explic și mai mult",
        "forțez discuția pe loc",
        "repet problema, nu nevoia din spatele ei",
      ],
    },
    {
      id: "q4",
      question: "După o discuție tensionată, cel mai des simți că…",
      options: [
        "totul a degenerat prea repede",
        "ai spus prea multe și tot n-ai fost înțeleasă",
        "ai rămas singură în discuție",
        "ați vorbit despre suprafață, nu despre ce doare",
      ],
    },
    {
      id: "q5",
      question: "Când începi o conversație grea, de obicei pornești de la…",
      options: [
        "emoția deja ridicată",
        "tot ce s-a adunat în timp",
        "momentul în care nu mai poți ține în tine",
        "ce face el greșit",
      ],
    },
    {
      id: "q6",
      question: "Ce te frustrează cel mai tare?",
      options: [
        "că reacționează la ton, nu la mesaj",
        "că după atâtea explicații tot nu înțelege",
        "că evită discuția și te lasă singură în tensiune",
        "că vorbiți despre simptome, nu despre problema reală",
      ],
    },
    {
      id: "q7",
      question: "Care frază te descrie cel mai bine?",
      options: [
        "nu mă aude pentru că reacționează la tonul meu",
        "nu mă aude pentru că spun prea mult",
        "nu mă aude pentru că se închide imediat",
        "nu mă aude pentru că nu spun clar ce am nevoie",
      ],
    },
  ],
  results: {
    A: "Te aude greu pentru că aude mai întâi tensiunea, nu mesajul",
    B: "Te aude greu pentru că mesajul tău se pierde în prea multe explicații",
    C: "Te aude greu pentru că îl prinzi când deja e închis",
    D: "Te aude greu pentru că spui problema, dar nu și nevoia reală",
  },
  // Direct SmartSender deep links per rezultat (pentru botul @liliadubita_bot)
  resultLinks: {
    // Rezultatul A – „de ce nu te aude partenerul” → linkul tău din SmartSender
    A: "https://t.me/liliadubita_bot?start=ZGw6MzE4MzQx",
    // B, C, D pot fi completate ulterior când ai linkurile
  },
};

export const QUIZ_2: QuizDefinition = {
  id: "quiz-2",
  slug: "de-ce-repetati-mereu-aceleasi-certuri",
  shortId: "certuri",
  title: "De ce repetați mereu aceleași certuri?",
  description: "Înțelege ce reaprinde același conflict între voi și cum îl poți descurca.",
  intro: "Răspunde la câteva întrebări și vei vedea ce menține același ciclu de certuri.",
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
      question: "Ce te enervează cel mai tare la partener?",
      options: [
        "lipsa de claritate și responsabilitate",
        "că nu face loc real relației",
        "că este vag sau defensiv",
        "că vrea să aibă mereu dreptate sau control",
      ],
    },
    {
      id: "q6",
      question: "Când reapare conflictul, în adânc simți mai degrabă…",
      options: [
        "nu mă simt în siguranță cu tine",
        "nu mă simt importantă pentru tine",
        "mi-e frică să nu te pierd sau să fiu mințită",
        "nu simt că ai încredere în mine",
      ],
    },
    {
      id: "q7",
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
    A: "Repetați aceleași certuri pentru că în spate este lupta pentru siguranță",
    B: "Repetați aceleași certuri pentru că unul nu se simte ales",
    C: "Repetați aceleași certuri pentru că între voi s-a instalat nesiguranța",
    D: "Repetați aceleași certuri pentru că între voi s-a format o luptă pentru control",
  },
};

const PLACEHOLDER_QUIZ = (
  slug: string,
  shortId: string,
  title: string,
  description: string
): QuizDefinition => ({
  id: `quiz-${slug}`,
  slug,
  shortId,
  title,
  description,
  intro: "Acest quiz va fi disponibil în curând.",
  ready: false,
  questions: [],
  results: { A: "", B: "", C: "", D: "" },
});

export const QUIZ_PLACEHOLDERS: QuizDefinition[] = [
  PLACEHOLDER_QUIZ(
    "ce-joc-jucati-cand-va-certati",
    "joc",
    "Ce joc jucați când vă certați?",
    "Descoperă dinamica ascunsă din certurile voastre."
  ),
  PLACEHOLDER_QUIZ(
    "de-ce-va-certati-atat-de-des",
    "des",
    "De ce vă certați atât de des?",
    "Înțelege frecvența conflictelor și ce o alimentează."
  ),
  PLACEHOLDER_QUIZ(
    "cum-va-certati-de-fapt",
    "cum",
    "Cum vă certați, de fapt?",
    "Vezi stilul vostru de conflict și cum îl poți schimba."
  ),
  PLACEHOLDER_QUIZ(
    "care-este-tiparul-vostru-de-conflict",
    "tipar",
    "Care este tiparul vostru de conflict?",
    "Identifică tiparul care se repetă între voi."
  ),
];

const ALL_QUIZZES: QuizDefinition[] = [
  QUIZ_1,
  QUIZ_2,
  ...QUIZ_PLACEHOLDERS,
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
