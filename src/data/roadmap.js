// src/data/roadmap.js
// ADD A NEW CALCULATOR HERE - it will automatically appear in Roadmap.jsx
// Pattern: { name, blurb, status: "live" | "soon", icon }

import {
  TrendingUp,
  Landmark,
  PiggyBank,
  Wallet,
  Repeat,
  Calculator,
  Percent,
  Building2,
} from "lucide-react";

export const roadmap = [
  {
    name: "SIP Calculator",
    blurb: "Estimate wealth from monthly SIPs with inflation-adjusted goals.",
    status: "live",
    icon: TrendingUp,
  },
  {
    name: "EMI Calculator",
    blurb: "Loan EMI, total interest & amortization schedule for home/car loans.",
    status: "soon",
    icon: Landmark,
  },
  {
    name: "FD Calculator",
    blurb: "Fixed Deposit maturity amount with quarterly compounding.",
    status: "soon",
    icon: PiggyBank,
  },
  {
    name: "PPF Calculator",
    blurb: "15-year PPF with yearly limits, rate changes & extension rules.",
    status: "soon",
    icon: Wallet,
  },
  {
    name: "SWP Calculator",
    blurb: "Plan systematic withdrawals and see how long your corpus lasts.",
    status: "soon",
    icon: Repeat,
  },
  {
    name: "RD Calculator",
    blurb: "Recurring Deposit returns for monthly savings habit.",
    status: "soon",
    icon: Calculator,
  },
  {
    name: "Income Tax Calculator",
    blurb: "Old vs New regime comparison for FY 2025-26.",
    status: "soon",
    icon: Percent,
  },
  {
    name: "Gratuity Calculator",
    blurb: "Calculate gratuity under Payment of Gratuity Act.",
    status: "soon",
    icon: Building2,
  },
];
