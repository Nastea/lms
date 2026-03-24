import type { ResultKey } from "./types";

/**
 * Maps option index (0–3) to result key (A–D).
 */
export function optionIndexToResult(index: number): ResultKey {
  const keys: ResultKey[] = ["A", "B", "C", "D"];
  return keys[Math.max(0, Math.min(index, 3))] ?? "A";
}

/**
 * Computes final result from answers (each 0–3).
 * Rule: category with most votes wins.
 * Tie-break 1: category chosen at question 5 wins if among tied.
 * Tie-break 2: stable order A > B > C > D.
 */
export function calculateResult(answers: number[]): ResultKey {
  const counts: Record<ResultKey, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const optionIndex of answers) {
    const key = optionIndexToResult(optionIndex);
    counts[key]++;
  }

  const maxCount = Math.max(counts.A, counts.B, counts.C, counts.D);
  const tied: ResultKey[] = (["A", "B", "C", "D"] as const).filter((k) => counts[k] === maxCount);

  if (tied.length === 1) return tied[0];

  // Tie-break: question 5 (index 4) wins if among tied
  const q5Answer = answers[4];
  const q5Key = optionIndexToResult(q5Answer);
  if (tied.includes(q5Key)) return q5Key;

  // Stable order: A > B > C > D
  const order: ResultKey[] = ["A", "B", "C", "D"];
  return tied.reduce((best, k) => (order.indexOf(k) < order.indexOf(best) ? k : best), tied[0]);
}
