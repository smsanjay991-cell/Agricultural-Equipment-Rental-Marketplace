import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import EquipmentCard from '../../components/EquipmentCard/EquipmentCard';
import Loader from '../../components/Loader/Loader';
import { equipmentService } from '../../services/equipmentService';
import { Tractor } from 'lucide-react';

const Equipment = () => {
  const [searchParams] = useSearchParams();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    location: searchParams.get('location') || '',
    isDriverAvailable: searchParams.get('isDriverAvailable') === 'true'
  });

  useEffect(() => {
    loadEquipment();
  }, [filters]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const data = await equipmentService.getAll(filters);
      setEquipmentList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      location: '',
      isDriverAvailable: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Catalog & Marketplace</div>
        <h1 className="text-3xl font-extrabold text-white">Browse Agricultural Machinery</h1>
        <p className="text-xs text-slate-400">Search available tractors, harvesters, seeders, and tillage attachments across all regions.</p>
      </div>

      {/* Filter Component */}
      <SearchBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={handleResetFilters} 
      />

      {/* Results Count & Grid */}
      {loading ? (
        <Loader message="Filtering equipment catalog..." />
      ) : equipmentList.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Tractor className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Machinery Matches Your Filters</h3>
          <p className="text-xs text-slate-400">Try resetting filters or searching with a broader category.</p>
          <button 
            onClick={handleResetFilters}
            className="text-xs font-bold text-emerald-400 hover:underline pt-2 inline-block cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-emerald-400 font-bold">{equipmentList.length}</span> verified machines
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Equipment;
