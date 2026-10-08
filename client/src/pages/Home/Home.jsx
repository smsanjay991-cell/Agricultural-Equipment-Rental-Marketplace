import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import EquipmentCard from '../../components/EquipmentCard/EquipmentCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Loader from '../../components/Loader/Loader';
import { equipmentService } from '../../services/equipmentService';
import { 
  Tractor, 
  ArrowRight, 
  Wrench, 
  Sprout, 
  Wind, 
  Droplets, 
  Layers, 
  Search, 
  FileText, 
  Users,
  PlusCircle,
  Inbox
} from 'lucide-react';

const CATEGORY_DEFINITIONS = [
  { 
    title: 'Tractors', 
    key: 'Tractor', 
    icon: Tractor, 
    description: '35 to 75+ HP tractors for tilling, ploughing, and field haulage.' 
  },
  { 
    title: 'Harvesters', 
    key: 'Harvester', 
    icon: Wind, 
    description: 'Combine harvesters for efficient paddy and wheat harvesting.' 
  },
  { 
    title: 'Tillers & Rotavators', 
    key: 'Tiller', 
    icon: Wrench, 
    description: 'Rotary tillers for soil conditioning and seedbed preparation.' 
  },
  { 
    title: 'Seeders', 
    key: 'Seeder', 
    icon: Sprout, 
    description: 'Precision seed drills and planters for uniform sowing.' 
  },
  { 
    title: 'Sprayers', 
    key: 'Sprayer', 
    icon: Droplets, 
    description: 'Boom and power sprayers for crop protection and spraying.' 
  },
  { 
    title: 'Attachments', 
    key: 'Attachment', 
    icon: Layers, 
    description: 'Trolleys, cultivators, and utility implements for tractors.' 
  }
];

const Home = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        const data = await equipmentService.getAll({});
        if (isMounted) {
          setEquipmentList(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load equipment catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadFeatured();
    return () => { isMounted = false; };
  }, []);

  // Compute actual counts per category from database data (no fake numbers)
  const categoryCounts = React.useMemo(() => {
    const counts = {};
    equipmentList.forEach((item) => {
      const cat = (item.category || '').toLowerCase();
      if (cat.includes('tractor')) counts['Tractor'] = (counts['Tractor'] || 0) + 1;
      else if (cat.includes('harvest')) counts['Harvester'] = (counts['Harvester'] || 0) + 1;
      else if (cat.includes('tiller') || cat.includes('rotavator')) counts['Tiller'] = (counts['Tiller'] || 0) + 1;
      else if (cat.includes('seed')) counts['Seeder'] = (counts['Seeder'] || 0) + 1;
      else if (cat.includes('spray')) counts['Sprayer'] = (counts['Sprayer'] || 0) + 1;
      else if (cat.includes('attach')) counts['Attachment'] = (counts['Attachment'] || 0) + 1;
    });
    return counts;
  }, [equipmentList]);

  // Show up to 6 featured machines on the homepage
  const featuredEquipment = equipmentList.slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Hero & Search Section */}
      <Hero />

      {/* 2. Quick Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Browse by category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select an equipment type to view available machinery in your district.
            </p>
          </div>
          <Link
            to="/equipment"
            className="text-xs sm:text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 transition shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CATEGORY_DEFINITIONS.map((cat) => (
            <CategoryCard 
              key={cat.key}
              title={cat.title}
              categoryKey={cat.key}
              count={categoryCounts[cat.key]}
              icon={cat.icon}
              description={cat.description}
            />
          ))}
        </div>
      </section>

      {/* 3. Available Equipment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Equipment available for rent
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Find machinery available from owners near you.
            </p>
          </div>
          
          <Link 
            to="/equipment"
            className="text-xs sm:text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 transition shrink-0"
          >
            <span>View All Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading available equipment..." />
        ) : featuredEquipment.length === 0 ? (
          /* Professional Empty State */
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 max-w-md mx-auto my-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No equipment available yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equipment listed by owners will appear here. Be the first to list your machinery for local farmers.
            </p>
            <div className="pt-2">
              <Link
                to="/equipment/new"
                className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" /> List Equipment
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipment.map((item) => (
              <EquipmentCard key={item._id || item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Trust / Simple Product Benefits (No fake statistics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Benefit 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Easy to find</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search equipment by category and location.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Clear rental details</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See pricing, availability and equipment information before requesting.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Built for local farming</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect farmers with equipment owners in their area.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Owner Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Have equipment to rent?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              List your machinery and connect with farmers looking for equipment in your area.
            </p>
          </div>
          <Link 
            to="/equipment/new"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-xs transition shrink-0 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>List Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
