import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { CircleDollarSign, Percent, Info } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import { computeSimpleInterest } from "../lib/calculators/simple.js";
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

export default function SimpleCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);

  const result = useMemo(
    () => computeSimpleInterest({ principal, rate, years }),
    [principal, rate, years]
  );

  return (
    <section id="simple-calc" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>Simple Interest Calculator</h2>
        <p>Flat interest on the original principal — no compounding, no growth on interest.</p>
      </div>

      <CalcInfo
        what="the flat interest earned on the original principal, with no growth on interest."
        concept="interest is always charged on the initial amount, so growth is linear."
        why="to price short-term loans or bonds where interest is paid out rather than reinvested."
      />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><CircleDollarSign size={16} /> Principal</h3>
            <Field label="Principal Amount" value={principal} onChange={setPrincipal} min={100} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="The amount you lend or borrow." />
          </div>

          <div className="panel-group">
            <h3><Percent size={16} /> Rate &amp; Term</h3>
            <Field label="Annual Rate" value={rate} onChange={setRate} min={0.5} max={20} step={0.25} unit="%" helper="Simple annual interest rate." />
            <Field label="Time Period" value={years} onChange={setYears} min={1} max={40} step={1} unit=" yrs" helper="How long the interest accrues." />
          </div>
        </div>

        {/* ------ results ------ */}
        <div className="results-col">
          <div className="panel passbook">
            <div className="stamp"><CircleDollarSign size={20} /><span>Interest<br />Verified</span></div>
            <h3>Interest Passbook</h3>
            <div className="passbook-row"><span>Principal</span><b>{inrWords(result.invested)}</b></div>
            <div className="passbook-row"><span>Simple Interest</span><b>{inrWords(result.interest)}</b></div>
            <div className="divider" />
            <div className="passbook-row final"><span>Total Amount</span><b>{inrWords(result.maturity)}</b></div>
            <div className="passbook-grid">
              <div><span>Interest / Year</span><strong>{inrWords(result.interest / Math.max(1, years))}</strong><em>constant each year</em></div>
              <div><span>Rate</span><strong>{result.rate}% p.a.</strong><em>flat, not compounded</em></div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Balance vs Principal</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.yearly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="siBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="siInvested" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="balance" stroke="#22D3EE" strokeWidth={2} fill="url(#siBalance)" name="balance" />
                  <Area type="monotone" dataKey="invested" stroke="#A78BFA" strokeWidth={2} fill="url(#siInvested)" name="invested" />
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
        <Info size={13} /> Simple interest is calculated only on the original principal, so growth is linear. Most savings products compound instead. For deposits and bonds, the interest is taxable as income at your slab rate. Not financial advice.
      </p>
    </section>
  );
}