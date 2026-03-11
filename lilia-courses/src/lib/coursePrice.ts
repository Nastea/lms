/**
 * Prețul cursului – o singură sursă pentru afișare și pentru plată.
 * Test: 1 leu (MDL). Pentru producție: schimbă amount și label.
 */
export const COURSE_PRICE = {
  amount: 1,
  currency: "MDL" as const,
  /** Text afișat utilizatorului (ex: "1 leu") */
  label: "1 leu",
};
