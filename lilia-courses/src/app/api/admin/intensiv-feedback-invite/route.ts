import { sendInvite } from '@/lib/intensivFeedback';
import { bulkSendRoute } from '@/lib/intensivParticipants';

export const maxDuration = 60;

/** POST /api/admin/intensiv-feedback-invite — invitația la feedback (test / toți). */
export function POST(req: Request) {
  return bulkSendRoute(req, sendInvite, 'INTENSIV_FEEDBACK_INVITE_BATCH');
}
