// Pure EMI math — no UI. Returns the schedule plus prepayment impact.
// Prepayment is a one-time lump applied to the principal at a chosen month.
export function computeEMI({
  loanAmount,
  downPayment,
  interestRate,
  durationYears,
  emiFrequency, // "monthly" | "quarterly" | "yearly"
  prepayment = 0,
  prepaymentMonth = 0, // months from start when the lump is applied (0 = upfront)
}) {
  const ppy = { monthly: 12, quarterly: 4, yearly: 1 }[emiFrequency] || 12;
  const monthsPerPeriod = 12 / ppy;
  const P = Math.max(0, loanAmount - downPayment);
  const r = interestRate / 100 / ppy;
  const n = Math.max(1, Math.round(durationYears * ppy));

  // No financed principal (loan <= down payment): nothing to repay.
  if (P <= 0) {
    return {
      principal: 0,
      emi: 0,
      totalInterest: 0,
      totalRepayment: 0,
      prepayment,
      prepaymentMonth,
      revisedEMI: 0,
      revisedTenure: 0,
      yearly: [{ year: 0, balance: 0, principalPaid: 0, interestPaid: 0 }],
    };
  }

  const price = Math.pow(1 + r, n);
  const emi = r === 0 ? P / n : (P * r * price) / (price - 1);
  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - P;

  // Yearly series (base loan, no prepayment) for the chart.
  const yearly = [{ year: 0, balance: Math.round(P), principalPaid: 0 }];
  const perYear = {};
  let bal = P;
  for (let p = 1; p <= n; p++) {
    const interest = bal * r;
    const principal = emi - interest;
    bal = Math.max(0, bal - principal);
    const yr = Math.ceil(p / ppy);
    if (!perYear[yr]) perYear[yr] = { principal: 0, interest: 0, balance: 0 };
    perYear[yr].principal += principal;
    perYear[yr].interest += interest;
    perYear[yr].balance = bal;
  }
  const totalYrs = Math.ceil(n / ppy);
  for (let y = 1; y <= totalYrs; y++) {
    yearly.push({
      year: y,
      balance: Math.round(perYear[y] ? perYear[y].balance : 0),
      principalPaid: Math.round(perYear[y] ? perYear[y].principal : 0),
      interestPaid: Math.round(perYear[y] ? perYear[y].interest : 0),
    });
  }

  // Which payment period does the prepayment land on?
  const periodIndex = Math.min(n, Math.max(1, Math.ceil(prepaymentMonth / monthsPerPeriod)));

  // Revised tenure: keep the original EMI, apply the lump at periodIndex.
  let bal2 = P;
  let periods = 0;
  let applied = false;
  if (P > 0) {
    const maxP = n + 2;
    const eps = 0.001; // tolerance for floating-point residue on the final payment
    while (bal2 > eps && periods < maxP) {
      const interest = bal2 * r;
      const principal = Math.min(emi - interest, bal2);
      bal2 = Math.max(0, bal2 - principal);
      periods++;
      if (!applied && periods === periodIndex) {
        bal2 = Math.max(0, bal2 - prepayment);
        applied = true;
      }
      if (bal2 <= eps) break;
    }
    if (bal2 > eps) periods = n; // degenerate fallback
  }
  const revisedTenure = periods / ppy;

  // Revised EMI: keep the original tenure, but pay a lower constant EMI because
  // of the lump applied at periodIndex. Balance remaining after that period:
  const balAtM = r === 0
    ? P - emi * periodIndex
    : P * Math.pow(1 + r, periodIndex) - emi * ((Math.pow(1 + r, periodIndex) - 1) / r);
  const revBalance = Math.max(0, balAtM - prepayment);
  const remaining = n - periodIndex;
  let revisedEMI = 0;
  if (remaining > 0 && revBalance > 0) {
    revisedEMI = r === 0
      ? revBalance / remaining
      : (revBalance * r) / (1 - Math.pow(1 + r, -remaining));
  }

  return {
    principal: P,
    emi,
    totalInterest,
    totalRepayment,
    prepayment,
    prepaymentMonth,
    revisedEMI,
    revisedTenure,
    yearly,
  };
}
