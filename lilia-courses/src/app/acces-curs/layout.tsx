import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acces la prima lecție | RELAȚIA 360 - De la conflict la conectare",
  description:
    "Creează cont și accesează gratuit prima lecție din mini-cursul RELAȚIA 360. Învață cum să transformi conflictele în conectare.",
};

export default function AccesCursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
