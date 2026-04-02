import type { Metadata } from 'next';
import PlataCheckoutView from '@/components/PlataCheckoutView';

export const metadata: Metadata = {
  title: 'Test plată | Relația 360',
  description: 'Pagină de test pentru fluxul de plată (același conținut ca /plata).',
  robots: { index: false, follow: false },
};

/** Duplicat /plata pentru testare (1 leu, același flux Paynet). */
export default function PlataTestPage() {
  return <PlataCheckoutView />;
}
