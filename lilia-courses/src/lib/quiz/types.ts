/**
 * Quiz types and shared constants.
 * Option index 0 = A, 1 = B, 2 = C, 3 = D.
 */

export type ResultKey = "A" | "B" | "C" | "D";

export const RESULT_KEYS: ResultKey[] = ["A", "B", "C", "D"];

/** One question: 4 options, single choice. Option index maps to A,B,C,D. */
export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
}

/** Internal result label (for Telegram). Not shown on site. */
export interface QuizResultLabels {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuizDefinition {
  id: string;
  /** URL slug, e.g. de-ce-nu-te-aude-partenerul */
  slug: string;
  /** Short id for Telegram start param (length limit), e.g. aude */
  shortId: string;
  title: string;
  description: string;
  intro: string;
  questions: QuizQuestion[];
  /** Internal only: for Telegram delivery. Not displayed on site. */
  results: QuizResultLabels;
  /** If true, quiz is fully implemented. Else placeholder. */
  ready: boolean;
}
