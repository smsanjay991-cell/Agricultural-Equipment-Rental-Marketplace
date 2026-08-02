import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Tractor, Users, Star, Award, CheckCircle2 } from "lucide-react";
import Button from "./Button";
import SearchBar from "./SearchBar";

/**
 * Reusable Hero Component for AgriRent Landing Page
 * Features main heading, subheading, action buttons, search bar integration,
 * and trust stat badges.
 */
function Hero() {
  const handleSearch = (searchData) => {
    console.log("Searching equipment with:", searchData);
    // Smooth scroll to equipment section or route to equipment page
    const section = document.getElementById("equipment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 md:py-24">
      {/* Background Dark Green Agricultural Aesthetic & Radial Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/80 to-slate-950 -z-20" />
      
      {/* Decorative Radial Backdrop Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/30 text-xs md:text-sm font-semibold text-emerald-300 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Award className="w-4 h-4 text-amber-400" />
          <span>India's #1 Trusted Farm Equipment Rental Marketplace</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-100 tracking-tight leading-[1.15] max-w-5xl mb-6">
          Rent Agricultural Equipment <span className="gradient-text">Easily</span>
        </h1>

        {/* Hero Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-normal max-w-3xl leading-relaxed mb-10">
          Find tractors, harvesters, seeders, tillers and more from trusted owners near you.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
          <a href="#equipment" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto px-8">
              Browse Equipment
            </Button>
          </a>
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" icon={Tractor} className="w-full sm:w-auto px-8">
              Become an Owner
            </Button>
          </Link>
        </div>

        {/* Integrated SearchBar Component */}
        <div className="w-full max-w-4xl mb-16">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Trust Badges / Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
          <div className="glass-card p-4 md:p-5 rounded-2xl flex items-center justify-center gap-3">
            <Tractor className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-slate-100">500+</div>
              <div className="text-xs text-slate-400 font-medium">Active Machines</div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5 rounded-2xl flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-slate-100">10,000+</div>
              <div className="text-xs text-slate-400 font-medium">Happy Farmers</div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5 rounded-2xl flex items-center justify-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-slate-100">100%</div>
              <div className="text-xs text-slate-400 font-medium">Verified Owners</div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5 rounded-2xl flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-slate-100">4.9 / 5</div>
              <div className="text-xs text-slate-400 font-medium">User Rating</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
