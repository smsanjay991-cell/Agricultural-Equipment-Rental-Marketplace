import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, Tractor } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.set('search', search.trim());
    if (category && category !== 'All') queryParams.set('category', category);
    if (location.trim()) queryParams.set('location', location.trim());
    navigate(`/equipment?${queryParams.toString()}`);
  };

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          
          {/* Centered AgriRent Brand Mark */}
          <div className="flex items-center justify-center mb-1">
            <div className="w-11 h-11 rounded-xl bg-green-700 flex items-center justify-center text-white shadow-xs">
              <Tractor className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Production Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Rent the equipment you need. <br className="hidden sm:inline" />
            <span className="text-green-700">From trusted local owners.</span>
          </h1>

          {/* Short Supporting Text */}
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-xl mx-auto">
            Find and rent the farm equipment you need from local owners.
          </p>

          {/* Unified Compact Search Container */}
          <div className="pt-2">
            <form 
              onSubmit={handleSearchSubmit} 
              className="bg-white p-2 sm:p-2.5 rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center gap-2 text-left"
            >
              {/* Search Equipment Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 rounded-lg border border-slate-200 focus-within:bg-white focus-within:border-green-600 transition">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text"
                  placeholder="Search tractors, harvesters, rotavators..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                  aria-label="Search equipment"
                />
              </div>

              {/* Category Dropdown */}
              <div className="w-full md:w-44 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-lg border border-slate-200 focus-within:bg-white focus-within:border-green-600 transition">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none w-full cursor-pointer"
                  aria-label="Equipment Category"
                >
                  <option value="All">All Categories</option>
                  <option value="Tractor">Tractors</option>
                  <option value="Harvester">Harvesters</option>
                  <option value="Tiller">Tillers & Rotavators</option>
                  <option value="Seeder">Seeders</option>
                  <option value="Sprayer">Sprayers</option>
                  <option value="Attachment">Attachments</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 rounded-lg border border-slate-200 focus-within:bg-white focus-within:border-green-600 transition">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text"
                  placeholder="Enter district or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                  aria-label="Location or District"
                />
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
