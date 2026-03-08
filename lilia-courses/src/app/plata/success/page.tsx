import { redirect } from 'next/navigation';

/**
 * /plata/success?order=<uuid>
 * Redirects to the single thank-you page /multumim so all post-payment flows
 * use the same content (SmartSender deep link, no email/invite flow).
 */
export default async function PlataSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (orderId) {
    redirect(`/multumim?order=${encodeURIComponent(orderId)}`);
  }
  redirect('/multumim');
}
