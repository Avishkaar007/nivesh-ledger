// src/lib/calculators/simple.js
// Simple interest on a principal.

export function computeSimpleInterest({ principal, rate, years }) {
  const r = rate / 100;
  const t = Math.max(0, years);
  const interest = principal * r * t;
  const maturity = principal + interest;

  // Yearly breakdown for the chart (year 0 = starting principal, linear growth).
  const yearly = [{ year: 0, balance: principal, invested: principal, interest: 0 }];
  for (let y = 1; y <= Math.round(t); y++) {
    const accrued = principal * r * y;
    yearly.push({
      year: y,
      balance: principal + accrued,
      invested: principal,
      interest: accrued,
    });
  }

  return { principal, rate, years, maturity, invested: principal, interest, yearly };
}