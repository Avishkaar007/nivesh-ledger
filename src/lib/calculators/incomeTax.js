import { NEW_REGIME_SLABS, surchargeRateForIncome } from "../indianTax.js";

// Old regime slabs (FY 2026-27, unchanged).
const OLD_REGIME_SLABS = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 5 },
  { upTo: 1000000, rate: 20 },
  { upTo: Infinity, rate: 30 },
];

const REGIMES = {
  new: {
    label: "New Regime",
    slabs: NEW_REGIME_SLABS,
    stdDeduction: 75000, // salaried
    rebateLimit: 1200000, // Sec 87A: income up to ₹12L -> no tax
    rebateMax: 60000,
    law: "Section 115BAC + Section 87A",
  },
  old: {
    label: "Old Regime",
    slabs: OLD_REGIME_SLABS,
    stdDeduction: 50000, // salaried
    rebateLimit: 500000, // Sec 87A: income up to ₹5L
    rebateMax: 12500,
    law: "Section 115BAC (default)",
  },
};

const CESS_PCT = 4;

// Progressive tax on the slabs for a given income.
function taxOnSlabs(income, slabs) {
  let tax = 0;
  let prev = 0;
  const breakdown = [];
  for (const s of slabs) {
    const bandTop = s.upTo;
    const width = Math.max(0, Math.min(income, bandTop) - prev);
    const bandTax = width * (s.rate / 100);
    tax += bandTax;
    if (width > 0) {
      breakdown.push({
        label: prev === 0 ? `up to ${s.upTo >= 1e8 ? "∞" : s.upTo}` : `${prev + 1}–${s.upTo >= 1e8 ? "∞" : s.upTo}`,
        rate: s.rate,
        amount: width,
        tax: bandTax,
      });
    }
    prev = bandTop;
    if (income <= bandTop) break;
  }
  return { tax, breakdown };
}

// Income tax for FY 2026-27 with Sec 87A rebate, marginal relief and 4% cess.
export function computeIncomeTax({ grossIncome, isSalaried = true, regime = "new" }) {
  const cfg = REGIMES[regime] || REGIMES.new;
  const stdDeduction = isSalaried ? cfg.stdDeduction : 0;
  const taxableIncome = Math.max(0, grossIncome - stdDeduction);

  const { tax: baseTax, breakdown } = taxOnSlabs(taxableIncome, cfg.slabs);

  // Section 87A rebate + marginal relief (smooths the cliff just above the limit).
  let tax;
  let relief = 0;
  if (taxableIncome <= cfg.rebateLimit) {
    tax = 0; // rebate wipes out all tax up to the limit
    relief = Math.min(baseTax, cfg.rebateMax);
  } else {
    const excess = taxableIncome - cfg.rebateLimit;
    const withRelief = Math.min(baseTax, excess); // marginal relief: tax capped at excess
    tax = withRelief;
    relief = Math.max(0, baseTax - withRelief);
  }

  const surchargeRate = surchargeRateForIncome(taxableIncome);
  const surcharge = tax * (surchargeRate / 100);
  const cess = (tax + surcharge) * (CESS_PCT / 100);
  const total = tax + surcharge + cess;
  const effectiveRate = grossIncome > 0 ? (total / grossIncome) * 100 : 0;
  const aboveLimit = taxableIncome > cfg.rebateLimit;

  return {
    grossIncome,
    isSalaried,
    regime,
    regimeLabel: cfg.label,
    stdDeduction,
    taxableIncome,
    baseTax,
    rebateLimit: cfg.rebateLimit,
    rebateMax: cfg.rebateMax,
    aboveLimit,
    relief,
    tax,
    surchargeRate,
    surcharge,
    cess,
    cessPct: CESS_PCT,
    total,
    effectiveRate,
    breakdown,
    law: cfg.law,
  };
}