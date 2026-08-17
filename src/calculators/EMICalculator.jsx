import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Car, TrendingUp, Percent, Info } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import { computeEMI } from "../lib/calculators/emi.js";
import { inrWords, num } from "../lib/format.js";

// Log-scale markers, each a power of 10 so the slider reaches exactly 10^n at the bar.
const AMOUNT_CATS = [
  { value: 1000, label: "upto 1k" },
  { value: 10000, label: "10k" },
  { value: 100000, label: "1 lakh" },
  { value: 1000000, label: "10 lakhs" },
  { value: 10000000, label: "1 crore" },
  { value: 100000000, label: "10 crore" },
  { value: 1000000000, label: "100 crore" },
];

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(9);
  const [durationYears, setDurationYears] = useState(20);
  const [emiFrequency, setEmiFrequency] = useState("monthly");
  const [prepayment, setPrepayment] = useState(0);
  const [prepaymentMonth, setPrepaymentMonth] = useState(12);

  const result = useMemo(
    () => computeEMI({ loanAmount, downPayment, interestRate, durationYears, emiFrequency, prepayment, prepaymentMonth }),
    [loanAmount, downPayment, interestRate, durationYears, emiFrequency, prepayment, prepaymentMonth]
  );

  const freqLabel = emiFrequency === "monthly" ? "month" : emiFrequency === "quarterly" ? "quarter" : "year";

  return (
    <section id="emi-calc" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>EMI Calculator</h2>
        <p>Loan EMI, total interest and repayment — with the impact of a one-time prepayment, sliders or exact figures.</p>
      </div>

      <CalcInfo
        what="your monthly EMI, total interest and repayment, plus how a one-time prepayment shortens the tenure or cuts the EMI."
        concept="spreading a loan into equal payments of principal plus interest over a fixed tenure."
        why="to compare home or car loans and see how extra prepayments save interest."
      />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><Landmark size={16} /> Loan</h3>
            <Field label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={100} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="Minimum ₹100." />
            <Field label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="Reduces the amount you actually finance. 0 = finance the full loan." />
          </div>

          <div className="panel-group">
            <h3><Percent size={16} /> Terms</h3>
            <Field label="Interest Rate" value={interestRate} onChange={setInterestRate} min={1} max={30} step={0.25} unit="%" helper="Assumed annual rate for the loan." />
            <Field label="Loan Duration" value={durationYears} onChange={setDurationYears} min={1} max={40} step={1} unit=" yrs" helper="Tenure of the loan in years." />
            <div className="field">
              <div className="field-head"><label>EMI Frequency</label></div>
              <div className="segmented">
                <button className={emiFrequency === "monthly" ? "active" : ""} onClick={() => setEmiFrequency("monthly")}>Monthly</button>
                <button className={emiFrequency === "quarterly" ? "active" : ""} onClick={() => setEmiFrequency("quarterly")}>Quarterly</button>
                <button className={emiFrequency === "yearly" ? "active" : ""} onClick={() => setEmiFrequency("yearly")}>Yearly</button>
              </div>
            </div>
          </div>

          <div className="panel-group">
            <h3><TrendingUp size={16} /> Prepayment</h3>
            <Field label="One-time Prepayment" value={prepayment} onChange={setPrepayment} min={0} max={1000000000} step={100} prefix="₹" log categories={AMOUNT_CATS} helper="A lump sum paid once against the principal. 0 = no prepayment." />
            <Field label="Prepay After" value={prepaymentMonth} onChange={setPrepaymentMonth} min={0} max={Math.round(durationYears * 12)} step={1} unit=" mo" helper="Months from start when the lump is applied (0 = upfront)." />
          </div>
        </div>

        {/* ------ results ------ */}
        <div className="results-col">
          <div className="panel passbook">
            <div className="stamp"><Landmark size={20} /><span>Loan<br />Verified</span></div>
            <h3>Loan Passbook</h3>
            <div className="passbook-row"><span>Loan Principal</span><b>{inrWords(result.principal)}</b></div>
            <div className="passbook-row"><span>Total Interest</span><b>{inrWords(result.totalInterest)}</b></div>
            <div className="passbook-row"><span>Total Repayment</span><b>{inrWords(result.totalRepayment)}</b></div>
            <div className="divider" />
            <div className="passbook-row final"><span>EMI <em>(per {freqLabel})</em></span><b>{inrWords(result.emi)}</b></div>
            <div className="passbook-grid">
              <div><span>Revised EMI</span><strong>{inrWords(result.revisedEMI)}</strong><em>same tenure, lower EMI</em></div>
              <div><span>Revised Tenure</span><strong>{num(result.revisedTenure.toFixed(1))} yrs</strong><em>(original {num(durationYears)} yrs)</em></div>
              <div><span>Prepayment</span><strong>{inrWords(result.prepayment)}</strong><em>{result.prepaymentMonth <= 0 ? "upfront lump" : `after ${result.prepaymentMonth} mo`}</em></div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Outstanding Balance vs Principal Paid</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.yearly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="paidFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="intFill" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(v, n) => [inrWords(v), n === "balance" ? "Balance" : n === "principalPaid" ? "Principal Paid" : "Interest Paid"]}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#22D3EE" strokeWidth={2} fill="url(#balFill)" name="balance" />
                  <Area type="monotone" dataKey="principalPaid" stroke="#A78BFA" strokeWidth={2} fill="url(#paidFill)" name="principalPaid" />
                  <Area type="monotone" dataKey="interestPaid" stroke="#FB7185" strokeWidth={2} fill="url(#intFill)" name="interestPaid" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              <span><i style={{ background: "#22D3EE" }} /> Outstanding Balance</span>
              <span><i style={{ background: "#A78BFA" }} /> Principal Paid</span>
              <span><i style={{ background: "#FB7185" }} /> Interest Paid</span>
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer-inline">
        <Info size={13} /> Simplified model: assumes a fixed rate for the whole tenure and a single prepayment applied up front. Actual loans may have floating rates, processing fees, and part-payment rules. Not financial advice.
      </p>
    </section>
  );
}
