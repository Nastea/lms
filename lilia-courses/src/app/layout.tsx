import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://liliadubita.md"),
  title: "Lilia Courses | RELAȚIA 360 - De la conflict la conectare",
  description: "Platformă de cursuri. Curs practic de comunicare în relații.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="dark" style={{ colorScheme: "light" }}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
