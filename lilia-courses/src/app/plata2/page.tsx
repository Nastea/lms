import type { Metadata } from 'next';
import PlataCheckoutView from '@/components/PlataCheckoutView';
import { COURSE_PRICE_TEST_1LEU } from '@/lib/coursePrice';

export const metadata: Metadata = {
  title: 'Test plată (1 leu) | Relația 360',
  description: 'Pagină de test — același curs, sumă 1 MDL.',
  robots: { index: false, follow: false },
};

export default function Plata2Page() {
  return <PlataCheckoutView price={COURSE_PRICE_TEST_1LEU} />;
}
