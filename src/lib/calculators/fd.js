// src/lib/calculators/fd.js
// Fixed Deposit: a lump sum earning quarterly-compounded interest over a fixed term.

export function computeFD({ principal, rate, years }) {
  const months = Math.max(1, Math.round(years * 12));
  const quarterlyRate = rate / 100 / 4;
  const quarters = Math.round(months / 3);

  const maturity = principal * Math.pow(1 + quarterlyRate, quarters);
  const interest = maturity - principal;

  const yearly = [{ year: 0, balance: Math.round(principal), invested: Math.round(principal), interest: 0 }];
  for (let q = 1; q <= quarters; q++) {
    const balance = principal * Math.pow(1 + quarterlyRate, q);
    const qy = q / 4;
    if (qy * 4 % 4 === 0 || q === quarters) {
      yearly.push({ year: qy, balance: Math.round(balance), invested: Math.round(principal), interest: Math.round(balance - principal) });
    }
  }

  return { principal, rate, years, maturity, invested: principal, interest, quarterlyRate, quarters, yearly };
}