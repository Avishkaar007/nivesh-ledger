import React from "react";
import { roadmap } from "../data/roadmap.js";

export default function Roadmap() {
  return (
    <section id="roadmap" className="roadmap-section">
      <div className="section-head">
        <span className="eyebrow">Building in the open</span>
        <h2>More calculators, entering the ledger</h2>
        <p>SIP is the first entry. Here's what's being added next.</p>
      </div>
      <div className="roadmap-grid">
        {roadmap.filter((r) => r.status === "soon").map((r) => (
          <div key={r.name} className={`roadmap-card ${r.status}`}>
            <r.icon size={22} />
            <h4>{r.name}</h4>
            <p>{r.blurb}</p>
            <em className={`tag ${r.status}`}>{r.status === "live" ? "Live now" : "Coming soon"}</em>
          </div>
        ))}
      </div>
    </section>
  );
}