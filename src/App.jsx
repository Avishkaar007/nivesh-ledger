import React, { useState, useEffect } from "react";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Roadmap from "./sections/Roadmap.jsx";
import TaxGuideAbout from "./sections/TaxGuideAbout.jsx";
import CalculatorGrid from "./components/CalculatorGrid.jsx";
import SIPCalculator from "./calculators/SIPCalculator.jsx";
import EMICalculator from "./calculators/EMICalculator.jsx";
import CompoundCalculator from "./calculators/CompoundCalculator.jsx";
import SimpleCalculator from "./calculators/SimpleCalculator.jsx";
import SWPCalculator from "./calculators/SWPCalculator.jsx";
import FDCalculator from "./calculators/FDCalculator.jsx";
import IncomeTaxCalculator from "./calculators/IncomeTaxCalculator.jsx";

// Map of calculator id -> component. Add new calculators here.
const CALC_VIEWS = {
  sip: SIPCalculator,
  emi: EMICalculator,
  compound: CompoundCalculator,
  simple: SimpleCalculator,
  swp: SWPCalculator,
  fd: FDCalculator,
  incometax: IncomeTaxCalculator,
};

export default function App() {
  const [view, setView] = useState(() => window.location.hash.replace("#", "") || "home");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setView(window.location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const closeSearch = () => setSearchOpen(false);

  const openSearch = () => {
    setSearchOpen(true);
    if (view !== "home") goHome();
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "Escape") {
        closeSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Focus the top search bar once it is present and the spotlight is active.
  useEffect(() => {
    if (searchOpen && view === "home") {
      const t = setTimeout(() => {
        document.getElementById("calc-search-input")?.focus();
      }, 60);
      return () => clearTimeout(t);
    }
  }, [searchOpen, view]);

  const openCalc = (id) => { window.location.hash = id; closeSearch(); };
  const goHome = () => { window.location.hash = "home"; };
  const navigateSection = (id) => {
    goHome();
    requestAnimationFrame(() => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120));
  };

  const Calc = CALC_VIEWS[view];

  return (
    <div className="ledger-app">
      {searchOpen && <div className="search-scrim" onClick={closeSearch} />}
      <Nav onOpen={openCalc} onHome={goHome} onSearch={openSearch} />
      {Calc ? (
        <>
          <div className="calc-view-head">
            <button className="back-link" onClick={goHome}>← All calculators</button>
          </div>
          <Calc />
        </>
      ) : (
        <>
          <Hero onOpen={openCalc} />
          <CalculatorGrid onOpen={openCalc} searchActive={searchOpen} />
          <Roadmap />
          <TaxGuideAbout />
        </>
      )}
      <Footer />
    </div>
  );
}
