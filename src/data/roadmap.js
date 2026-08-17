// src/data/roadmap.js
// ADD A NEW CALCULATOR HERE - it will automatically appear in Roadmap.jsx
// Pattern: { name, blurb, status: "live" | "soon", icon }

import {
  TrendingUp,
  Car,
  PiggyBank,
  Wallet,
  Repeat,
  Calculator,
  Percent,
  Building2,
  Banknote,
} from "lucide-react";

export const roadmap = [
  {
    id: "sip",
    name: "SIP Calculator",
    blurb: "Estimate wealth from monthly SIPs with inflation-adjusted goals.",
    status: "live",
    icon: TrendingUp,
  },
  {
    id: "emi",
    name: "EMI Calculator",
    blurb: "Loan EMI, total interest & amortization schedule for home/car loans.",
    status: "live",
    icon: Car,
  },
  {
    id: "compound",
    name: "Compound Interest Calculator",
    blurb: "Lump-sum growth where interest earns interest.",
    status: "live",
    icon: Banknote,
  },
  {
    id: "simple",
    name: "Simple Interest Calculator",
    blurb: "Flat interest on the original principal only.",
    status: "live",
    icon: Calculator,
  },
  {
    id: "fd",
    name: "FD Calculator",
    blurb: "Fixed Deposit maturity amount with quarterly compounding.",
    status: "live",
    icon: PiggyBank,
  },
  {
    id: "ppf",
    name: "PPF Calculator",
    blurb: "15-year PPF with yearly limits, rate changes & extension rules.",
    status: "soon",
    icon: Wallet,
  },
  {
    id: "swp",
    name: "SWP Calculator",
    blurb: "Plan systematic withdrawals and see how long your corpus lasts.",
    status: "live",
    icon: Repeat,
  },
  {
    id: "incometax",
    name: "Income Tax Calculator",
    blurb: "Old vs New regime comparison for FY 2025-26.",
    status: "live",
    icon: Percent,
  },
  {
    id: "gratuity",
    name: "Gratuity Calculator",
    blurb: "Calculate gratuity under Payment of Gratuity Act.",
    status: "soon",
    icon: Building2,
  },
];
