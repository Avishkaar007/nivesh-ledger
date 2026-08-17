import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Repeat, Percent, Info } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import TaxSection from "../components/TaxSection.jsx";
import { computeSWP } from "../lib/calculators/swp.js";
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

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(10000000);
  const [withdrawal, setWithdrawal] = useState(50000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [taxMode, setTaxMode] = useState("indian");
  const [customLtcg, setCustomLtcg] = useState(TAX.ltcgRatePct);
  const [customStcg, setCustomStcg] = useState(TAX.stcgRatePct);
  const [customExemption, setCustomExemption] = useState(TAX.ltcgAnnualExemption);

  const result = useMemo(
    () => computeSWP({ corpus, withdrawal, rate, years }),
    [corpus, withdrawal, rate, years]
  );

  const gains = Math.max(0, result.totalWithdrawn + result.balance - result.corpus);
  const tax = useMemo(
    () => applyCapitalGainsTax({ gains, years, taxMode, customLtcg, customStcg, customExemption }),
    [gains, years, taxMode, customLtcg, customStcg, customExemption]
  );

  const shortfall = result.depletes ? result.totalWithdrawn - result.corpus - result.earned : 0;

  return (
    <section id="swp-calc" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>SWP Calculator</h2>
        <p>Withdraw a fixed amount monthly from your corpus while it keeps earning — and see how long it lasts.</p>
      </div>

      <CalcInfo
        what="how long a corpus lasts while you withdraw a fixed monthly amount from it."
        concept="withdrawals are funded by the returns earned plus a share of the principal."
        why="to plan retirement income or regular payouts without outliving your money."
      />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><Repeat size={16} /> Withdrawal</h3>
            <Field label="Initial Corpus" value={corpus} onChange={setCorpus} min={100} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="The lump sum you start withdrawing from." />
            <Field label="Monthly Withdrawal" value={withdrawal} onChange={setWithdrawal} min={100} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="Fixed amount taken out every month." />
          </div>

          <div className="panel-group">
            <h3><Percent size={16} /> Rate &amp; Term</h3>
            <Field label="Annual Return" value={rate} onChange={setRate} min={0.5} max={20} step={0.25} unit="%" helper="Expected return on the remaining corpus." />
            <Field label="Withdrawal Period" value={years} onChange={setYears} min={1} max={40} step={1} unit=" yrs" helper="How long you plan to withdraw." />
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
            <div className="stamp"><Repeat size={20} /><span>Withdrawals<br />Verified</span></div>
            <h3>SWP Passbook</h3>
            <div className="passbook-row"><span>Total Withdrawn</span><b>{inrWords(result.totalWithdrawn)}</b></div>
            <div className="passbook-row"><span>Earnings Used</span><b>{inrWords(result.earned)}</b></div>
            <div className="passbook-row muted"><span>Capital Gains Tax ({tax.regime})</span><b>− {inrWords(tax.tax)}</b></div>
            <div className="divider" />
            <div className="passbook-row final">
              <span>Corpus at End</span>
              <b className={result.depletes ? "neg" : ""}>{result.depletes ? "Exhausted" : inrWords(result.balance)}</b>
            </div>
            <div className="passbook-grid">
              <div>
                <span>Lasts</span>
                <strong>{num(result.yearsLasted)} yrs</strong>
                <em>{result.depletes ? "corpus runs out" : "still has money left"}</em>
              </div>
              <div>
                <span>Monthly</span>
                <strong>{inrWords(result.withdrawal)}</strong>
                <em>fixed withdrawal</em>
              </div>
              <div>
                <span>Shortfall</span>
                <strong className={result.depletes ? "neg" : ""}>{result.depletes ? inrWords(-shortfall) : "None"}</strong>
                <em>{result.depletes ? "beyond what corpus covers" : "corpus fully covers it"}</em>
              </div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Remaining Balance vs Total Withdrawn</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.yearly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="swpBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="swpWithdrawn" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(v, n) => [inrWords(v), n === "balance" ? "Balance" : "Withdrawn"]}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#22D3EE" strokeWidth={2} fill="url(#swpBalance)" name="balance" />
                  <Area type="monotone" dataKey="withdrawn" stroke="#A78BFA" strokeWidth={2} fill="url(#swpWithdrawn)" name="withdrawn" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              <span><i style={{ background: "#22D3EE" }} /> Remaining Balance</span>
              <span><i style={{ background: "#A78BFA" }} /> Total Withdrawn</span>
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer-inline">
        <Info size={13} /> Simplified model: fixed monthly withdrawal and a constant return. Real SWP funds fluctuate with markets and may deplete faster. Not financial advice.
      </p>
    </section>
  );
}