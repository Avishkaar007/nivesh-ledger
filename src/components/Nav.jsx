import React, { useState } from "react";
import { Menu, X, ChevronDown, Landmark, ArrowRight, Search } from "lucide-react";
import { roadmap } from "../data/roadmap.js";

export default function Nav({ onOpen, onHome, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const go = (id) => {
    const item = roadmap.find((r) => r.id === id);
    if (!item || item.status !== "live") return;
    setMenuOpen(false);
    setCalcOpen(false);
    onOpen(id);
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); onHome(); }}>
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
                <div className="dropdown-panel-inner">
                {roadmap.map((r) => (
                  <a
                    key={r.id}
                    href={`#${r.id}`}
                    className={`dropdown-item ${r.status}`}
                    onClick={(e) => { e.preventDefault(); go(r.id); }}
                    aria-disabled={r.status !== "live"}
                  >
                    <r.icon size={15} />
                    <span>{r.name}</span>
                    <em className={`tag ${r.status}`}>{r.status === "live" ? "Live" : "Soon"}</em>
                  </a>
                ))}
                </div>
              </div>
            )}
          </div>
          <a href="#roadmap" className="nav-link" onClick={(e) => { e.preventDefault(); onHome(); window.location.hash = "home"; requestAnimationFrame(() => setTimeout(() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" }), 120)); }}>Roadmap</a>
          <a href="#tax-guide" className="nav-link" onClick={(e) => { e.preventDefault(); onHome(); window.location.hash = "home"; requestAnimationFrame(() => setTimeout(() => document.getElementById("tax-guide")?.scrollIntoView({ behavior: "smooth" }), 120)); }}>Tax Guide</a>
          <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); onHome(); window.location.hash = "home"; requestAnimationFrame(() => setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 120)); }}>About</a>
        </nav>

        <button className="nav-search" onClick={onSearch} aria-label="Search calculators (Cmd+K)">
          <Search size={15} />
          <span>Search</span>
          <kbd>⌘K</kbd>
        </button>

        <a href="#sip" className="nav-cta" onClick={(e) => { e.preventDefault(); onOpen("sip"); }}>
          Open SIP Calculator <ArrowRight size={14} />
        </a>

        <button className="nav-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {roadmap.map((r) => (
            <a key={r.id} href={`#${r.id}`} onClick={(e) => { e.preventDefault(); go(r.id); }}>
              {r.name} <em className={`tag ${r.status}`}>{r.status === "live" ? "Live" : "Soon"}</em>
            </a>
          ))}
          <a href="#tax-guide" onClick={(e) => { e.preventDefault(); onHome(); }}>Tax Guide</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); onHome(); }}>About</a>
        </div>
      )}
    </header>
  );
}
