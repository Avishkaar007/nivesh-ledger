export const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(Number.isFinite(n) ? n : 0));

// Formats a rupee amount in Indian word units (Crore / Lakh / Thousand)
// instead of digit grouping, e.g. ₹1.96 Crore, ₹14.1 Lakh.
export const inrWords = (n) => {
  const v = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const fmt = (x) => x.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  if (abs >= 1e7) return `${sign}₹${fmt(abs / 1e7)} Crore`;
  if (abs >= 1e5) return `${sign}₹${fmt(abs / 1e5)} Lakh`;
  if (abs >= 1e3) return `${sign}₹${fmt(abs / 1e3)} Thousand`;
  return `${sign}₹${fmt(abs)}`;
};

export const num = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(Number.isFinite(n) ? n : 0)
  );

export const pctFmt = (n) => `${Number.isFinite(n) ? n.toFixed(2) : "0.00"}%`;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));