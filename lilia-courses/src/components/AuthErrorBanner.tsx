"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * When Supabase redirects here with #error=access_denied&error_code=otp_expired (expired/invalid invite),
 * show a friendly message and clear the hash.
 */
export function AuthErrorBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const error = params.get("error");
    const code = params.get("error_code");
    if (error === "access_denied" || code === "otp_expired") {
      setShow(true);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 text-center text-sm shadow-md"
      style={{
        backgroundColor: "#fef2f2",
        color: "#991b1b",
        borderBottom: "1px solid #fecaca",
      }}
    >
      <p className="font-medium">Link invalid sau expirat.</p>
      <p className="mt-1 opacity-90">
        Poți <Link href="/login" className="underline font-medium">te autentifica</Link> dacă ai deja cont, sau{" "}
        <Link href="/inscriere" className="underline font-medium">solicită o nouă invitație</Link> după plată.
      </p>
    </div>
  );
}
