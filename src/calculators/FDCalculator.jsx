import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { PiggyBank, Percent, Info, ChevronDown, Landmark } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import { computeFD } from "../lib/calculators/fd.js";
import { FD_INTEREST_TAX as TAX, FD_LAWS, slabRateForIncome, surchargeRateForIncome } from "../lib/indianTax.js";
import { inr, inrWords, num } from "../lib/format.js";

const AMOUNT_CATS = [
  { value: 1000, label: "upto 1k" },
  { value: 10000, label: "10k" },
  { value: 100000, label: "1 lakh" },
  { value: 1000000, label: "10 lakhs" },
  { value: 10000000, label: "1 crore" },
  { value: 100000000, label: "10 crore" },
  { value: 1000000000, label: "100 crore" },
];

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(3);
  const [income, setIncome] = useState(1000000);
  const [lawsOpen, setLawsOpen] = useState(false);

  const result = useMemo(
    () => computeFD({ principal, rate, years }),
    [principal, rate, years]
  );

  // Section 87A rebate (new regime, resident): no tax when total taxable income ≤ ₹12L.
  const REBATE_LIMIT = 1200000;
  const totalIncome = income + result.interest;
  const coveredByRebate = totalIncome <= REBATE_LIMIT;
  const slabRate = slabRateForIncome(totalIncome);
  const surchargeRate = surchargeRateForIncome(totalIncome);
  const grossTaxOnInterest = (result.interest * slabRate) / 100;
  const rebate = coveredByRebate ? grossTaxOnInterest : 0;
  const baseTaxOnInterest = grossTaxOnInterest - rebate;
  const surcharge = baseTaxOnInterest * (surchargeRate / 100);
  const cess = (baseTaxOnInterest + surcharge) * 0.04;
  const taxOnInterest = baseTaxOnInterest + surcharge + cess;
  const afterTax = result.maturity - taxOnInterest;
  const tdsApplies = result.interest > TAX.tdsThreshold;
  const tds = Math.min(grossTaxOnInterest, (result.interest * TAX.tdsRatePct) / 100);

  return (
    <section id="fd-calc" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>FD Calculator</h2>
        <p>A lump sum fixed deposit that grows with quarterly-compounded interest.</p>
      </div>

      <CalcInfo why="to compare bank fixed-deposit returns and see how much a lump sum earns over a fixed term." />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><PiggyBank size={16} /> Deposit</h3>
            <Field label="Principal Amount" value={principal} onChange={setPrincipal} min={100} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="The lump sum you deposit." />
          </div>

          <div className="panel-group">
            <h3><Percent size={16} /> Rate &amp; Term</h3>
            <Field label="Annual Rate" value={rate} onChange={setRate} min={0.5} max={20} step={0.25} unit="%" helper="Annual interest rate offered by the bank." />
            <Field label="Tenure" value={years} onChange={setYears} min={1} max={40} step={1} unit=" yrs" helper="How long the deposit stays locked." />
          </div>

          <div className="panel-group">
            <h3><Landmark size={16} /> Taxation (Income Tax)</h3>
            <Field label="Your Taxable Income" value={income} onChange={setIncome} min={0} max={10000000} step={50000} prefix="₹" log
              categories={[
                { value: 100000, label: "1L" },
                { value: 1200000, label: "12L" },
                { value: 5000000, label: "50L" },
                { value: 10000000, label: "1Cr" },
              ]}
              format={(v) => (v >= 10000000 ? "1 Cr+" : inr(v))} helper="Approx annual taxable income before FD interest — added to the interest to pick your slab. Tax-free if the total stays under ₹12 lakh." />
            <div className="tax-readout">
              <div><span>Marginal slab rate</span><strong>{slabRate}%</strong></div>
              {surchargeRate > 0 && <div><span>Surcharge<span className="helper-dot" data-tip="Surcharge is tax on tax — a % of the interest tax, not of the interest itself. Applied when total income crosses ₹50L." title="Tax on tax"><Info size={12} /></span></span><strong>{surchargeRate}% of tax</strong></div>}
              <div><span>Rebate (Sec 87A)</span><strong>{coveredByRebate ? `No tax (≤₹${num(REBATE_LIMIT)})` : `Not available`}</strong></div>
              <div><span>Interest taxable as</span><strong>{TAX.head}</strong></div>
              <div>
                <span>TDS (Sec 194A)
                  <span className="helper-dot" data-tip={`Banks deduct ${TAX.tdsRatePct}% TDS (${TAX.tdsRatePct * 2}% without PAN) on interest above ₹${num(TAX.tdsThreshold)} (₹${num(TAX.seniorTdsThreshold)} for seniors) — this is credited against your final tax.`} title="TDS info"><Info size={12} /></span>
                </span>
                <strong>{tdsApplies ? `${TAX.tdsRatePct}% deducted` : "Below threshold"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ------ results ------ */}
        <div className="results-col">
          <div className="panel passbook">
            <div className="stamp"><PiggyBank size={20} /><span>Deposit<br />Verified</span></div>
            <h3>FD Passbook</h3>
            <div className="passbook-row"><span>Principal</span><b>{inrWords(result.invested)}</b></div>
            <div className="passbook-row"><span>Interest Earned</span><b>{inrWords(result.interest)}</b></div>
            <div className="passbook-row muted"><span>Tax on Interest ({slabRate}%)</span><b>− {inrWords(grossTaxOnInterest)}</b></div>
            {coveredByRebate && <div className="passbook-row rebate"><span>Rebate (Sec 87A)</span><b>+ {inrWords(rebate)}</b></div>}
            {surchargeRate > 0 && !coveredByRebate && <div className="passbook-row muted"><span>Surcharge ({surchargeRate}%)<span className="helper-dot" data-tip={`Surcharge is tax ON the interest tax — ${surchargeRate}% of the tax amount (not of the interest). E.g. ₹${num(baseTaxOnInterest)} tax × ${surchargeRate}% = ₹${num(surcharge)}.`} title="Tax on tax"><Info size={12} /></span></span><b>− {inrWords(surcharge)}</b></div>}
            <div className="passbook-row muted"><span>Health &amp; Ed. Cess (4%)</span><b>− {inrWords(cess)}</b></div>
            <div className="divider" />
            <div className="passbook-row final"><span>Total Tax</span><b>{inrWords(taxOnInterest)}</b></div>
            <div className="passbook-row final"><span>Maturity Value</span><b>{inrWords(result.maturity)}</b></div>
            <div className="passbook-row final"><span>After Tax</span><b>{inrWords(afterTax)}</b></div>
            <div className="passbook-grid">
              <div><span>Compounds</span><strong>{num(result.quarters)}</strong><em>quarterly</em></div>
              <div><span>Effective Rate</span><strong>{(Math.pow(1 + result.quarterlyRate, 4) - 1) * 100 >= 0 ? ((Math.pow(1 + result.quarterlyRate, 4) - 1) * 100).toFixed(2) : "0.00"}%</strong><em>p.a. compounded</em></div>
              <div><span>TDS (Sec 194A)</span><strong>{tdsApplies ? inrWords(tds) : "Nil"}</strong><em>{tdsApplies ? `deducted when interest > ₹${num(TAX.tdsThreshold)}` : "below the TDS threshold"}</em></div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Balance vs Principal</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.yearly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fdBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="fdInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(236,234,248,0.08)" vertical={false} />
                  <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} stroke="#9C9AB8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} stroke="#9C9AB8" fontSize={12} tickLine={false} axisLine={false} width={48} />
                  <Tooltip
                    contentStyle={{ background: "#10101C", border: "1px solid rgba(34,211,238,0.35)", borderRadius: 8, fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(v, n) => [inrWords(v), n === "balance" ? "Balance" : "Principal"]}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#22D3EE" strokeWidth={2} fill="url(#fdBalance)" name="balance" />
                  <Area type="monotone" dataKey="invested" stroke="#A78BFA" strokeWidth={2} fill="url(#fdInvested)" name="invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              <span><i style={{ background: "#22D3EE" }} /> Balance</span>
              <span><i style={{ background: "#A78BFA" }} /> Principal</span>
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer-inline">
        <Info size={13} /> Simplified model: interest is compounded quarterly on the deposit. FD interest is taxable as income at your slab rate; senior citizens often get a higher rate. Not financial advice.
      </p>

      <div className="laws-block">
        <button className="laws-toggle" onClick={() => setLawsOpen((v) => !v)} aria-expanded={lawsOpen}>
          <span>Indian tax laws that apply to FD interest</span>
          <ChevronDown size={16} className={`laws-chev ${lawsOpen ? "open" : ""}`} />
        </button>
        {lawsOpen && (
          <div className="laws-list">
            {FD_LAWS.map((law) => (
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