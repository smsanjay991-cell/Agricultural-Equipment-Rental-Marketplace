import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, User, Gauge, Fuel, ShieldCheck, ArrowRight } from 'lucide-react';

const EquipmentCard = ({ item }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-800 hover:border-emerald-500/50">
      
      {/* Equipment Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img 
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold text-emerald-400">
          {item.category}
        </div>
        
        {item.isDriverAvailable && (
          <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-md">
            Driver Available
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {item.location}
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {item.averageRating || '4.8'} ({item.numReviews || '10'})
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Quick Specifications */}
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 border-t border-slate-800/80">
            {item.horsepower > 0 && (
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                {item.horsepower} HP
              </span>
            )}
            <span className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-emerald-400" />
              {item.fuelType || 'Diesel'}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Daily Rate</span>
            <span className="text-xl font-extrabold text-emerald-400">
              ₹{item.dailyRate?.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400"> / day</span>
          </div>

          <Link 
            to={`/booking?equipmentId=${item._id}`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            Rent Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default EquipmentCard;
