import React from "react";
import { Sparkles } from "lucide-react";

// A quick one-line "why use it" explainer shown above each calculator.
export default function CalcInfo({ why }) {
  return (
    <div className="calc-info">
      <span className="calc-info-ic"><Sparkles size={14} /></span>
      <p><strong>Why use it</strong> {why}</p>
    </div>
  );
}