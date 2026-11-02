import { redirect } from 'next/navigation';

/**
 * /inscriere — redirects to payment page /plata.
 * All CTAs "Cumpără cursul" point to /plata (pagina de plată).
 */
export default function InscrierePage() {
  redirect('/plata');
}
