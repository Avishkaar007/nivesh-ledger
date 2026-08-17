import React from "react";
import { ArrowRight } from "lucide-react";
import { scrollToId } from "../lib/scroll.js";
import { roadmap } from "../data/roadmap.js";

export default function Hero() {
  const liveCount = roadmap.filter((r) => r.status === "live").length;
  const soonCount = roadmap.filter((r) => r.status === "soon").length;

  return (
    <section id="top" className="hero">
      <div className="hero-inner">
        <span className="eyebrow">A growing suite of money calculators</span>
        <h1>
          Every rupee, <em>tracked</em>
          <br />
          to its rightful place.
        </h1>
        <p className="hero-sub">
          Nivesh Ledger is a home for the calculators every Indian investor reaches for —
          starting with SIPs, and built to hold a full shelf of them: loans, deposits, retirement, and tax.
        </p>
        <div className="hero-actions">
          <a href="#calculator" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollToId("calculator"); }}>
            Calculate your SIP <ArrowRight size={16} />
          </a>
          <a href="#roadmap" className="btn-ghost" onClick={(e) => { e.preventDefault(); scrollToId("roadmap"); }}>
            See what's next
          </a>
        </div>
        <div className="hero-stats">
          <div><strong>{liveCount}</strong><span>calculator{liveCount === 1 ? "" : "s"} live</span></div>
          <div><strong>{soonCount}</strong><span>entering the ledger</span></div>
          <div><strong>FY 25-26</strong><span>tax rules built in</span></div>
        </div>
      </div>
    </section>
  );
}