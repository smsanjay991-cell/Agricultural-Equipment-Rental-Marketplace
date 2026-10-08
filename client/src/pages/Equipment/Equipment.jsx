import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import EquipmentCard from '../../components/EquipmentCard/EquipmentCard';
import Loader from '../../components/Loader/Loader';
import { equipmentService } from '../../services/equipmentService';
import { useAuth } from '../../context/AuthContext';
import { Tractor, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Equipment = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    setError(null);
    try {
      const data = await equipmentService.getAll(filters);
      setEquipmentList(data || []);
    } catch (err) {
      console.error('Error fetching equipment list:', err);
      setError(err.message || 'Failed to connect to equipment service.');
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

  const isOwnerOrAdmin = user && (user.role === 'owner' || user.role === 'admin');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Catalog & Marketplace</div>
          <h1 className="text-3xl font-extrabold text-slate-900">Browse Agricultural Machinery</h1>
          <p className="text-xs text-slate-600">Search available tractors, harvesters, seeders, and tillage attachments across all regions.</p>
        </div>

        {isOwnerOrAdmin && (
          <Link
            to="/equipment/new"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 w-fit shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add Equipment Listing
          </Link>
        )}
      </div>

      {/* Filter Component */}
      <SearchBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={handleResetFilters} 
      />

      {/* API Error State */}
      {error && (
        <div className="bg-red-50 p-5 rounded-xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-red-700">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <strong className="block text-sm text-red-900">Unable to load equipment catalog</strong>
              <span>{error}</span>
            </div>
          </div>
          <button 
            onClick={loadEquipment}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      )}

      {/* Loading & Grid Results */}
      {loading ? (
        <Loader message="Fetching verified equipment catalog..." />
      ) : !error && equipmentList.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <Tractor className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Machinery Matches Your Filters</h3>
          <p className="text-xs text-slate-500">Try resetting filters or searching with a broader category or location.</p>
          <button 
            onClick={handleResetFilters}
            className="text-xs font-bold text-green-700 hover:underline pt-2 inline-block cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Showing <span className="text-green-700 font-bold">{equipmentList.length}</span> verified machines</span>
            <button onClick={loadEquipment} className="hover:text-green-700 flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((item) => (
              <EquipmentCard key={item._id || item.id} item={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Equipment;

