import { redirect } from 'next/navigation';

/** URL vechi — redirecționare către pagina principală de plată */
export default function PlataTestRedirect() {
  redirect('/plata');
}
