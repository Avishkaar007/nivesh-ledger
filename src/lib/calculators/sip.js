import { EQUITY_CAPITAL_GAINS as TAX } from "../indianTax.js";

/**
 * Extended Internal Rate of Return (XIRR).
 * Given cash flows as { t: years from start, amount }, solves for the rate r
 * such that the net present value is zero. This is the true annualised return
 * that accounts for the irregular timing of each SIP instalment (unlike a
 * simple CAGR which assumes the whole amount was invested from day one).
 */
export function xirr(cashflows) {
  if (!cashflows.length) return 0;
  const npv = (r) =>
    cashflows.reduce((s, cf) => s + cf.amount / Math.pow(1 + r, cf.t), 0);

  // At r -> -1+ the terminal (largest t) inflow dominates -> +inf.
  // At large r the terminal inflow shrinks fastest -> NPV becomes negative.
  // The zero of NPV therefore lies on (0, +inf). Bracket it with widening bisection.
  let lo = 0, hi = 1;
  for (let i = 0; i < 60 && npv(lo) * npv(hi) > 0; i++) hi *= 2;

  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    const f = npv(mid);
    if (Math.abs(f) < 1e-9 || (hi - lo) / 2 < 1e-12) return mid * 100;
    if (npv(lo) * f < 0) hi = mid;
    else lo = mid;
  }
  return ((lo + hi) / 2) * 100;
}

/**
 * Projects a monthly SIP (with optional lumpsum, step-up, and inflation)
 * and applies Indian equity capital-gains tax rules by default, or a
 * user-supplied custom rate.
 */
export function computeSIP({
  monthlySIP,
  lumpsum,
  stepUpPct,
  stepUpFreq, // "annual" | "half"
  years,
  returnRate,
  inflationRate,
  taxMode, // "indian" | "custom"
  customLtcg,
  customStcg,
  customExemption,
}) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
  const stepEvery = stepUpFreq === "half" ? 6 : 12;

  let corpus = lumpsum;
  let invested = lumpsum;
  let sip = monthlySIP;
  const cashflows = [{ t: 0, amount: -lumpsum }];
  const yearly = [{ year: 0, invested: Math.round(invested), corpus: Math.round(corpus) }];

  for (let m = 1; m <= months; m++) {
    corpus = corpus * (1 + monthlyRate) + sip;
    invested += sip;
    cashflows.push({ t: m / 12, amount: -sip });
    if (m % stepEvery === 0) sip = sip * (1 + stepUpPct / 100);
    if (m % 12 === 0) {
      yearly.push({ year: m / 12, invested: Math.round(invested), corpus: Math.round(corpus) });
    }
  }
  if (months % 12 !== 0) {
    yearly.push({
      year: +(months / 12).toFixed(1),
      invested: Math.round(invested),
      corpus: Math.round(corpus),
    });
  }

  const gains = Math.max(0, corpus - invested);
  const longTerm = years >= TAX.holdingThresholdMonths / 12;

  const rate =
    taxMode === "indian" ? (longTerm ? TAX.ltcgRatePct : TAX.stcgRatePct) : longTerm ? customLtcg : customStcg;
  const exemption = longTerm ? (taxMode === "indian" ? TAX.ltcgAnnualExemption : customExemption) : 0;

  const taxableGain = Math.max(0, gains - exemption);
  const tax = taxableGain * (rate / 100);
  const postTaxCorpus = corpus - tax;

  const postTaxNominal =
    invested > 0 && years > 0 ? (Math.pow(postTaxCorpus / invested, 1 / years) - 1) * 100 : 0;
  const preTaxNominal =
    invested > 0 && years > 0 ? (Math.pow(corpus / invested, 1 / years) - 1) * 100 : 0;
  const valueToday = postTaxCorpus / Math.pow(1 + inflationRate / 100, years);

  // Present value of all the money you invested, discounted to today's purchasing
  // power (each deposit is valued at what it is worth today, given inflation).
  const investedToday = cashflows.reduce(
    (s, cf) => s + -cf.amount / Math.pow(1 + inflationRate / 100, cf.t),
    0
  );

  // CAGR of the final (post-tax) value relative to the money invested in
  // today's terms, over the full tenure.
  const todayCagr =
    investedToday > 0 && years > 0 ? (Math.pow(valueToday / investedToday, 1 / years) - 1) * 100 : 0;

  return {
    corpus,
    invested,
    gains,
    tax,
    postTaxCorpus,
    preTaxNominal,
    postTaxNominal,
    investedToday,
    valueToday,
    todayCagr,
    yearly,
    regime: longTerm ? "LTCG" : "STCG",
    exemption,
    rate,
  };
}