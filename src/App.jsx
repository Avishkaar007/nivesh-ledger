
import React from "react";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Roadmap from "./sections/Roadmap.jsx";
import TaxGuideAbout from "./sections/TaxGuideAbout.jsx";
import SIPCalculator from "./calculators/SIPCalculator.jsx";

// To add a new calculator:
// 1. Build it as its own file under src/calculators/ (copy SIPCalculator.jsx as a template)
// 2. Give its <section> a unique id
// 3. Import and render it below
// 4. Flip its entry in src/data/roadmap.js to status: "live" and point sectionId at that id
export default function App() {
  return (
    <div className="ledger-app">
      <Nav />
      <Hero />
      <SIPCalculator />
      <Roadmap />
      <TaxGuideAbout />
      <Footer />
    </div>
  );
}