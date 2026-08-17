// src/lib/calculators/swp.js
// Systematic Withdrawal Plan: withdraw a fixed monthly amount from a corpus
// that keeps earning returns, and see how long it lasts.

export function computeSWP({ corpus, withdrawal, rate, years }) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1;

  let balance = corpus;
  let totalWithdrawn = 0;
  let earned = 0;
  let depletes = false;
  let monthsLasted = 0;

  const yearly = [{ year: 0, balance: Math.round(corpus), withdrawn: 0 }];
  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    balance = balance + interest - withdrawal;
    if (balance < 0) {
      balance = Math.max(0, balance);
      totalWithdrawn += Math.max(0, withdrawal + balance - interest);
      depletes = true;
      monthsLasted = m;
      break;
    }
    totalWithdrawn += withdrawal;
    earned += interest;
    if (m % 12 === 0) {
      yearly.push({ year: m / 12, balance: Math.round(balance), withdrawn: Math.round(totalWithdrawn) });
    }
  }
  if (!depletes) monthsLasted = months;

  // Ensure the chart always has a sensible end point even mid-year.
  if (yearly.length === 1 || yearly[yearly.length - 1].year < months / 12) {
    yearly.push({
      year: monthsLasted / 12,
      balance: Math.round(balance),
      withdrawn: Math.round(totalWithdrawn),
    });
  }

  return {
    corpus,
    withdrawal,
    rate,
    years,
    balance,
    totalWithdrawn,
    earned,
    depletes,
    monthsLasted,
    yearsLasted: monthsLasted / 12,
    yearly,
  };
}