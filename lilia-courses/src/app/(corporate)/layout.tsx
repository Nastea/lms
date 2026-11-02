import { Archivo, Newsreader } from "next/font/google";
import "./corporate.css";

// Fonturile direcției A, cu latin-ext pentru ș, ț, ă, î, â.
const display = Newsreader({
  variable: "--font-corp-display",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

const text = Archivo({
  variable: "--font-corp-text",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

export default function CorporateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`corp ${display.variable} ${text.variable}`}>{children}</div>;
}
