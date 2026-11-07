import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import FeedbackForm from './FeedbackForm';
import '../intensiv.css';

/* Feedback după intensiv: 3 întrebări; participanții primesc pe email caietul bonus. */

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--ix-font',
});

export const metadata: Metadata = {
  title: 'Cum a fost la intensiv? — Lilia Dubița',
  description: '3 întrebări despre intensivul „Am un plan pentru viața mea” și un caiet bonus pentru tine.',
  robots: { index: false },
};

export default function IntensivFeedbackPage() {
  return (
    <div className={`ix ${archivo.variable}`}>
      <div className="ix-sheet-main">
        <header className="ix-hero ix-thanks">
          <div className="ix-cover ix-cover-single ix-fb">
            <i className="ix-notch ix-notch-tl" aria-hidden />
            <i className="ix-notch ix-notch-tr" aria-hidden />
            <div className="ix-cover-text">
              <h1 className="ix-cover-title ix-fb-title">Cum a fost la intensiv?</h1>
              <p className="ix-cover-sub ix-fb-sub">
                Trei întrebări, cam două minute. Citesc fiecare răspuns. Ca mulțumire, îți trimit pe
                email un caiet bonus.
              </p>
              <FeedbackForm />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
