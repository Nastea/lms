/**
 * Intensivul „Am un plan pentru viața mea" (pagina /intensiv).
 *
 * Paynet primește suma în MDL (`amount`); pe site afișăm `label`, ca la curs.
 * Suma e impusă pe server în /api/paynet/create — clientul nu o poate schimba.
 */
export const INTENSIV = {
  productId: 'intensiv_plan',
  /** Numele de pe factura Paynet. */
  invoiceName: 'INTENSIV – Am un plan pentru viața mea',
  /** Preînscriere: 400 lei la Paynet, afișat „20 €”, până la `regularFrom`. */
  preRegistration: { amount: 400, label: '20 €' },
  /** De la `regularFrom` (ora Chișinăului): 600 lei, afișat „30 €”. */
  regular: { amount: 600, label: '30 €' },
  regularFrom: '2026-10-26T10:00:00+02:00',
  dateText: 'sâmbătă, 7 noiembrie 2026',
  timeText: '10:00–16:00, cu pauză de prânz 12:00–13:00',
  telegramGroupUrl: 'https://t.me/+bOjSEN9TGAEyYTVi',
  /** Gol până avem linkul: atunci emailul spune că linkul vine în grup. */
  zoomUrl: 'https://us05web.zoom.us/j/3669097947?pwd=OUh0YlFLeldjOXEyMzA5b3o3ZER4QT09',
};

/** Prețul în vigoare acum. Folosit și de pagină, și de checkout (sursa de adevăr). */
export function currentIntensivPrice(now: Date = new Date()) {
  const isPre = now < new Date(INTENSIV.regularFrom);
  const p = isPre ? INTENSIV.preRegistration : INTENSIV.regular;
  return { amount: p.amount, label: p.label, isPre, laterLabel: isPre ? INTENSIV.regular.label : null };
}
