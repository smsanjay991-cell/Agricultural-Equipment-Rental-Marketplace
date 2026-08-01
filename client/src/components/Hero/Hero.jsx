import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tractor, CheckCircle2, ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (search) queryParams.set('search', search);
    if (category !== 'All') queryParams.set('category', category);
    if (location) queryParams.set('location', location);
    navigate(`/equipment?${queryParams.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-16 lg:py-24 border-b border-slate-800">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Tractor className="w-4 h-4 animate-bounce" />
            India's #1 On-Demand Farm Machinery Rental Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Rent Modern Farming Equipment <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              At Transparent Daily Rates
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Connect directly with verified equipment owners in your district. Book tractors, combine harvesters, rotavators, and seeders with optional trained drivers.
          </p>

          {/* Floating Search Widget */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="glass-panel p-3 rounded-2xl shadow-2xl border border-slate-700/80 max-w-4xl mx-auto mt-8 flex flex-col md:flex-row items-center gap-3"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 w-full">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input 
                type="text"
                placeholder="Search equipment (e.g. John Deere, Rotavator)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-48 bg-slate-800/80 rounded-xl border border-slate-700/60 px-3 py-2">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none w-full cursor-pointer"
              >
                <option value="All" className="bg-slate-800 text-slate-200">All Categories</option>
                <option value="Tractor" className="bg-slate-800 text-slate-200">Tractors</option>
                <option value="Harvester" className="bg-slate-800 text-slate-200">Harvesters</option>
                <option value="Tiller" className="bg-slate-800 text-slate-200">Tillers / Rotavators</option>
                <option value="Seeder" className="bg-slate-800 text-slate-200">Seeders & Planters</option>
                <option value="Sprayer" className="bg-slate-800 text-slate-200">Sprayers</option>
              </select>
            </div>

            {/* Location Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 w-full">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <input 
                type="text"
                placeholder="District or State (e.g. Punjab, Karnal)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            {/* Search CTA */}
            <button 
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Search Equipment
            </button>
          </form>

          {/* Quick Metric Badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">100% Verified</div>
                <div className="text-xs text-slate-400">Fleet & Owners</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Clock className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">Instant Booking</div>
                <div className="text-xs text-slate-400">Real-time dates</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Tractor className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">500+ Machines</div>
                <div className="text-xs text-slate-400">Ready for dispatch</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">Operator Add-on</div>
                <div className="text-xs text-slate-400">Experienced drivers</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
