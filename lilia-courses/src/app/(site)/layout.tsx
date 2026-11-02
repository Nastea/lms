import Footer from "@/components/Footer";

// Site-ul de cursuri (Relația 360, LMS, plăți): fond negru și footer-ul Danex Prim.
// Pagina principală corporate are layout-ul ei în (corporate).
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white" style={{ fontFamily: "var(--font-body), Arial, sans-serif" }}>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
