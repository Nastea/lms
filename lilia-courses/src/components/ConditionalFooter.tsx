"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

/**
 * Renders Footer on all routes except /plata, so the payment page can be full viewport (100vh).
 */
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/plata") return null;
  return <Footer />;
}
