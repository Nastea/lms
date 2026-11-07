import LiveRegistrations from './LiveRegistrations';
import FeedbackAnswers from './FeedbackAnswers';

export const metadata = { title: 'Înscrieri intensiv' };

export default function IntensivRegistrationsPage() {
  return (
    <>
      <LiveRegistrations />
      <FeedbackAnswers />
    </>
  );
}
