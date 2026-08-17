import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Wallet, TrendingUp, Percent, BadgeCheck, Info } from "lucide-react";
import Field from "../components/Field.jsx";
import CalcInfo from "../components/CalcInfo.jsx";
import { computeSIP } from "../lib/calculators/sip.js";
import { inrWords, pctFmt } from "../lib/format.js";
import { EQUITY_CAPITAL_GAINS as TAX } from "../lib/indianTax.js";

export default function SIPCalculator() {
  const [monthlySIP, setMonthlySIP] = useState(25000);
  const [lumpsum, setLumpsum] = useState(100000);
  const [stepUpPct, setStepUpPct] = useState(10);
  const [stepUpFreq, setStepUpFreq] = useState("annual");
  const [years, setYears] = useState(15);
  const [returnRate, setReturnRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);

  const [taxMode, setTaxMode] = useState("indian");
  const [customLtcg, setCustomLtcg] = useState(TAX.ltcgRatePct);
  const [customStcg, setCustomStcg] = useState(TAX.stcgRatePct);
  const [customExemption, setCustomExemption] = useState(TAX.ltcgAnnualExemption);

  const result = useMemo(
    () =>
      computeSIP({
        monthlySIP, lumpsum, stepUpPct, stepUpFreq, years,
        returnRate, inflationRate, taxMode, customLtcg, customStcg, customExemption,
      }),
    [monthlySIP, lumpsum, stepUpPct, stepUpFreq, years, returnRate, inflationRate, taxMode, customLtcg, customStcg, customExemption]
  );

  return (
    <section id="calculator" className="calc-section">
      <div className="section-head">
        <span className="eyebrow">Live calculator</span>
        <h2>SIP Calculator</h2>
        <p>Project a monthly SIP with step-ups, inflation, and Indian capital-gains tax — sliders or exact figures, your call.</p>
      </div>

      <CalcInfo
        what="your expected corpus from monthly SIPs, a lumpsum and step-up, shown before and after tax and inflation."
        concept="systematic investing that uses rupee-cost averaging and compounding returns."
        why="to plan long-term goals such as retirement, a house or your child's future."
      />

      <div className="calc-grid">
        {/* ------ inputs ------ */}
        <div className="panel inputs-panel">
          <div className="panel-group">
            <h3><Wallet size={16} /> Contribution</h3>
            <Field label="Monthly SIP" value={monthlySIP} onChange={setMonthlySIP} min={100} max={1000000} step={500} prefix="₹" helper="Fixed amount invested every month." />
            <Field label="Initial Lumpsum" value={lumpsum} onChange={setLumpsum} min={0} max={5000000} step={5000} prefix="₹" helper="One-time amount invested at the start. 0 = start from scratch." />
            <Field label="SIP Step-Up" value={stepUpPct} onChange={setStepUpPct} min={0} max={25} step={0.5} unit="%" helper="Annual percentage increase in your monthly SIP." />
            <div className="field">
              <div className="field-head"><label>Step-Up Frequency</label></div>
              <div className="segmented">
                <button className={stepUpFreq === "annual" ? "active" : ""} onClick={() => setStepUpFreq("annual")}>Annually</button>
                <button className={stepUpFreq === "half" ? "active" : ""} onClick={() => setStepUpFreq("half")}>Half-yearly</button>
              </div>
            </div>
          </div>

          <div className="panel-group">
            <h3><TrendingUp size={16} /> Growth Assumptions</h3>
            <Field label="Investment Duration" value={years} onChange={setYears} min={1} max={50} step={1} unit=" yrs" helper="Total time you keep investing." />
            <Field label="Expected Return Rate" value={returnRate} onChange={setReturnRate} min={1} max={30} step={0.25} unit="%" helper="Assumed annual (CAGR) growth of your investment." />
            <Field label="Inflation Rate" value={inflationRate} onChange={setInflationRate} min={0} max={15} step={0.25} unit="%" helper="Used only to compute your inflation-adjusted Real Return." />
          </div>

          <div className="panel-group">
            <h3><Percent size={16} /> Taxation</h3>
            <div className="segmented wide">
              <button className={taxMode === "indian" ? "active" : ""} onClick={() => setTaxMode("indian")}>
                Indian Tax Rules ({TAX.fiscalYear})
              </button>
              <button className={taxMode === "custom" ? "active" : ""} onClick={() => setTaxMode("custom")}>
                Custom Rate
              </button>
            </div>

            {taxMode === "indian" ? (
              <div className="tax-readout">
                <div><span>Holding {result.regime === "LTCG" ? "≥ 12 months" : "< 12 months"}</span><strong>{result.regime}</strong></div>
                <div><span>Applicable rate</span><strong>{result.regime === "LTCG" ? `${TAX.ltcgRatePct}%` : `${TAX.stcgRatePct}%`} (Sec {result.regime === "LTCG" ? "112A" : "111A"})</strong></div>
                <div><span>Annual exemption</span><strong>{result.regime === "LTCG" ? inrWords(TAX.ltcgAnnualExemption) : "None"}</strong></div>
                <p className="fine-print">Per the {TAX.law}, effective {TAX.effectiveFrom} — unchanged through Union Budget 2026.</p>
              </div>
            ) : (
              <>
                <Field label="Custom LTCG Rate" value={customLtcg} onChange={setCustomLtcg} min={0} max={42.74} step={0.1} unit="%" helper="Applied when duration is 12 months or more." />
                <Field label="Custom STCG Rate" value={customStcg} onChange={setCustomStcg} min={0} max={42.74} step={0.1} unit="%" helper="Applied when duration is under 12 months." />
                <Field label="Annual Exemption" value={customExemption} onChange={setCustomExemption} min={0} max={500000} step={5000} prefix="₹" helper="Annual tax-free capital gains threshold before tax applies." />
              </>
            )}
          </div>
        </div>

        {/* ------ results ------ */}
        <div className="results-col">
          <div className="panel passbook">
            <div className="stamp"><BadgeCheck size={20} /><span>Compounded<br />Verified</span></div>
            <h3>Investment Passbook</h3>
            <div className="passbook-row"><span>Total Investment</span><b>{inrWords(result.invested)}</b></div>
            <div className="passbook-row"><span>Wealth Gained</span><b>{inrWords(result.gains)}</b></div>
            <div className="passbook-row"><span>Total Corpus <em>(pre-tax)</em></span><b>{inrWords(result.corpus)}</b></div>
            <div className="passbook-row muted"><span>Tax Payable ({result.regime})</span><b>− {inrWords(result.tax)}</b></div>
            <div className="divider" />
            <div className="passbook-row final"><span>Final Corpus <em>(after tax)</em></span><b>{inrWords(result.postTaxCorpus)}</b></div>
            <div className="passbook-grid">
              <div className="return-block"><span>Nominal Return (XIRR)</span><strong className="pre">Pre-tax {pctFmt(result.preTaxNominal)}</strong><strong className="post">Post-tax {pctFmt(result.postTaxNominal)}</strong></div>
              <div><span>Money invested in today's terms</span><strong>{inrWords(result.investedToday)}</strong></div>
              <div><span>Value in Today's money</span><strong>{inrWords(result.valueToday)}</strong><em>(CAGR - {pctFmt(result.todayCagr)})</em></div>
            </div>
          </div>

          <div className="panel chart-panel">
            <h3>Corpus vs. Investment Over Time</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={result.yearly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="corpusFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="investedFill" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(v, n) => [inrWords(v), n === "corpus" ? "Corpus" : "Invested"]}
                  />
                  <Area type="monotone" dataKey="corpus" stroke="#22D3EE" strokeWidth={2} fill="url(#corpusFill)" name="corpus" />
                  <Area type="monotone" dataKey="invested" stroke="#A78BFA" strokeWidth={2} fill="url(#investedFill)" name="invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              <span><i style={{ background: "#22D3EE" }} /> Final Corpus</span>
              <span><i style={{ background: "#A78BFA" }} /> Total Investment</span>
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer-inline">
        <Info size={13} /> Simplified model: assumes the full corpus is redeemed together at the end of the term, and returns compound monthly at a constant rate. Real SIP taxation applies FIFO to each instalment — actual tax may differ. Not investment or tax advice.
      </p>
    </section>
  );
}