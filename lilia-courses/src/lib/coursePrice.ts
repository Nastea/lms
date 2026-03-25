/**
 * Prețul cursului – o singură sursă pentru afișare și pentru plată.
 * Producție: 49 EUR.
 */
export const COURSE_PRICE = {
  // Paynet afișează suma exact din `amount` (în MDL în integrarea curentă).
  // Pe site afișăm în continuare 49 EUR (label), dar la Paynet trimitem echivalentul în MDL.
  amount: 995,
  currency: "MDL" as const,
  /** Text afișat utilizatorului (ex: "49 EUR") */
  label: "49 EUR",
};
