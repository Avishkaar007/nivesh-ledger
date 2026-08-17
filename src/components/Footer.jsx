import React from "react";
// import { Landmark, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { roadmap } from "../data/roadmap.js";
import { scrollToId } from "../lib/scroll.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          {/* <span className="brand-mark"><Landmark size={18} /></span> */}
          <span className="brand-text">Nivesh<em>Ledger</em></span>
          <p>Money calculators for the way Indians actually invest.</p>
          {/* <div className="socials">
            <a href="#" aria-label="Twitter" onClick={(e) => e.preventDefault()}><Twitter size={16} /></a>
            <a href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}><Linkedin size={16} /></a>
            <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}><Instagram size={16} /></a>
            <a href="#" aria-label="YouTube" onClick={(e) => e.preventDefault()}><Youtube size={16} /></a>
          </div> */}
        </div>

        <div className="footer-col">
          <h5>Calculators</h5>
          {roadmap.map((r) => (
            <a key={r.name} href={`#${r.sectionId}`} onClick={(e) => { e.preventDefault(); scrollToId(r.sectionId); }}>
              {r.name}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }}>About</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Our Method</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Careers</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Press Kit</a>
        </div>
        <div className="footer-col">
          <h5>Resources</h5>
          <a href="#tax-guide" onClick={(e) => { e.preventDefault(); scrollToId("tax-guide"); }}>FY 25-26 Tax Guide</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Glossary</a>
          <a href="#" onClick={(e) => e.preventDefault()}>FAQs</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Blog</a>
        </div>
        <div className="footer-col">
          <h5>Legal</h5>
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms of Use</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Disclaimer</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Grievance Redressal</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Nivesh Ledger. Not a SEBI-registered investment adviser.</span>
        <span>All figures are illustrative and not a guarantee of future returns.</span>
      </div>
    </footer>
  );
}