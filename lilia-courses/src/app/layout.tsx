import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "Lilia Courses | RELAȚIA 360 - De la conflict la conectare",
  description: "Platformă de cursuri. Curs practic de comunicare în relații.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${inter.variable} dark`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-screen antialiased flex flex-col bg-black text-white" style={{ fontFamily: "var(--font-body), Arial, sans-serif" }}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
