/**
 * Prețul cursului — sursă pentru afișare și pentru Paynet (suma în MDL).
 */

export type CoursePrice = {
  amount: number;
  currency: "MDL";
  /** Text afișat (ex. „49 EUR”, „1 leu”) */
  label: string;
};

/** Pagina de plată `/plata` */
export const COURSE_PRICE: CoursePrice = {
  // Paynet primește `amount` în MDL; pe site afișăm echivalentul în EUR.
  amount: 995,
  currency: "MDL",
  label: "49 EUR",
};
