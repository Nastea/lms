import { redirect } from 'next/navigation';

/** URL vechi de test — același flux ca /plata2 */
export default function PlataTestRedirect() {
  redirect('/plata2');
}
