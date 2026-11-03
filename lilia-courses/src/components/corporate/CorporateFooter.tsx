import Link from "next/link";
import { brand, company, showPending } from "@/content/corporate";

export default function CorporateFooter() {
  return (
    <footer className="foot">
      <p className="big">{brand.name}</p>
      <div className="cols">
        <div><b>{brand.tagline}</b><span className="muted">{brand.positioning}</span></div>
        <div><b>{company.legalName}</b><span className="muted">{company.address}</span><a href={`tel:${company.phone}`}>Tel: {company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
        <div><b>Informații legale</b><Link href="/confidentialitate">Politica de confidențialitate</Link><Link href="/termeni">Termeni și condiții</Link><Link href="/conflicte">Cursul Relația 360</Link></div>
      </div>
      {showPending && <p className="muted" style={{ marginTop: 24 }}>Previzualizare: elementele marcate [DE VERIFICAT] nu apar în producție.</p>}
    </footer>
  );
}
