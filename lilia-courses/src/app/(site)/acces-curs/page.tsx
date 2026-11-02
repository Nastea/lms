import { redirect } from "next/navigation";

/**
 * /acces-curs — redirects to public Lesson 0 (lead magnet).
 * No account creation; user watches free lesson then can buy from there.
 */
export default function AccesCursPage() {
  redirect("/curs/lectia-0");
}
