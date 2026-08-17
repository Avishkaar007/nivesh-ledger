import React, { useState, useMemo } from "react";
import { Percent, Wallet, Landmark, Info, ChevronDown, BadgeIndianRupee } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import { computeIncomeTax } from "../lib/calculators/incomeTax.js";
import { INCOME_TAX_LAWS, NEW_REGIME_SLABS, slabRateForIncome } from "../lib/indianTax.js";
import { inr, inrWords, num } from "../lib/format.js";

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1500000);
  const [isSalaried, setIsSalaried] = useState(true);
  const [regime, setRegime] = useState("new");
  const [lawsOpen, setLawsOpen] = useState(false);

  const result = useMemo(
    () => computeIncomeTax({ grossIncome, isSalaried, regime }),
    [grossIncome, isSalaried, regime]
  );

  const slab = regime === "new" ? NEW_REGIME_SLABS : null;

  return (
    <section id="incometax-calc" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>Income Tax Calculator</h2>
        <p>New vs Old regime, with the ₹12L rebate, ₹75k standard deduction, marginal relief, surcharge and cess.</p>
      </div>

      <CalcInfo why="to see exactly how much tax you owe on your salary and whether the new or old regime saves you more." />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><Wallet size={16} /> Income</h3>
            <Field
              label="Gross Annual Income" value={grossIncome} onChange={setGrossIncome}
              min={0} max={100000000} step={50000} prefix="₹" log
              categories={[
                { value: 100000, label: "1L" },
                { value: 1200000, label: "12L" },
                { value: 5000000, label: "50L" },
                { value: 10000000, label: "1Cr" },
                { value: 50000000, label: "5Cr" },
              ]}
              format={(v) => (v >= 100000000 ? "10 Cr+" : inr(v))}
              helper="Your total annual income before tax."
            />
            <div className="field">
              <div className="field-head"><label>Employment</label></div>
              <div className="segmented wide">
                <button className={isSalaried ? "active" : ""} onClick={() => setIsSalaried(true)}>Salaried</button>
                <button className={!isSalaried ? "active" : ""} onClick={() => setIsSalaried(false)}>Self-employed</button>
              </div>
            </div>
          </div>

          <div className="panel-group">
            <h3><Landmark size={16} /> Regime</h3>
            <div className="segmented wide">
              <button className={regime === "new" ? "active" : ""} onClick={() => setRegime("new")}>New Regime</button>
              <button className={regime === "old" ? "active" : ""} onClick={() => setRegime("old")}>Old Regime</button>
            </div>
            <div className="tax-readout">
              <div><span>Your marginal slab</span><strong>{slabRateForIncome(result.taxableIncome)}%</strong></div>
              {result.surchargeRate > 0 && <div><span>Surcharge<span className="helper-dot" data-tip="Surcharge is tax on tax — a % of your income-tax amount, not of your income. Applied above ₹50L." title="Tax on tax"><Info size={12} /></span></span><strong>{result.surchargeRate}% of tax</strong></div>}
              <div><span>Rebate threshold</span><strong>₹{num(result.rebateLimit)}</strong></div>
              <div><span>Standard deduction</span><strong>{result.stdDeduction ? inrWords(result.stdDeduction) : "N/A"}</strong></div>
            </div>
          </div>
        </div>

        {/* ------ results ------ */}
        <div className="results-col">
          <div className="panel passbook">
            <div className="stamp"><BadgeIndianRupee size={20} /><span>Tax<br />Verified</span></div>
            <h3>Tax Passbook</h3>
            <div className="passbook-row"><span>Gross Income</span><b>{inrWords(result.grossIncome)}</b></div>
            <div className="passbook-row"><span>Less: Standard Deduction</span><b>− {inrWords(result.stdDeduction)}</b></div>
            <div className="passbook-row"><span>Taxable Income</span><b>{inrWords(result.taxableIncome)}</b></div>
            <div className="passbook-row muted"><span>Tax before rebate</span><b>{inrWords(result.baseTax)}</b></div>
            <div className="passbook-row muted"><span>Rebate / relief</span><b>− {inrWords(result.relief)}</b></div>
            <div className="divider" />
            <div className="passbook-row final"><span>Income Tax</span><b>{inrWords(result.tax)}</b></div>
            {result.surchargeRate > 0 && <div className="passbook-row muted"><span>Surcharge ({result.surchargeRate}%)<span className="helper-dot" data-tip={`Surcharge is tax ON your tax — ${result.surchargeRate}% of the income-tax amount (not of your income). E.g. ₹10L tax × ${result.surchargeRate}% = ₹${num(result.surcharge)}.`} title="Surcharge = tax on tax"><Info size={12} /></span></span><b>+ {inrWords(result.surcharge)}</b></div>}
            <div className="passbook-row muted"><span>Health &amp; Ed. Cess (4%)</span><b>+ {inrWords(result.cess)}</b></div>
            <div className="passbook-row final"><span>Total Payable</span><b>{inrWords(result.total)}</b></div>
            <div className="passbook-grid">
              <div><span>Effective rate</span><strong>{result.effectiveRate.toFixed(1)}%</strong><em>of gross income</em></div>
              <div><span>Rebate</span><strong>{result.aboveLimit ? "Not available" : "Full"}</strong><em>income {result.aboveLimit ? "above" : "within"} ₹{num(result.rebateLimit)}</em></div>
              <div><span>Regime</span><strong>{result.regimeLabel}</strong><em>{result.law}</em></div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Tax by Slab</h3>
            <div className="slab-list">
              {(result.breakdown.length ? result.breakdown : slab ? slab.map((s, i) => ({ label: s.upTo >= 1e8 ? `above ${s.upTo}` : `up to ${s.upTo}`, rate: s.rate, amount: 0, tax: 0 })) : []).map((b, i) => (
                <div className="slab-row" key={i}>
                  <span className="slab-range">{b.label}</span>
                  <span className="slab-rate">{b.rate}%</span>
                  <span className="slab-tax">{inrWords(b.tax)}</span>
                </div>
              ))}
              {result.taxableIncome <= result.rebateLimit && result.relief > 0 && (
                <div className="slab-row rebate">
                  <span className="slab-range">Rebate (Sec 87A)</span>
                  <span className="slab-rate">87A</span>
                  <span className="slab-tax">− {inrWords(result.relief)}</span>
                </div>
              )}
              {result.taxableIncome > result.rebateLimit && (
                <div className="slab-row cliff">
                  <span className="slab-range">Marginal relief</span>
                  <span className="slab-rate">cap</span>
                  <span className="slab-tax">− {inrWords(result.relief)}</span>
                </div>
              )}
              <div className="slab-row total">
                <span className="slab-range">Net tax</span>
                <span className="slab-rate">{result.tax === 0 ? "₹0" : "base"}</span>
                <span className="slab-tax">{inrWords(result.tax)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer-inline">
        <Info size={13} /> For resident individuals, new regime FY 2026-27. Surcharge and cess simplified (marginal relief on surcharge not modelled). Always confirm with your CA or the Income-tax portal. Not financial advice.
      </p>

      <div className="laws-block">
        <button className="laws-toggle" onClick={() => setLawsOpen((v) => !v)} aria-expanded={lawsOpen}>
          <span>Indian income-tax laws that apply</span>
          <ChevronDown size={16} className={`laws-chev ${lawsOpen ? "open" : ""}`} />
        </button>
        {lawsOpen && (
          <div className="laws-list">
            {INCOME_TAX_LAWS.map((law) => (
              <div className="law-item" key={law.section}>
                <span className="law-sec">{law.section}</span>
                <h4>{law.title}</h4>
                <p>{law.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}