import { EQUITY_CAPITAL_GAINS as TAX } from "../indianTax.js";

// Applies Indian equity capital-gains tax (FY 2026-27) to a capital gain, with
// optional custom rates/exemption. Returns the applicable regime and post-tax value.
export function applyCapitalGainsTax({
  gains,
  years,
  taxMode = "indian", // "indian" | "custom"
  customLtcg = TAX.ltcgRatePct,
  customStcg = TAX.stcgRatePct,
  customExemption = TAX.ltcgAnnualExemption,
}) {
  const longTerm = years >= TAX.holdingThresholdMonths / 12;
  const rate = longTerm ? (taxMode === "indian" ? TAX.ltcgRatePct : customLtcg) : taxMode === "indian" ? TAX.stcgRatePct : customStcg;
  const exemption = longTerm ? (taxMode === "indian" ? TAX.ltcgAnnualExemption : customExemption) : 0;
  const taxableGain = Math.max(0, gains - exemption);
  const tax = taxableGain * (rate / 100);
  return {
    regime: longTerm ? "LTCG" : "STCG",
    longTerm,
    rate,
    exemption,
    taxableGain,
    tax,
    postTaxValue: gains - tax,
    section: longTerm ? "112A" : "111A",
  };
}