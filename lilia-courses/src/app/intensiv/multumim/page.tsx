import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import PaidStatus from './PaidStatus';
import '../intensiv.css';

/* Pagina la care Paynet trimite cumpărătorul după plata intensivului. */

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--ix-font',
});

export const metadata: Metadata = {
  title: 'Mulțumim — Am un plan pentru viața mea',
  robots: { index: false },
};

export default async function IntensivThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <div className={`ix ${archivo.variable}`}>
      <div className="ix-sheet-main">
        <header className="ix-hero ix-thanks">
          <div className="ix-cover ix-cover-single">
            <i className="ix-notch ix-notch-tl" aria-hidden />
            <i className="ix-notch ix-notch-tr" aria-hidden />
            <div className="ix-cover-text">
              <PaidStatus orderId={order ?? null} />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
