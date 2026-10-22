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
  // TEST REAL: 1 leu. După test: suma în MDL pentru 20 € și label: '20 €'.
  amount: 1,
  label: '1 leu',
  /** Prețul anunțat după închiderea preînscrierilor (null = nu se afișează). */
  laterLabel: null as string | null,
  dateText: 'sâmbătă, 7 noiembrie 2026',
  timeText: '10:00–16:00, cu pauză de prânz 12:00–13:00',
  telegramGroupUrl: 'https://t.me/+bOjSEN9TGAEyYTVi',
  /** Gol până avem linkul: atunci emailul spune că linkul vine în grup. */
  zoomUrl: '',
};
