// src/lib/calculators/compound.js
// Compound interest on a lump sum.

const COMPOUND_PER_YEAR = { monthly: 12, quarterly: 4, "half-yearly": 2, yearly: 1 };

export function computeCompoundInterest({ principal, rate, years, frequency = "yearly" }) {
  const n = COMPOUND_PER_YEAR[frequency] || 1;
  const r = rate / 100 / n;
  const periods = Math.max(1, Math.round(years * n));

  const growth = Math.pow(1 + r, periods);
  const maturity = principal * growth;
  const interest = Math.max(0, maturity - principal);

  // Yearly breakdown for the chart (year 0 = starting principal).
  const yearly = [{ year: 0, balance: principal, invested: principal, interest: 0 }];
  for (let y = 1; y <= periods; y++) {
    const balance = principal * Math.pow(1 + r, y);
    yearly.push({
      year: y,
      balance,
      invested: principal,
      interest: Math.max(0, balance - principal),
    });
  }

  return { principal, rate, years, frequency, maturity, invested: principal, interest, yearly };
}