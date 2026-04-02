/**
 * Prețul cursului – o singură sursă pentru afișare și pentru plată.
 * Temporar: 1 leu (MDL) pentru testare plată — revino la prețul real înainte de producție.
 */
export const COURSE_PRICE = {
  /** Sumă trimisă la Paynet (MDL). */
  amount: 1,
  currency: "MDL" as const,
  /** Text afișat utilizatorului */
  label: "1 leu",
};
