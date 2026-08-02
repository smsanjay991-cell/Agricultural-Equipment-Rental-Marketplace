import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import EquipmentSection from "../components/EquipmentSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

/**
 * Modern AgriRent Landing Page (Home)
 * Only imports and renders modular reusable components.
 */
function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <EquipmentSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
