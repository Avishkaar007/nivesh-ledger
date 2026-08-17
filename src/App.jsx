import React, { useState, useEffect } from "react";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Roadmap from "./sections/Roadmap.jsx";
import TaxGuideAbout from "./sections/TaxGuideAbout.jsx";
import CalculatorGrid from "./components/CalculatorGrid.jsx";
import SIPCalculator from "./calculators/SIPCalculator.jsx";
import EMICalculator from "./calculators/EMICalculator.jsx";

// Map of calculator id -> component. Add new calculators here.
const CALC_VIEWS = {
  sip: SIPCalculator,
  emi: EMICalculator,
};

export default function App() {
  const [view, setView] = useState(() => window.location.hash.replace("#", "") || "home");

  useEffect(() => {
    const onHash = () => setView(window.location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openCalc = (id) => { window.location.hash = id; };
  const goHome = () => { window.location.hash = "home"; };

  const Calc = CALC_VIEWS[view];

  return (
    <div className="ledger-app">
      <Nav onOpen={openCalc} onHome={goHome} />
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
          <CalculatorGrid onOpen={openCalc} />
          <Roadmap />
          <TaxGuideAbout />
        </>
      )}
      <Footer />
    </div>
  );
}
