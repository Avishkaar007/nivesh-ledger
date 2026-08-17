import React from "react";
import { roadmap } from "../data/roadmap.js";

export default function CalculatorGrid({ onOpen }) {
  return (
    <section className="calc-home">
      <div className="section-head">
        <span className="eyebrow">Pick a calculator</span>
        <h2>Every rupee, accounted for</h2>
        <p>Choose a calculator. Each one shows its math, not a black box.</p>
      </div>

      <div className="calculator-grid">
        {roadmap.map((r) => {
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
      </div>
    </section>
  );
}