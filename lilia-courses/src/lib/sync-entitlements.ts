import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { User } from "@supabase/supabase-js";

/**
 * Maps payment product_id to LMS course_id. Set in env:
 * - PAYMENT_COURSE_ID: UUID of the course to grant when user pays (single product).
 * Optional: PAYMENT_PRODUCT_ID to only sync orders with that product (default: any paid order).
 */
const PAYMENT_COURSE_ID = process.env.PAYMENT_COURSE_ID;
const PAYMENT_PRODUCT_ID = process.env.PAYMENT_PRODUCT_ID;

/**
 * For the current user, find paid orders (by customer_email) and grant entitlements
 * for the configured course. Idempotent (upsert). Call from /app page load.
 */
export async function syncEntitlementsFromOrders(user: User): Promise<void> {
  const email = user?.email?.trim();
  if (!email || !user.id) return;
  if (!PAYMENT_COURSE_ID) return;

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id, product_id")
    .eq("customer_email", email)
    .eq("status", "paid");

  if (!orders?.length) return;

  for (const order of orders) {
    if (PAYMENT_PRODUCT_ID && order.product_id !== PAYMENT_PRODUCT_ID) continue;

    await supabaseAdmin.from("entitlements").upsert(
      {
        user_id: user.id,
        course_id: PAYMENT_COURSE_ID,
        status: "active",
        source: "order",
        order_id: order.id,
      },
      { onConflict: "user_id,course_id" }
    );
  }
}
