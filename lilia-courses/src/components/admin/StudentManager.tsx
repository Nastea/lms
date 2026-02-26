"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Props = {
  courseId: string;
  existingEntitlements: Array<{ user_id: string; user_email?: string; status: string }>;
};

export default function StudentManager({ courseId, existingEntitlements }: Props) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function grantAccess() {
    if (!email.trim()) return;
    setErr(null);
    setSuccess(false);
    setBusy(true);

    try {
      const supabase = supabaseBrowser();

      // Find user by email via API
      const res = await fetch(`/api/admin/find-user?email=${encodeURIComponent(email)}`);
      const userData = await res.json();

      if (!res.ok || !userData?.id) {
        throw new Error(userData?.error || "Utilizator negăsit. Asigură-te că utilizatorul există în Supabase Auth.");
      }

      // Grant entitlement
      const { error: entError } = await supabase
        .from("entitlements")
        .upsert({
          user_id: userData.id,
          course_id: courseId,
          status: "active",
          source: "admin",
        });

      if (entError) throw entError;

      setSuccess(true);
      setEmail("");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e: any) {
      setErr(e?.message ?? "Eroare la acordarea accesului");
    } finally {
      setBusy(false);
    }
  }

  async function revokeAccess(userId: string) {
    if (!confirm("Revoci accesul pentru acest student?")) return;
    setBusy(true);
    setErr(null);

    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase
        .from("entitlements")
        .update({ status: "revoked" })
        .eq("user_id", userId)
        .eq("course_id", courseId);

      if (error) throw error;
      window.location.reload();
    } catch (e: any) {
      setErr(e?.message ?? "Eroare la revocarea accesului");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="text-sm font-semibold opacity-90">Studenți</div>

      <div className="flex gap-3">
        <input
          className="flex-1 rounded-xl bg-black/20 border border-white/10 p-3 text-sm"
          placeholder="Email student"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && grantAccess()}
        />
        <button
          onClick={grantAccess}
          disabled={busy || !email.trim()}
          className="rounded-xl bg-white text-black px-4 py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Se adaugă..." : "Adaugă student"}
        </button>
      </div>

      {err && <div className="text-sm text-red-300">{err}</div>}
      {success && <div className="text-sm text-green-300">Acces acordat!</div>}

      {existingEntitlements.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs opacity-70">Studenți actuali:</div>
          {existingEntitlements.map((e) => (
            <div key={e.user_id} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm">
              <span>{e.user_email || e.user_id.slice(0, 8)}</span>
              {e.status === "active" && (
                <button
                  onClick={() => revokeAccess(e.user_id)}
                  className="text-xs opacity-80 hover:opacity-100"
                  disabled={busy}
                >
                  Revocă
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

