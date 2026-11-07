import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { FEEDBACK, bonusPdf, verifyBonusToken } from '@/lib/intensivFeedback';

/** GET /api/intensiv/feedback/bonus?t=<token> — ghidul bonus, doar pentru cine a trimis feedback. */
export async function GET(req: Request) {
  const email = verifyBonusToken(new URL(req.url).searchParams.get('t') || '');
  if (!email) return new Response('Link invalid.', { status: 403 });

  const { data } = await supabaseAdmin.from('intensiv_feedback').select('id').eq('email', email).maybeSingle();
  if (!data) return new Response('Link invalid.', { status: 403 });

  const pdf = bonusPdf();
  if (!pdf) return new Response('Fișierul nu e disponibil momentan.', { status: 500 });

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${FEEDBACK.bonusFilename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
