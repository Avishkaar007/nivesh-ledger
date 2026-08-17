import React, { useState } from "react";
import { Menu, X, ChevronDown, Landmark, ArrowRight } from "lucide-react";
import { roadmap } from "../data/roadmap.js";
import { scrollToId } from "../lib/scroll.js";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const go = (id) => {
    setMenuOpen(false);
    setCalcOpen(false);
    scrollToId(id);
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); go("top"); }}>
          <span className="brand-mark"><Landmark size={18} /></span>
          <span className="brand-text">Nivesh<em>Ledger</em></span>
        </a>

        <nav className="nav-links">
          <div
            className="nav-dropdown"
            onMouseEnter={() => setCalcOpen(true)}
            onMouseLeave={() => setCalcOpen(false)}
          >
            <button className="nav-link" onClick={() => setCalcOpen((v) => !v)}>
              Calculators <ChevronDown size={14} />
            </button>
            {calcOpen && (
              <div className="dropdown-panel">
                {roadmap.map((r) => (
                  <a
                    key={r.name}
                    href={`#${r.sectionId}`}
                    className={`dropdown-item ${r.status}`}
                    onClick={(e) => { e.preventDefault(); go(r.sectionId); }}
                  >
                    <r.icon size={15} />
                    <span>{r.name}</span>
                    <em className={`tag ${r.status}`}>{r.status === "live" ? "Live" : "Soon"}</em>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#roadmap" className="nav-link" onClick={(e) => { e.preventDefault(); go("roadmap"); }}>Roadmap</a>
          <a href="#tax-guide" className="nav-link" onClick={(e) => { e.preventDefault(); go("tax-guide"); }}>Tax Guide</a>
          <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); go("about"); }}>About</a>
        </nav>

        <a href="#calculator" className="nav-cta" onClick={(e) => { e.preventDefault(); go("calculator"); }}>
          Open SIP Calculator <ArrowRight size={14} />
        </a>

        <button className="nav-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {roadmap.map((r) => (
            <a key={r.name} href={`#${r.sectionId}`} onClick={(e) => { e.preventDefault(); go(r.sectionId); }}>
              {r.name} <em className={`tag ${r.status}`}>{r.status === "live" ? "Live" : "Soon"}</em>
            </a>
          ))}
          <a href="#tax-guide" onClick={(e) => { e.preventDefault(); go("tax-guide"); }}>Tax Guide</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); go("about"); }}>About</a>
        </div>
      )}
    </header>
  );
}