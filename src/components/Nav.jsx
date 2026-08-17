import React, { useState } from "react";
import { Menu, X, ChevronDown, Landmark, ArrowRight, Search, Moon, Sun, Sunrise } from "lucide-react";
import { roadmap } from "../data/roadmap.js";

const THEME_ICONS = { dark: Moon, light: Sun, sunlight: Sunrise };
const THEME_LABEL = { dark: "Switch to sunlight", light: "Switch to dark", sunlight: "Switch to light" };

export default function Nav({ onOpen, onHome, searchActive = false, theme = "dark", onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results = roadmap.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.blurb.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
  );

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
          <a href="#tax-guide" className="nav-link" onClick={(e) => { e.preventDefault(); onHome(); window.location.hash = "home"; requestAnimationFrame(() => setTimeout(() => document.getElementById("tax-guide")?.scrollIntoView({ behavior: "smooth" }), 120)); }}>Tax Guide</a>
        </nav>

        <div className={`nav-search-box${searchActive ? " spotlight" : ""}`}>
          <Search size={14} />
          <input
            id="nav-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search calculators"
          />
          {query ? (
            <button className="calc-search-clear" onClick={() => setQuery("")} aria-label="Clear search">×</button>
          ) : (
            <kbd className="nav-search-kbd">⌘K</kbd>
          )}
          {query && (
            <div className="nav-search-menu">
              {results.length ? (
                results.map((r) => {
                  const live = r.status === "live";
                  return (
                    <button
                      key={r.id}
                      className={`nav-search-item ${r.status}`}
                      disabled={!live}
                      onClick={() => { setQuery(""); onOpen(r.id); }}
                    >
                      <r.icon size={14} />
                      <span>{r.name}</span>
                      <em className={`tag ${r.status}`}>{live ? "Live" : "Soon"}</em>
                    </button>
                  );
                })
              ) : (
                <div className="nav-search-empty">No matches for “{query}”</div>
              )}
            </div>
          )}
        </div>

        <button className="nav-theme" onClick={onToggleTheme} aria-label={THEME_LABEL[theme]} title={THEME_LABEL[theme]}>
          {(() => { const Icon = THEME_ICONS[theme]; return <Icon size={16} />; })()}
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
        </div>
      )}
    </header>
  );
}
