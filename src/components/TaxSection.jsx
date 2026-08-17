import React from "react";
import { Percent } from "lucide-react";
import Field from "./Field.jsx";
import { inrWords } from "../lib/format.js";
import { EQUITY_CAPITAL_GAINS as TAX } from "../lib/indianTax.js";

// Reusable capital-gains tax selector + readout for market-linked calculators.
// Lets the user keep India's FY 2026-27 rules or override them with a custom rate.
export default function TaxSection({
  taxMode,
  setTaxMode,
  customLtcg,
  setCustomLtcg,
  customStcg,
  setCustomStcg,
  customExemption,
  setCustomExemption,
  regime,
}) {
  return (
    <div className="panel-group">
      <h3><Percent size={16} /> Taxation</h3>
      <div className="segmented wide">
        <button className={taxMode === "indian" ? "active" : ""} onClick={() => setTaxMode("indian")}>
          Indian Rules ({TAX.fiscalYear})
        </button>
        <button className={taxMode === "custom" ? "active" : ""} onClick={() => setTaxMode("custom")}>
          Custom Rate
        </button>
      </div>

      {taxMode === "indian" ? (
        <div className="tax-readout">
          <div><span>Holding {regime === "LTCG" ? "≥ 12 months" : "< 12 months"}</span><strong>{regime}</strong></div>
          <div><span>Applicable rate</span><strong>{regime === "LTCG" ? `${TAX.ltcgRatePct}%` : `${TAX.stcgRatePct}%`} (Sec {regime === "LTCG" ? "112A" : "111A"})</strong></div>
          <div><span>Annual exemption</span><strong>{regime === "LTCG" ? inrWords(TAX.ltcgAnnualExemption) : "None"}</strong></div>
          <p className="fine-print">Per the {TAX.law}, effective {TAX.effectiveFrom} — unchanged through Union Budget 2026.</p>
        </div>
      ) : (
        <>
          <Field label="Custom LTCG Rate" value={customLtcg} onChange={setCustomLtcg} min={0} max={42.74} step={0.1} unit="%" helper="Applied when holding is 12 months or more." />
          <Field label="Custom STCG Rate" value={customStcg} onChange={setCustomStcg} min={0} max={42.74} step={0.1} unit="%" helper="Applied when holding is under 12 months." />
          <Field label="Annual Exemption" value={customExemption} onChange={setCustomExemption} min={0} max={500000} step={5000} prefix="₹" helper="Annual tax-free capital gains threshold before tax applies." />
        </>
      )}
    </div>
  );
}