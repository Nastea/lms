import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/app");

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <div className="font-semibold">Administrator</div>
          <div className="flex gap-4 text-sm opacity-80">
            <Link className="hover:opacity-100" href="/admin">Cursuri</Link>
            <Link className="hover:opacity-100" href="/app">Vedere student</Link>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">{children}</div>
    </div>
  );
}

