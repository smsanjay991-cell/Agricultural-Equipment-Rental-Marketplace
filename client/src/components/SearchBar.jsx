import React, { useState } from "react";
import { Search, MapPin, Calendar, Tractor, ChevronDown } from "lucide-react";
import Button from "./Button";

/**
 * Reusable SearchBar Component for AgriRent
 * Allows searching by equipment category, location, and rental date.
 */
function SearchBar({ onSearch, className = "" }) {
  const [equipmentType, setEquipmentType] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ equipmentType, location, startDate });
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`glass-card p-3 md:p-4 rounded-2xl md:rounded-full border border-emerald-500/20 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
        {/* Equipment Type Input / Select */}
        <div className="flex items-center gap-3 px-4 py-2.5 w-full md:w-1/3 bg-emerald-950/50 hover:bg-emerald-900/40 rounded-xl md:rounded-l-full border border-emerald-800/30 transition-colors group">
          <Tractor className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
          <div className="flex flex-col flex-grow min-w-0">
            <label className="text-[10px] uppercase font-semibold text-emerald-400/80 tracking-wider">
              Equipment
            </label>
            <select
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
              className="bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none cursor-pointer w-full accent-emerald-600 font-medium"
            >
              <option value="" className="bg-slate-900 text-slate-300">Select Equipment Type</option>
              <option value="tractor" className="bg-slate-900 text-slate-100">Tractor (35-75 HP)</option>
              <option value="harvester" className="bg-slate-900 text-slate-100">Combine Harvester</option>
              <option value="rotavator" className="bg-slate-900 text-slate-100">Rotavator / Tiller</option>
              <option value="sprayer" className="bg-slate-900 text-slate-100">Power Sprayer</option>
              <option value="seeder" className="bg-slate-900 text-slate-100">Seed Drill / Seeder</option>
            </select>
          </div>
        </div>

        {/* Location Input */}
        <div className="flex items-center gap-3 px-4 py-2.5 w-full md:w-1/3 bg-emerald-950/50 hover:bg-emerald-900/40 rounded-xl border border-emerald-800/30 transition-colors group">
          <MapPin className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
          <div className="flex flex-col flex-grow min-w-0">
            <label className="text-[10px] uppercase font-semibold text-emerald-400/80 tracking-wider">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Ludhiana, Punjab"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none w-full font-medium"
            />
          </div>
        </div>

        {/* Rental Date Field */}
        <div className="flex items-center gap-3 px-4 py-2.5 w-full md:w-1/4 bg-emerald-950/50 hover:bg-emerald-900/40 rounded-xl border border-emerald-800/30 transition-colors group">
          <Calendar className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
          <div className="flex flex-col flex-grow min-w-0">
            <label className="text-[10px] uppercase font-semibold text-emerald-400/80 tracking-wider">
              Rental Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none w-full cursor-pointer font-medium"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full md:w-auto shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Search}
            className="w-full md:w-auto md:rounded-full px-7 shadow-emerald-500/25"
          >
            Search Equipment
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
