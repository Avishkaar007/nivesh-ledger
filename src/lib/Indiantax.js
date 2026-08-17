
// Central place for current Indian tax figures used across calculators.
// Update this file when the Finance Act / Union Budget changes these numbers —
// every calculator that imports from here picks up the change automatically.

export const EQUITY_CAPITAL_GAINS = {
  fiscalYear: "FY 2025-26",
  effectiveFrom: "23 Jul 2024",
  law: "Finance (No. 2) Act, 2024",
  // Long-term: holding period >= 12 months (equity / equity mutual funds)
  ltcgRatePct: 12.5, // Section 112A
  ltcgAnnualExemption: 125000, // ₹1.25L per financial year
  // Short-term: holding period < 12 months
  stcgRatePct: 20, // Section 111A
  holdingThresholdMonths: 12,
};