import { Geist, Geist_Mono, DM_Serif_Display, Inter } from "next/font/google";
import Footer from "@/components/Footer";

// Fonturile site-ului de cursuri stau aici, nu în root layout, ca pagina corporate să nu le preîncarce.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Site-ul de cursuri (Relația 360, LMS, plăți): fond negru și footer-ul Danex Prim.
// Pagina principală corporate are layout-ul ei în (corporate).
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${inter.variable} min-h-screen flex flex-col bg-black text-white`} style={{ fontFamily: "var(--font-body), Arial, sans-serif" }}>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
