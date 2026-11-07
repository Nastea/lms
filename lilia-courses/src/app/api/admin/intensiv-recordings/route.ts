import { sendRecordings } from '@/lib/intensivFeedback';
import { bulkSendRoute } from '@/lib/intensivParticipants';

export const maxDuration = 60;

/** POST /api/admin/intensiv-recordings — emailul cu înregistrările + linkul la feedback (test / toți). */
export function POST(req: Request) {
  return bulkSendRoute(req, sendRecordings, 'INTENSIV_RECORDINGS_BATCH');
}
