import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { PiggyBank, Percent, Info } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import TaxSection from "../components/TaxSection.jsx";
import { computeCompoundInterest } from "../lib/calculators/compound.js";
import { applyCapitalGainsTax } from "../lib/calculators/tax.js";
import { EQUITY_CAPITAL_GAINS as TAX } from "../lib/indianTax.js";
import { inrWords, num } from "../lib/format.js";

const AMOUNT_CATS = [
  { value: 1000, label: "upto 1k" },
  { value: 10000, label: "10k" },
  { value: 100000, label: "1 lakh" },
  { value: 1000000, label: "10 lakhs" },
  { value: 10000000, label: "1 crore" },
  { value: 100000000, label: "10 crore" },
  { value: 1000000000, label: "100 crore" },
];

const FREQS = [
  { key: "yearly", label: "Yearly" },
  { key: "half-yearly", label: "Half-yearly" },
  { key: "quarterly", label: "Quarterly" },
  { key: "monthly", label: "Monthly" },
];

const FREQ_LABEL = { yearly: "year", "half-yearly": "half-year", quarterly: "quarter", monthly: "month" };

export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState("yearly");
  const [taxMode, setTaxMode] = useState("indian");
  const [customLtcg, setCustomLtcg] = useState(TAX.ltcgRatePct);
  const [customStcg, setCustomStcg] = useState(TAX.stcgRatePct);
  const [customExemption, setCustomExemption] = useState(TAX.ltcgAnnualExemption);

  const result = useMemo(
    () => computeCompoundInterest({ principal, rate, years, frequency }),
    [principal, rate, years, frequency]
  );

  const gains = result.interest;
  const tax = useMemo(
    () => applyCapitalGainsTax({ gains, years, taxMode, customLtcg, customStcg, customExemption }),
    [gains, years, taxMode, customLtcg, customStcg, customExemption]
  );

  const growth = Math.max(0, result.maturity - result.invested);
  const postTaxMaturity = principal + tax.postTaxValue;

  return (
    <section id="compound-calc" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>Compound Interest Calculator</h2>
        <p>See how a lump sum grows with compounding over time.</p>
      </div>

      <CalcInfo
        what="the maturity value of a lump sum as it earns interest that is itself reinvested."
        concept="interest is added to the principal, so the balance grows exponentially over time."
        why="to see the long-term power of compounding on savings or investments."
      />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><PiggyBank size={16} /> Principal</h3>
            <Field label="Initial Amount" value={principal} onChange={setPrincipal} min={100} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="The lump sum you start with." />
          </div>

          <div className="panel-group">
            <h3><Percent size={16} /> Rate &amp; Term</h3>
            <Field label="Annual Rate" value={rate} onChange={setRate} min={0.5} max={20} step={0.25} unit="%" helper="Expected annual interest rate." />
            <Field label="Time Period" value={years} onChange={setYears} min={1} max={40} step={1} unit=" yrs" helper="How long the money compounds." />
            <div className="field">
              <div className="field-head"><label>Compounding</label></div>
              <div className="segmented">
                {FREQS.map((f) => (
                  <button key={f.key} className={frequency === f.key ? "active" : ""} onClick={() => setFrequency(f.key)}>{f.label}</button>
                ))}
              </div>
            </div>
          </div>

          <TaxSection
            taxMode={taxMode} setTaxMode={setTaxMode}
            customLtcg={customLtcg} setCustomLtcg={setCustomLtcg}
            customStcg={customStcg} setCustomStcg={setCustomStcg}
            customExemption={customExemption} setCustomExemption={setCustomExemption}
            regime={tax.regime}
          />
        </div>

        {/* ------ results ------ */}
        <div className="results-col">
          <div className="panel passbook">
            <div className="stamp"><PiggyBank size={20} /><span>Wealth<br />Verified</span></div>
            <h3>Growth Passbook</h3>
            <div className="passbook-row"><span>Total Invested</span><b>{inrWords(result.invested)}</b></div>
            <div className="passbook-row"><span>Interest Earned</span><b>{inrWords(result.interest)}</b></div>
            <div className="passbook-row muted"><span>Capital Gains Tax ({tax.regime})</span><b>− {inrWords(tax.tax)}</b></div>
            <div className="divider" />
            <div className="passbook-row final"><span>Maturity Value</span><b>{inrWords(result.maturity)}</b></div>
            <div className="passbook-grid">
              <div><span>After Tax</span><strong>{inrWords(postTaxMaturity)}</strong><em>{tax.regime} at {tax.rate}%</em></div>
              <div><span>Growth</span><strong>{inrWords(growth)}</strong><em>money you did not put in</em></div>
              <div><span>Compounds</span><strong>{num(years * { yearly: 1, "half-yearly": 2, quarterly: 4, monthly: 12 }[frequency])}</strong><em>times over {num(years)} yrs</em></div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Balance vs Amount Invested</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.yearly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ciBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="ciInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="ciInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FB7185" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#FB7185" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(236,234,248,0.08)" vertical={false} />
                  <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} stroke="#9C9AB8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} stroke="#9C9AB8" fontSize={12} tickLine={false} axisLine={false} width={48} />
                  <Tooltip
                    contentStyle={{ background: "#10101C", border: "1px solid rgba(34,211,238,0.35)", borderRadius: 8, fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(v, n) => [inrWords(v), n === "balance" ? "Balance" : n === "invested" ? "Invested" : "Interest"]}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#22D3EE" strokeWidth={2} fill="url(#ciBalance)" name="balance" />
                  <Area type="monotone" dataKey="invested" stroke="#A78BFA" strokeWidth={2} fill="url(#ciInvested)" name="invested" />
                  <Area type="monotone" dataKey="interest" stroke="#FB7185" strokeWidth={2} fill="url(#ciInterest)" name="interest" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              <span><i style={{ background: "#22D3EE" }} /> Balance</span>
              <span><i style={{ background: "#A78BFA" }} /> Invested</span>
              <span><i style={{ background: "#FB7185" }} /> Interest</span>
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer-inline">
        <Info size={13} /> Simplified model: assumes a fixed rate and that contributions are made at each compounding period. Real returns vary and are not guaranteed. Not financial advice.
      </p>
    </section>
  );
}