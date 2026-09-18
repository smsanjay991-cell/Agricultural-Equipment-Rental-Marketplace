import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

const DEFAULT_CATEGORIES = [
  { name: 'Tractor' },
  { name: 'Harvester' },
  { name: 'Tiller' },
  { name: 'Seeder' },
  { name: 'Sprayer' }
];

const SearchBar = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDbCategories = async () => {
      try {
        const list = await categoryService.getAll();
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.warn('Fallback to default search categories:', err.message);
        setCategories(DEFAULT_CATEGORIES);
      }
    };
    fetchDbCategories();
  }, []);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4 mb-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Filter className="w-4 h-4 text-emerald-400" /> Filter & Search Machinery
        </div>
        <button 
          onClick={onReset}
          className="text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
        >
          Reset All Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Keyword Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search equipment..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Selector */}
        <div>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={cat.id || cat._id || idx} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Search */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Filter by location/district..."
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Driver Option Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl">
          <input 
            type="checkbox"
            id="driverOnly"
            checked={filters.isDriverAvailable || false}
            onChange={(e) => onFilterChange('isDriverAvailable', e.target.checked)}
            className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="driverOnly" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
            Include Driver Available
          </label>
        </div>

      </div>
    </div>
  );
};

export default SearchBar;
