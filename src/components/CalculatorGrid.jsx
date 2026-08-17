import React, { useState } from "react";
import { Search } from "lucide-react";
import { roadmap } from "../data/roadmap.js";

export default function CalculatorGrid({ onOpen, searchActive = false }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = roadmap.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.blurb.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
  );

  return (
    <section className="calc-home">
      <div className="section-head">
        <span className="eyebrow">Pick a calculator</span>
        <h2>Every rupee, accounted for</h2>
        <p>Choose a calculator. Each one shows its math, not a black box.</p>
      </div>

      <div className={`calc-search${searchActive ? " spotlight" : ""}`}>
        <Search size={16} />
        <input
          id="calc-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators… e.g. EMI, SIP, tax"
          aria-label="Search calculators"
        />
        {query && <button className="calc-search-clear" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
      </div>

      <div className="calculator-grid">
        {results.map((r) => {
          const live = r.status === "live";
          return (
            <button
              key={r.id}
              className={`calc-card ${live ? "" : "disabled"}`}
              disabled={!live}
              onClick={() => live && onOpen(r.id)}
            >
              <r.icon size={22} />
              <h4>{r.name}</h4>
              <p>{r.blurb}</p>
              <em className={`tag ${r.status}`}>{live ? "Open" : "Coming soon"}</em>
            </button>
          );
        })}
        {q && results.length === 0 && (
          <div className="calc-no-results">No calculators match “{query}”.</div>
        )}
      </div>
    </section>
  );
}