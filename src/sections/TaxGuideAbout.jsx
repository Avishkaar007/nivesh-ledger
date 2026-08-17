import React from "react";
import { GraduationCap, Calculator as CalcIcon, ArrowRight } from "lucide-react";

export default function TaxGuideAbout() {
  return (
    <section id="tax-guide" className="split-section">
      <div className="split-card">
        <GraduationCap size={20} />
        <h3>FY 2025-26 equity tax, in short</h3>
        <p>
          Equity mutual funds held 12 months or more attract 12.5% LTCG under Section 112A, on gains above
          ₹1.25 lakh a year. Held under 12 months, gains attract a flat 20% STCG under Section 111A, with no
          exemption. These rates, set by the Finance (No. 2) Act 2024, were carried unchanged through Union
          Budget 2026.
        </p>
        <a href="#" onClick={(e) => e.preventDefault()}>Read the full tax guide <ArrowRight size={13} /></a>
      </div>
      <div id="about" className="split-card">
        <CalcIcon size={20} />
        <h3>About Nivesh Ledger</h3>
        <p>
          We're building one honest, transparent calculator at a time — no signup walls, no hidden
          assumptions. Every formula on this site is shown, not hidden behind a black box.
        </p>
        <a href="#" onClick={(e) => e.preventDefault()}>Our method <ArrowRight size={13} /></a>
      </div>
    </section>
  );
}