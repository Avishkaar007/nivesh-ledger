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
  const [theme, setTheme] = useState(() => localStorage.getItem("nl-theme") || "dark");

  const THEMES = ["dark", "sunlight", "light"];
  const toggleTheme = () =>
    setTheme((t) => {
      const next = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
      localStorage.setItem("nl-theme", next);
      return next;
    });

  useEffect(() => {
    const onHash = () => setView(window.location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Cmd/Ctrl+K focuses the nav search box and dims the rest of the page.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => {
          const next = !v;
          if (next) setTimeout(() => document.getElementById("nav-search-input")?.focus(), 30);
          return next;
        });
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the search spotlight when clicking anywhere outside the search bar.
  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e) => {
      if (!e.target.closest(".nav-search-box")) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  const openCalc = (id) => { window.location.hash = id; };
  const goHome = () => { window.location.hash = "home"; };
  const navigateSection = (id) => {
    goHome();
    requestAnimationFrame(() => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120));
  };

  const Calc = CALC_VIEWS[view];

  return (
    <div className={`ledger-app ${theme === "dark" ? "" : `theme-${theme}`}`}>
      <Nav onOpen={openCalc} onHome={goHome} searchActive={searchOpen} theme={theme} onToggleTheme={toggleTheme} />
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
