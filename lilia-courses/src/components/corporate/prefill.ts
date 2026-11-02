// Leagă explorarea situațiilor și calea directă de formularul de contact.
export const PREFILL_EVENT = "corp:prefill";

export type Prefill = { text: string; intent?: string };

export function prefillContact(detail: Prefill) {
  window.dispatchEvent(new CustomEvent<Prefill>(PREFILL_EVENT, { detail }));
}
