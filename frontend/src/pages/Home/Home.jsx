import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import EquipmentCard from '../../components/EquipmentCard/EquipmentCard';
import Loader from '../../components/Loader/Loader';
import { equipmentService } from '../../services/equipmentService';
import { Tractor, ArrowRight, ShieldCheck, Zap, Coins, ThumbsUp, Wrench } from 'lucide-react';

const Home = () => {
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await equipmentService.getAll({});
        setFeaturedEquipment(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <Hero />

      {/* Featured Equipment Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Top Machine Listings</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Agricultural Machinery</h2>
          </div>
          <Link 
            to="/equipment"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            View Entire Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading verified equipment..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipment.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* How AgriRent Works Section */}
      <section className="bg-slate-950 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How AgriRent Works</h2>
            <p className="text-xs sm:text-sm text-slate-400">Simple 4-step process for renting machinery or listing your fleet.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Search & Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Find nearby tractors, harvesters, or seeders by category, horsepower, and location.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Choose Dates & Driver</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your start/end dates and optionally request an experienced operator driver.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Instant Confirmation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Equipment owner reviews the request and approves dispatch to your farm location.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
                04
              </div>
              <h3 className="text-lg font-bold text-white">Field Work & Return</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete your sowing, tilling, or harvest, return the machine, and leave a review.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Own Agricultural Machinery? Earn Extra Income Today!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              List your idle tractors and harvesters on AgriRent. Reach thousands of verified local farmers and turn underutilized equipment into reliable revenue.
            </p>
          </div>
          <Link 
            to="/register?role=owner"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-emerald-500/20 transition whitespace-nowrap"
          >
            Become Equipment Lender
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
