
// Central place for current Indian tax figures used across calculators.
// Update this file when the Finance Act / Union Budget changes these numbers —
// every calculator that imports from here picks up the change automatically.

export const EQUITY_CAPITAL_GAINS = {
  fiscalYear: "FY 2026-27",
  effectiveFrom: "23 Jul 2024",
  law: "Finance (No. 2) Act, 2024",
  // Long-term: holding period >= 12 months (equity / equity mutual funds)
  ltcgRatePct: 12.5, // Section 112A
  ltcgAnnualExemption: 125000, // ₹1.25L per financial year
  // Short-term: holding period < 12 months
  stcgRatePct: 20, // Section 111A
  holdingThresholdMonths: 12,
};

// Fixed Deposit interest taxation (taxed as "Income from Other Sources").
export const FD_INTEREST_TAX = {
  fiscalYear: "FY 2026-27",
  head: "Income from Other Sources",
  // TDS deducted by banks under Section 194A.
  tdsRatePct: 10, // 20% if no PAN furnished
  tdsThreshold: 40000, // general threshold for TDS in a FY
  seniorTdsThreshold: 50000, // senior citizens
  // Deductions available to reduce taxable interest income:
  section80TTA: 10000, // deduction on interest income (non-senior)
  section80TTB: 50000, // deduction for senior citizens
  surchargeApplied: "Beyond ₹50L income, surcharge & cess add to the effective rate.",
};

// New income-tax regime slabs (FY 2026-27), full marginal-rate table:
//   ₹0–4L: nil · 4–8L: 5% · 8–12L: 10% · 12–16L: 15% · 16–20L: 20% · 20–24L: 25% · above 24L: 30%
export const NEW_REGIME_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

export const slabRateForIncome = (income) =>
  NEW_REGIME_SLABS.find((s) => income <= s.upTo).rate;

// Surcharge on tax for high incomes (resident individuals, FY 2026-27).
export const SURCHARGE_TIERS = [
  { upTo: 5000000, rate: 0 }, // up to ₹50L
  { upTo: 10000000, rate: 10 }, // ₹50L–1Cr
  { upTo: 20000000, rate: 15 }, // ₹1–2Cr
  { upTo: 50000000, rate: 25 }, // ₹2–5Cr
  { upTo: Infinity, rate: 37 }, // above ₹5Cr
];

export const surchargeRateForIncome = (income) =>
  SURCHARGE_TIERS.find((s) => income <= s.upTo).rate;

// Collapsible list of Indian laws that govern income tax (shown at the bottom).
export const INCOME_TAX_LAWS = [
  {
    section: "Section 87A",
    title: "Rebate up to ₹60,000",
    text: "Under the new regime, income up to ₹12 lakh pays zero tax — the rebate wipes out the full liability for resident individuals.",
  },
  {
    section: "Section 16",
    title: "Standard deduction ₹75,000",
    text: "Salaried employees and pensioners can subtract ₹75,000, making gross salary up to ₹12.75 lakh tax-free in the new regime.",
  },
  {
    section: "Marginal relief",
    title: "Smooths the ₹12L cliff",
    text: "Just above ₹12 lakh, tax is capped at the amount your income exceeds ₹12 lakh, so ₹1 of extra income never triggers a huge tax jump.",
  },
  {
    section: "Surcharge",
    title: "Above ₹50 lakh",
    text: "Tax rises by 10% over ₹50L, 15% over ₹1Cr, 25% over ₹2Cr and 37% over ₹5Cr (marginal relief applies at each boundary).",
  },
  {
    section: "Cess",
    title: "Health & education cess 4%",
    text: "A 4% cess is levied on the income tax and surcharge payable.",
  },
  {
    section: "Old regime",
    title: "Higher exemptions, fewer slabs",
    text: "₹2.5L exemption and ₹50k standard deduction, but 70+ deductions (80C, HRA, home loan) — better when deductions exceed ~₹4L.",
  },
];

// Collapsible list of Indian laws that govern FD taxation (shown at the bottom).
export const FD_LAWS = [
  {
    section: "Section 56 / 80",
    title: "Taxable as Income from Other Sources",
    text: "FD interest is added to your total income and taxed at your marginal slab rate under the Income-tax Act, 1961.",
  },
  {
    section: "Section 194A",
    title: "TDS on Interest",
    text: "Banks deduct 10% TDS (20% without PAN) when interest exceeds ₹40,000 in a year (₹50,000 for senior citizens).",
  },
  {
    section: "Section 80TTA",
    title: "₹10,000 deduction",
    text: "Up to ₹10,000 of interest income is deductible each year for non-senior resident individuals.",
  },
  {
    section: "Section 80TTB",
    title: "₹50,000 deduction for seniors",
    text: "Senior citizens can deduct up to ₹50,000 of interest income (FD + savings) under Section 80TTB.",
  },
  {
    section: "TDS credit",
    title: "Adjustable against final tax",
    text: "TDS is not an extra cost — it is credited (Form 26AS) against your final tax liability when filing returns.",
  },
  {
    section: "Surcharge & Cess",
    title: "Higher income attracts extra tax",
    text: "Above ₹50L income a surcharge applies, plus a 4% health & education cess on the total tax.",
  },
];